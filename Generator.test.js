const Generator = require('./Generator');
const Strategy = require('./Strategy'); 
const solve = require('./solve'); 
const {Board} = require('./Board');


describe('test Generator._generateFullBoard', ()=>{
    test('generates full board', ()=>{
        for(let i = 0; i < 10; i++){
            let board = Generator._generateFullBoard(); 
            expect(board.cellsMissing)
                .not.toEqual(0);
        }
        
        
    }); 

});


/*
    TEST 
        _getRandomFilledCellIndices
        generatePuzzle
        _applyDificultySettings

*/