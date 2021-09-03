const Analyzer = require('./Analyzer');
const difficultySettings = require('./difficultySettings');
const Generator = require('./Generator');
const Strategy = require('./Strategy');
const solve = require('./solve');
const { Board } = require('./Board');

const originalBoardString = 
`1,0,4,0,0,7,6,0,9
0,7,8,1,0,0,2,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,7,0,0,9,5
0,5,0,3,0,2,0,7,1
0,0,7,8,0,0,0,0,0
0,0,0,9,0,0,5,3,0
0,0,0,2,1,6,0,0,0
0,9,0,0,0,3,0,0,8`;

let boardString = 
`1,0,4,0,0,7,6,0,9
0,7,8,1,0,0,2,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,7,0,0,9,5
0,5,0,3,0,2,0,7,1
0,0,7,8,0,0,0,0,0
0,0,0,9,0,0,5,3,0
0,0,0,2,1,6,0,0,0
0,9,0,0,0,3,0,0,8`;


let board = new Board(boardString);
while(board.cellsMissing > 0){
    let analysis = Analyzer.analyze(board);
    console.log('\n\n Board before Analysis');
    console.log(Board.toString(board, true));
    console.log('\n\n' + analysis);
    console.log('\n\n')

    analysis = JSON.parse(analysis); 
    board = Board.addValue(board, analysis.position[0], analysis.position[1], analysis.value); 
}
console.log('\n');
console.log(Board.toString(board, true));