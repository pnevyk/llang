function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

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
