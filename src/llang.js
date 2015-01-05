/**
 * @requires lex.js, parse.js, scope.js, interpret.js
 */
var llang = {
    _evaluate : function (formula, evaluation, tokens, vars) {
        var tree = parse(tokens);
        var initializator = getInitializator(vars);
        return interpret(tree, initializator.apply(initializator, evaluation));
    },
    evaluate : function (formula, evaluation) {
        var tokens = lex(formula);
        return this._evaluate(formula, evaluation, tokens, getVariables(tokens));
    },
    evaluateAll : function (formula) {
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
    _ : {
        lex : lex,
        parse : parse,
        getInitializator : getInitializator,
        getVariables : getVariables,
        interpret : interpret
    }
};

if (typeof window != 'undefined') {
    window.llang = llang;
}

else {
    module.exports = llang;
}
