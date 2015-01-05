/* llang 0.0.2 by Petr Nevyhoštěný <petr.nevyhosteny@gmail.com> */
(function () {
    'use strict';

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    //for n = 2 it returns
    // [ 0, 0 ]
    // [ 0, 1 ]
    // [ 1, 0 ]
    // [ 1, 1 ]


    function generateCombinations(n) {
        var combs = [];
        var comb;
        var str;

        for (var i = 0; i < Math.pow(2, n); i++) {
            str = i.toString(2);
            comb = [];

            for (var j = 0; j < n; j++)
            comb.push(j < n - str.length ? 0 : +str[j - n + str.length]);

            combs.push(comb.slice(0));
        }

        return combs;
    }


    /**
     * @requires util.js
     */

    function getVariables(tokens) {
        tokens = clone(tokens);
        var token;
        var variables = [];

        while (next()) {
            if (token.type == 'variable') {
                variables.push(token.value);
            }
        }

        return variables.sort(function (a, b) {
            return a > b ? 1 : -1;
        }).filter(function (item, index, arr) {
            return arr.indexOf(item) == index;
        });

        function next() {
            //TODO: use pointer instead of shifting
            //(parse would not need to clone tokens array)
            return (token = tokens.shift());
        }
    }

    function getInitializator(variables) {
        return function () {
            var substitutions = {};
            var values = arguments;

            variables.forEach(function (primitive, index) {
                substitutions[primitive] = !! values[index];
            });

            return substitutions;
        };
    }


    /**
     * @requires util.js
     */

    function parse(tokens) {
        tokens = clone(tokens);
        var token;
        return process();

        function process(operation) {
            operation = operation || null;
            var args = [];

            while (next()) {
                if (token.type == 'boundary') {
                    if (token.value == '(') args.push(process());
                    else if (token.value == ')') return node(operation, args);
                }

                else if (token.type == 'variable') {
                    args.push(node('substitution', [token.value]));
                    if (isUnary(operation)) return node(operation, args);
                }

                else if (token.type == 'operator') {
                    if (isUnary(token.value)) {
                        args.push(process(token.value));
                        continue;
                    }

                    if (operation) {
                        var tmp = args.slice(0);
                        args = [];
                        args.push(node(operation, tmp));
                    }

                    operation = token.value;
                }
            }

            return node(operation, args);
        }

        function next() {
            //TODO: use pointer instead of shifting
            //(parse would not need to clone tokens array)
            return (token = tokens.shift());
        }

        function node(action, args) {
            return {
                action: translate(action),
                args: args
            };
        }

        function translate(operator) {
            var map = {
                '!': 'negation',
                '|': 'disjunction',
                '&': 'conjunction',
                '->': 'implication',
                '<->': 'equivalence'
            };

            return map[operator] || operator;
        }

        function isUnary(op) {
            return op === '!';
        }

        function syntaxError() {
            throw new Error('Syntax error!');
        }
    }


    /**
     * @requires util.js
     */

    function interpret(tree, substitutions) {
        tree = clone(tree);
        var actions = {
            substitution: function (args) {
                return substitutions[args[0]];
            },
            negation: function (args) {
                return !args[0];
            },
            disjunction: function (args) {
                return args[0] || args[1];
            },
            conjunction: function (args) {
                return args[0] && args[1];
            },
            implication: function (args) {
                return !args[0] || args[1];
            },
            equivalence: function (args) {
                return (args[0] && args[1]) || (!args[0] && !args[1]);
            }
        };

        return process(tree.action, tree.args);

        function process(action, args) {
            for (var i = 0; i < args.length; i++) {
                if (typeof args[i] == 'object') args[i] = process(args[i].action, args[i].args);
            }

            return actions[action](args);
        }
    }


    function lex(input) {
        var pointer = 0;
        var tokens = [];
        var c;
        var operator = '';

        while (next()) {
            if (isSpecial(c)) {
                operator += c;
                if (operatorExists(operator)) {
                    push('operator', operator);
                    operator = '';
                }
            }

            else {
                if (operator.length) unrecognizedToken(operator, pointer - operator.length - 1);

                if (isWhiteSpace(c)) continue;
                else if (isVariable(c)) push('variable', c.toUpperCase());
                else if (isExpressionBoundary(c)) push('boundary', c);
                else unrecognizedToken(c, pointer - 2);
            }
        }

        return tokens;

        function next() {
            return (c = input[pointer++]);
        }

        function push(type, value) {
            tokens.push({
                type: type,
                value: value
            });
        }

        function isWhiteSpace(c) {
            return /\s/.test(c);
        }

        function isVariable(c) {
            return /[A-Za-z]/.test(c);
        }

        function isSpecial(c) {
            return /[<>\-|&!]/.test(c);
        }

        function isExpressionBoundary(c) {
            return /[\(\)]/.test(c);
        }

        function operatorExists(op) {
            return ['!', '|', '&', '->', '<->'].indexOf(op) !== -1;
        }

        function unrecognizedToken(token, position) {
            throw new Error('Unrecognized token "' + token + '" on position ' + position + '!');
        }
    }


    /**
     * @requires lex.js, parse.js, scope.js, interpret.js
     */
    var llang = {
        _evaluate: function (formula, evaluation, tokens, vars) {
            var tree = parse(tokens);
            var initializator = getInitializator(vars);
            return interpret(tree, initializator.apply(initializator, evaluation));
        },
        evaluate: function (formula, evaluation) {
            var tokens = lex(formula);
            return this._evaluate(formula, evaluation, tokens, getVariables(tokens));
        },
        evaluateAll: function (formula) {
            var tokens = lex(formula);
            var vars = getVariables(tokens);
            var n = vars.length;
            var result = [];
            var combinations = generateCombinations(n);

            for (var i = 0, count = Math.pow(2, n); i < count; i++) {
                result.push(this._evaluate(formula, combinations[i], tokens, vars));
            }

            return result;
        },
        _: {
            lex: lex,
            parse: parse,
            getInitializator: getInitializator,
            getVariables: getVariables,
            interpret: interpret
        }
    };

    if (typeof window != 'undefined') {
        window.llang = llang;
    }

    else {
        module.exports = llang;
    }
})();