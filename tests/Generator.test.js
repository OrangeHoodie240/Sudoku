const Generator = require('../Generator');
const Strategy = require('../Strategy');
const difficultySettings = require('../difficultySettings');
const solve = require('../solve');
const { Board } = require('../Board');



describe('test Generator._generateFullBoard', () => {
    test('generates full board', () => {
        for (let i = 0; i < 10; i++) {
            let board = Generator._generateFullBoard();
            expect(board.cellsMissing)
                .toEqual(0);
        }


    });

});

describe('test Generator.generatePuzzle', () => {
    test('level-two requires naked-subset at setSize=2', () => {
        let iterations = (process.env.LOOP) ? Number(process.env.LOOP) : 1;
        for (let i = 0; i < iterations; i++) {
           let board = Generator.generatePuzzle('level-two');
           const levelOne = difficultySettings['level-one'];
           const levelTwo = difficultySettings['level-two']; 

           let results = Generator._applyDifficultySetting(board, levelOne, Date.now());
            expect(results.solvedBoard.cellsMissing === 0)
                .toBe(false);

            results = Generator._applyDifficultySetting(board, levelTwo, Date.now()); 
            expect(results.solvedBoard.cellsMissing === 0)
                .toBe(true);
        }
    });
});

/*
    TEST
        _getRandomFilledCellIndices
        generatePuzzle
        _applyDificultySettings

*/