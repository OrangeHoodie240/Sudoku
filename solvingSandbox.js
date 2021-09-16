const Analyzer = require('./Analyzer');
const difficultySettings = require('./difficultySettings');
const Generator = require('./Generator');
const Strategy = require('./Strategy');
const solve = require('./solve');
const { Board } = require('./Board');
const {createPuzzle} = require('./puzzle_making/createPuzzles');

const levelThreeA =
    `2,0,4,0,0,0,0,0,0
    0,0,0,0,0,0,6,0,0
    7,0,0,4,0,0,1,3,0
    0,1,0,7,0,0,3,9,0
    4,0,9,1,8,0,0,6,0
    0,0,8,0,0,0,0,0,0
    0,0,0,0,0,7,0,5,6
    9,0,0,6,5,1,0,7,2
    0,0,0,8,0,0,0,0,3`;

const levelThreeB = `2,0,4,1,0,6,0,0,0
0,7,0,0,0,0,0,0,5
0,0,0,2,0,7,0,0,6
1,0,0,0,3,0,6,0,0
0,8,0,6,0,0,0,0,2
0,0,3,0,2,0,0,0,0
3,0,2,8,0,4,9,0,0
9,0,6,0,0,0,8,0,4
0,0,0,0,0,2,0,1,0`;

const levelThreeC = `0,2,0,0,6,0,8,0,5
0,0,0,0,0,0,0,0,0
0,0,8,0,0,0,0,4,6
2,0,4,9,0,0,6,0,3
0,0,0,6,1,0,9,5,2
5,0,0,0,7,0,0,0,0
8,0,0,0,0,3,0,0,9
9,3,0,0,0,0,0,0,0
0,0,5,0,8,0,3,0,1`;

const data = [];
let board = new Board(levelThreeC);
while (board.cellsMissing > 0) {
    let analysis = Analyzer.analyze(board);

    // console.log('\n\n Board before Analysis');
    // console.log(Board.toString(board, true));
    // console.log('\n\n' + JSON.stringify(analysis));
    // console.log('\n\n')

    const { position, value, solveWith } = analysis;
    board = Board.addValue(board, position[0], position[1], value);
    data.push(solveWith);
}
console.log(data);


