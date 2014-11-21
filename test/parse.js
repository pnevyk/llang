var expect = require('expect.js');
var llang = require('../index');

describe('Parse', function() {
    it('should return an object', function () {
        var input = [
            { type: 'variable', value: 'A' },
            { type: 'operator', value: '->' },
            { type: 'variable', value: 'B' }
        ];

        expect(llang._.parse(input)).to.be.an('object');
    });

    it('should transform an array of tokens into parse tree', function () {
        var input = [
            { type: 'variable', value: 'A' },
            { type: 'operator', value: '->' },
            { type: 'variable', value: 'B' }
        ];

        var expected = {
            action: 'implication',
            args: [
                {
                    action: 'substitution',
                    args: [ 'A' ]
                },
                {
                    action: 'substitution',
                    args: [ 'B' ]
                }
            ]
        };

        expect(llang._.parse(input)).to.eql(expected);
    });

    it('should return correct sequence of evaluation when multiple operators are used', function () {
        var input = [
            { type: 'variable', value: 'A' },
            { type: 'operator', value: '|' },
            { type: 'variable', value: 'B' },
            { type: 'operator', value: '->' },
            { type: 'variable', value: 'C' }
        ];

        var expected = {
            action: 'implication',
            args: [
                {
                    action: 'disjunction',
                    args: [
                        {
                            action: 'substitution',
                            args: [ 'A' ]
                        },
                        {
                            action: 'substitution',
                            args: [ 'B' ]
                        }
                    ]
                },
                {
                    action: 'substitution',
                    args: [ 'C' ]
                }
            ]
        };

        expect(llang._.parse(input)).to.eql(expected);
    });

    it('should handle unary operations correctly', function () {
        var input = [
            { type: 'operator', value: '!' },
            { type: 'variable', value: 'A' },
            { type: 'operator', value: '|' },
            { type: 'variable', value: 'B' },
            { type: 'operator', value: '|' },
            { type: 'operator', value: '!' },
            { type: 'variable', value: 'C' }
        ];

        var expected = {
            action: 'disjunction',
            args: [
                {
                    action: 'disjunction',
                    args: [
                        {
                            action: 'negation',
                            args: [
                                {
                                    action: 'substitution',
                                    args: [ 'A' ]
                                }
                            ]
                        },
                        {
                            action: 'substitution',
                            args: [ 'B' ]
                        }
                    ]
                },
                {
                    action: 'negation',
                    args: [
                        {
                            action: 'substitution',
                            args: [ 'C' ]
                        }
                    ]
                }
            ]
        };

        expect(llang._.parse(input)).to.eql(expected);
    });

    it('should process subexpressions defined by parentheses in correct order', function () {
        var input = [
            { type: 'boundary', value: '(' },
            { type: 'variable', value: 'A' },
            { type: 'operator', value: '|' },
            { type: 'variable', value: 'B' },
            { type: 'boundary', value: ')' },
            { type: 'operator', value: '&' },
            { type: 'boundary', value: '(' },
            { type: 'variable', value: 'C' },
            { type: 'operator', value: '->' },
            { type: 'boundary', value: '(' },
            { type: 'variable', value: 'A' },
            { type: 'operator', value: '<->' },
            { type: 'variable', value: 'D' },
            { type: 'boundary', value: ')' },
            { type: 'boundary', value: ')' }
        ];

        var expected = {
            action: 'conjunction',
            args: [
                {
                    action: 'disjunction',
                    args: [
                        {
                            action: 'substitution',
                            args: [ 'A' ]
                        },
                        {
                            action: 'substitution',
                            args: [ 'B' ]
                        }
                    ]
                },
                {
                    action: 'implication',
                    args: [
                        {
                            action: 'substitution',
                            args: [ 'C' ]
                        },
                        {
                            action: 'equivalence',
                            args: [
                                {
                                    action: 'substitution',
                                    args: [ 'A' ]
                                },
                                {
                                    action: 'substitution',
                                    args: [ 'D' ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        expect(llang._.parse(input)).to.eql(expected);
    });
});
