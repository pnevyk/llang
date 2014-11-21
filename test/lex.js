var expect = require('expect.js');
var llang = require('../index');

describe('Lex', function() {
    it('should return an array', function () {
        expect(llang._.lex('A | B')).to.be.an('array');
    });

    it('should transform well-formed formula into array of tokens', function () {
        var expected = [
            { type: 'variable', value: 'A' },
            { type: 'operator', value: '->' },
            { type: 'variable', value: 'B' }
        ];

        expect(llang._.lex('A -> B')).to.eql(expected);
    });

    it('should handle parentheses as subexpression boundaries', function () {
        var expected = [
            { type: 'variable', value: 'A' },
            { type: 'operator', value: '&' },
            { type: 'boundary', value: '(' },
            { type: 'variable', value: 'B' },
            { type: 'operator', value: '|' },
            { type: 'boundary', value: '(' },
            { type: 'variable', value: 'C' },
            { type: 'operator', value: '->' },
            { type: 'variable', value: 'D' },
            { type: 'boundary', value: ')' },
            { type: 'boundary', value: ')' }
        ];

        expect(llang._.lex('A & (B | (C -> D))')).to.eql(expected);
    });

    it('should return correct tokens independently on whitespaces', function () {
        var expected = [
            { type: 'variable', value: 'A' },
            { type: 'operator', value: '<->' },
            { type: 'variable', value: 'B' }
        ];

        expect(llang._.lex('A    <->B  ')).to.eql(expected);
    });

    it('should transform primitives into capital letters', function () {
        var expected = [
            { type: 'variable', value: 'A' },
            { type: 'operator', value: '&' },
            { type: 'variable', value: 'B' }
        ];

        expect(llang._.lex('a & b')).to.eql(expected);
    });
});
