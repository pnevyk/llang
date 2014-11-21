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
            substitutions[primitive] = !!values[index];
        });

        return substitutions;
    };
}
