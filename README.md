## llang

It's a pleasure to introduce you __llang__ - an interpreter of well-formed formulas in propositional calculus written in JavaScript (both browser and node.js). Use is simple, just pass a formula and input evaluation for variables in formula and see the result. And there will be more! I am going to make some extension functions such as truth table generator, function to decide whether formula is either tautology, contradiction or satisfiable or one formula is semantic consequence/equivalence of another or not.

## Example

```js
llang.evaluate('A | B', [1, 0]); //returns true
llang.evaluate('A & B', [0, 1]); //returns false
llang.evaluate('(A -> (B -> C)) -> ((A -> B) -> (A -> C))', [0, 0, 0]); //returns true

llang.evaluateAll('A -> B'); //returns [ true, true, false, true ]
llang.evaluateAll('(A | C) -> (A & B)'); //returns [ true, false, true, false, false, false, true, true ]
```

## Installation

### Node

```bash
$ npm install llang
```

### Browser

```html
<script type="text/javascript" src="path/to/llang.js"></script>
```

## Operators

### Negation

Unary operator which returns true if the following variables is false and vice versa.

__Symbol:__ `!`

| __A__ | __R__ |
|-------|-------|
|   0   | __1__ |
|   1   | __0__ |

### Disjunction

Binary operator which returns false if both operands are false, otherwise returns true.

__Symbol:__ `|`

__Truth table:__

| __A__ | __B__ | __R__ |
|-------|-------|-------|
|   0   |   0   | __0__ |
|   0   |   1   | __1__ |
|   1   |   0   | __1__ |
|   1   |   1   | __1__ |

### Conjunction

Binary operator which returns true if both operands are true, otherwise returns false.

__Symbol:__ `&`

__Truth table:__

| __A__ | __B__ | __R__ |
|-------|-------|-------|
|   0   |   0   | __0__ |
|   0   |   1   | __0__ |
|   1   |   0   | __0__ |
|   1   |   1   | __1__ |

### Implication

Binary operator which returns false if the first operand are true and the second is false, otherwise returns true.

__Symbol:__ `->`

__Truth table:__

| __A__ | __B__ | __R__ |
|-------|-------|-------|
|   0   |   0   | __1__ |
|   0   |   1   | __1__ |
|   1   |   0   | __0__ |
|   1   |   1   | __1__ |

### Equivalence

Binary operator which returns true if both operands have the same value, otherwise returns false.

__Symbol:__ `<->`

__Truth table:__

| __A__ | __B__ | __R__ |
|-------|-------|-------|
|   0   |   0   | __1__ |
|   0   |   1   | __0__ |
|   1   |   0   | __0__ |
|   1   |   1   | __1__ |

## Variables

Variables are representations of values which will be replaced by actual values passed in evaluation argument. Valid values are letters from A to Z. Evaluation will be used on variables in alphabetical order. It doesn't matter if you use upper case or lower case letters.

## Parentheses

Parentheses set priority of evaluation. They delimit the subexpression which will be evaluated with higher priority.

## See it in action!

You want to try it but you are lazy to write a small script which uses this library? No problem! There are two files in `evaluations` folder. The first is a small node script which runs in console. Just run `node <path/to/script>/node.js` and type your formulas. The second file is an HTML page which asks you using JavaScript prompts. Just open it in your browser.

## Weaknesses

There is poor syntax error detection yet. It will be improved but for this moment, write your formulas correctly.

## License

llang is MIT licensed. Feel free to use it, contribute or spread the word. Created with love by Petr Nevyhoštěný ([Twitter](https://twitter.com/pnevyk)).
