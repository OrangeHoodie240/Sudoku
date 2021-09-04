const Analyzer = require('./Analyzer');
const difficultySettings = require('./difficultySettings');
const Generator = require('./Generator');
const Strategy = require('./Strategy');
const solve = require('./solve');
const { Board } = require('./Board');

const board3 =
    `1,0,0,5,0,6,0,0,0
    0,3,0,0,0,7,0,0,0
    7,0,9,1,0,0,3,0,6
    0,0,0,4,0,8,0,0,7
    0,5,0,3,0,0,8,0,0
    0,9,7,0,0,0,0,0,0
    0,7,1,0,2,0,5,0,0
    0,0,0,0,0,0,0,0,3
    0,0,2,0,0,0,9,6,0`;

const data = [];
let board = new Board(board3);
while (board.cellsMissing > 0) {
    let analysis = Analyzer.analyze(board);
    console.log('\n\n Board before Analysis');
    console.log(Board.toString(board, true));
    console.log('\n\n' + analysis);
    console.log('\n\n')

    const {position, value, solveWith} = JSON.parse(analysis);
    board = Board.addValue(board, position[0], position[1], value);
    data.push(solveWith);

}
console.log('\n');

console.log(data);

