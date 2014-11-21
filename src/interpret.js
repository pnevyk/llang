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
            if (typeof args[i] == 'object')
                args[i] = process(args[i].action, args[i].args);
        }

        return actions[action](args);
    }
}
