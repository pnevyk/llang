/**
 * @requires lex.js, parse.js, scope.js, interpret.js
 */
var llang = {
    evaluate : function (formula, evaluation) {
        var tokens = lex(formula);
        var tree = parse(tokens);
        var initializator = getInitializator(getVariables(tokens));
        return interpret(tree, initializator.apply(initializator, evaluation));
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
