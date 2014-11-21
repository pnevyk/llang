var llang = require('../index');
var formula;

function info(text) {
    console.log('\x1b[1m\x1b[30m' + text + '\x1b[0m');
}

function positive(text) {
    console.log('\x1b[1m\x1b[30mresult: \x1b[0m\x1b[32mtrue\x1b[0m\n');
}

function negative(text) {
    console.log('\x1b[1m\x1b[30mresult: \x1b[0m\x1b[31mfalse\x1b[0m\n');
}

info('Type a formula:');

process.stdin.on('data', function (chunk) {
    if (!formula) {
        formula = chunk.slice(0, -1).toString();
        info('Type evaluation for variables separated by space (for A=1, B=0 type `1 0`)');
    }

    else {
        var tmp = chunk.slice(0, -1).toString();
        tmp = tmp.split(' ');
        tmp = tmp.map(function (i) { return +i });
        tmp = llang.evaluate(formula, tmp);
        if (tmp) positive();
        else negative();
        formula = null;
        info('Type a formula:');
    }
});
