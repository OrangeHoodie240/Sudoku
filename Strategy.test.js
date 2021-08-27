const Strategy = require('./Strategy'); 
const { Board } = require('./board');


describe('test _soleCandidate', ()=>{
    const boardString = 
`0,0,0,0,0,1,0,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,0,6,0,0,0
0,0,0,4,0,0,0,0,0
0,0,0,0,8,0,0,0,0
2,0,9,0,0,0,0,0,7
0,0,0,0,0,0,0,0,0
0,0,0,0,0,3,0,0,0
0,0,0,0,0,0,0,0,0`;

    const board = new Board(boardString);
    test('should return correct value', ()=>{
        expect(Strategy._soleCandidate(board, 5, 5)).toEqual('5');
    });

    test('should return false when unable to solve for cell', ()=>{
        expect(Strategy._soleCandidate(board, 8,8)).toEqual(false);
    });
});

describe('test Strategy.applyStrategy', ()=>{
    const boardString1 =  
`0,0,0,0,0,1,0,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,0,6,0,0,0
0,0,0,4,0,0,0,0,0
0,0,0,0,8,0,0,0,0
2,0,9,0,0,0,0,0,7
0,0,0,0,0,0,0,0,0
0,0,0,0,0,3,0,0,0
0,0,0,0,0,0,0,0,0`;

const boardString2 = 
`0,3,5,2,6,9,7,8,1
6,0,2,5,7,1,4,9,3
1,9,7,8,3,4,5,6,2
8,2,6,0,9,5,3,4,7
3,7,4,6,8,2,9,1,5
9,5,1,7,4,3,6,2,8
5,1,9,3,2,6,8,7,4
2,4,8,9,5,7,1,3,6
7,6,3,4,1,8,2,0,9`;


const boardString3 =
`0,0,4,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
0,4,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
5,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,0,4,0,0,0`;


    test('solves with onlySpecifiedCell set true', ()=>{
        const board = new Board(boardString1);
        const results = Strategy.applyStrategy(board, 'sole-candidate', {rowI: 5, colI: 5, onlySpecifiedCell: true});
        expect(results.solutions).toEqual([[5,5,'5']]);

        board.puzzle[5][5].value = '5';
        expect(Board.toString(results.board))
            .toEqual(Board.toString(board));
    });

    test('returns false with onlySpecifiedCell set true and cell non-solvable', ()=>{
        const board = new Board(boardString1);
        expect(Strategy.applyStrategy(board, 'sole-candidate', {rowI: 8, colI: 8, onlySpecifiedCell: true})).toEqual(false);
    });

    test('throws error when onlySpsecifiedCell and trySolveAll both set true', ()=>{
        const board = new Board(boardString1);
        expect(()=>Strategy.applyStrategy(board, 'sole-candidate', {rowI: 5, colI: 5, onlySpecifiedCell: true, trySolveAll: true}))
            .toThrowError();
    });
    test('throws error when onlySpsecifiedCell set true rowI and colI unset', ()=>{
        const board = new Board(boardString1);
        expect(()=>Strategy.applyStrategy(board, 'sole-candidate', {onlySpecifiedCell: true}))
            .toThrowError();
    });


    test('solves from specified point and onwards but not before when trySolveAll set false', ()=>{
        const board = new Board(boardString2); 
        const results = Strategy.applyStrategy(board, 'sole-candidate', {rowI: 1, colI: 1}); 
        expect(results.solutions)
            .toEqual([[1, 1, '8'], [3, 3,'1'], [8, 7, '5']])

        board.puzzle[1][1].value = '8';
        board.puzzle[3][3].value = '1'; 
        board.puzzle[8][7].value = '5'; 
        expect(Board.toString(results.board))
            .toEqual(Board.toString(board)); 
    });

    test('solves from specified point and onwards and then back to beginning with trySolveAll set true', ()=>{
        const board = new Board(boardString2); 
        const results = Strategy.applyStrategy(board, 'sole-candidate', {rowI: 1, colI: 1, trySolveAll: true}); 
        expect(results.solutions)
            .toEqual([[1, 1, '8'], [3, 3,'1'], [8, 7, '5'], [0,0,'4']])

        board.puzzle[0][0].value = '4';
        board.puzzle[1][1].value = '8';
        board.puzzle[3][3].value = '1'; 
        board.puzzle[8][7].value = '5'; 
        expect(Board.toString(results.board))
            .toEqual(Board.toString(board)); 
    });

    test('passing additionalArgs to the strategy function works', ()=>{
        const board = new Board(boardString3); 

        expect(Strategy.applyStrategy(board, 'unique-candidate', {rowI: 7, colI: 0, additionalArgs: ['4']}).solutions)
            .toEqual([[7,0,'4']]);

        expect(Strategy.applyStrategy(board, 'unique-candidate', {rowI: 7, colI: 0, additionalArgs: ['2']}))
            .toEqual(false);
        
    });
});


describe('test _uniqueCandidate', ()=>{
    const boardString =
    `0,0,4,0,0,0,0,0,0
    0,0,0,0,0,0,0,0,0
    0,0,0,0,0,0,0,0,0
    0,0,0,0,0,0,0,0,0
    0,4,0,0,0,0,0,0,0
    0,0,0,0,0,0,0,0,0
    5,0,0,0,0,0,0,0,0
    0,0,0,0,0,0,0,0,0
    0,0,0,0,0,4,0,0,0`;

    test('solves correct value', ()=>{
        const board = new Board(boardString);
        expect(Strategy._uniqueCandidate(board, 7, 0))
            .toEqual('4');
    });

    test('additonalArguments and returns false on unsolvable', ()=>{
        const board = new Board(boardString);
        expect(Strategy._uniqueCandidate(board, 7, 0, 2))
            .toEqual(false);
    });
});


describe('test Strategy._nakedSubset', ()=>{
    const boardString1 = 
`0,2,0,1,0,0,0,0,0
0,0,6,0,0,0,0,0,0
5,0,3,0,0,0,0,0,0
0,3,0,0,0,0,0,0,0
0,1,0,0,2,0,6,0,0
0,0,0,6,0,0,0,0,0
8,0,0,0,0,0,0,0,0
0,0,0,0,0,0,0,0,0
9,0,0,0,0,0,0,0,0`

const boardString2 = 
`6,8,7,0,0,4,5,2,3
9,5,3,0,0,2,6,1,4
1,4,2,3,5,6,9,7,8
3,1,0,0,0,7,2,4,6
7,6,0,0,0,0,3,0,5
0,2,0,0,0,0,7,0,1
0,9,6,0,0,1,0,3,2
2,3,0,0,0,0,0,5,7
0,7,0,0,0,0,0,6,9`;

    test('solve for correct answer using col structure', ()=>{
        const board = new Board(boardString1, {calculate: true});
        let result = Strategy._nakedSubset(board, 1, 0, 2, 'col');
        expect(result)
            .toEqual('1');

        result = Strategy._nakedSubset(board, 5, 0, 2, 'col');
        expect(result)
            .toEqual('2');
    });

    test('solves for correct answer using box structure', ()=>{
        const board = new Board(boardString2, {calculate: true});
        let result = Strategy._nakedSubset(board, 3, 3, 2, 'box');
        expect(result)
            .toEqual('5');
    });

    test('returns updated possibilities when solveForPossibilities is set', ()=>{
        board = new Board(boardString2, {calculate: true});
        let result = Strategy._nakedSubset(board, 5, 5, 2, 'box', true);
        expect(result)
        .toEqual(new Set(['5','3']));
    });
});