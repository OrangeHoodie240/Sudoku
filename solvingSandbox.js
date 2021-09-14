const Analyzer = require('./Analyzer');
const difficultySettings = require('./difficultySettings');
const Generator = require('./Generator');
const Strategy = require('./Strategy');
const solve = require('./solve');
const { Board } = require('./Board');
const { createPuzzle, createPuzzles } = require('./puzzle_making/createPuzzles');

const board3 =
    `1,2,4,3,6,0,7,0,9
    3,0,8,1,7,9,2,0,0
    0,7,9,2,4,0,0,1,3
    2,0,0,0,0,0,0,7,0
    0,0,0,0,2,7,0,3,5
    7,9,0,0,1,0,0,2,8
    4,0,0,7,5,0,3,9,0
    0,3,2,0,0,1,0,0,7
    9,0,7,4,3,0,0,6,0`;

// const expertBoard = ``;

const data = [];
let board = new Board(`8,1,0,3,0,5,6,7,0
0,0,0,1,7,0,0,0,0
3,0,7,0,0,9,1,0,0
1,0,8,4,0,0,0,0,0
0,7,0,9,1,8,3,5,6
0,0,6,7,0,0,0,0,0
0,0,0,0,9,0,0,0,0
7,0,3,0,0,1,0,0,2
9,8,0,0,3,7,0,0,0`);
while (board.cellsMissing > 0) {
    let analysis = Analyzer.analyze(board);

    console.log('\n\n Board before Analysis');
    console.log(Board.toString(board, true));
    console.log('\n\n' + JSON.stringify(analysis));
    console.log('\n\n')

    const { position, value, solveWith } = analysis;
    board = Board.addValue(board, position[0], position[1], value);
    data.push(solveWith);
}