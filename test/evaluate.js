var expect = require('expect.js');
var llang = require('../index');

describe('Evaluate', function() {
    it('should evaluate formulas into the correct result', function () {
        var examples = [
            {
                formula: 'A -> B',
                evaluation: [ 1, 0],
                result: false
            },
            {
                formula: 'A -> B',
                evaluation: [ 0, 0],
                result: true
            },
            {
                formula: 'A & B & C',
                evaluation: [ 1, 0, 1],
                result: false
            },
            {
                formula: 'A & B & C',
                evaluation: [ 1, 1, 1],
                result: true
            },
            {
                formula: 'A & (B | C)',
                evaluation: [ 0, 0, 1],
                result: false
            },
            {
                formula: 'A & (B | C)',
                evaluation: [ 1, 0, 1],
                result: true
            },
            {
                formula: 'A & (!B & C)',
                evaluation: [ 1, 1, 1],
                result: false
            },
            {
                formula: 'A & (!B & C)',
                evaluation: [ 1, 0, 1],
                result: true
            },
            {
                formula: 'A -> !(B -> C)',
                evaluation: [ 1, 1, 1],
                result: false
            },
            {
                formula: 'A -> !(B -> C)',
                evaluation: [ 1, 1, 0],
                result: true
            },
            {
                formula: '(A -> B) <-> (!A | B)',
                evaluation: [ 1, 1],
                result: true
            },
            {
                formula: '(A -> B) <-> (!A | B)',
                evaluation: [ 1, 0],
                result: true
            },
            {
                formula: '(A -> B) <-> (!A | B)',
                evaluation: [ 0, 0],
                result: true
            }
        ];

        examples.forEach(function (e) {
            expect(llang.evaluate(e.formula, e.evaluation)).to.be(e.result);
        });
    });
});
