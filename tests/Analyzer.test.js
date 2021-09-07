const Analyzer = require('../Analyzer');
const { Board } = require("../Board");

describe('Analyzer', () => {
    const boardString =
        `1,0,0,4,6,7,9,0,0
        0,0,0,8,0,9,1,0,7
        0,8,0,0,0,0,0,0,0
        2,0,0,0,0,6,0,0,0
        4,0,0,2,0,0,0,6,0
        0,0,8,0,0,0,0,5,2
        0,1,0,0,3,0,0,0,9
        0,0,2,6,0,0,0,0,0
        8,0,0,9,4,0,0,7,5`;

    const solvedString =
`1,2,5,4,6,7,9,3,8
3,4,6,8,5,9,1,2,7
7,8,9,1,2,3,5,4,6
2,3,1,5,7,6,8,9,4
4,5,7,2,9,8,3,6,1
6,9,8,3,1,4,7,5,2
5,1,4,7,3,2,6,8,9
9,7,2,6,8,5,4,1,3
8,6,3,9,4,1,2,7,5`;


    test('works', () => {
        const expectedData = [
            [ 'unique-candidate' ],
            [ 'unique-candidate' ],
            [ 'unique-candidate' ],
            [ 'unique-candidate' ],
            [ 'unique-candidate' ],
            [ 'pointing-pairs-and-tripples' ],
            [ 'pointing-pairs-and-tripples' ],
            [ 'unique-candidate' ],
            [ 'pointing-pairs-and-tripples' ],
            [ 'unique-candidate' ],
            [ 'unique-candidate' ],
            [ 'sole-candidate' ],
            [ 'sole-candidate' ],
            [ 'last-remaining-cell' ],
            [ 'unique-candidate' ],
            [ 'unique-candidate' ],
            [ 'naked-subset{setSize-2}' ],
            [ 'unique-candidate' ],
            [ 'unique-candidate' ],
            [ 'sole-candidate' ],
            [ 'last-remaining-cell' ],
            [ 'last-remaining-cell' ],
            [ 'hidden-subset{setSize-2}' ],
            [ 'unique-candidate' ],
            [ 'box-line-reduction' ],
            [ 'last-remaining-cell' ],
            [ 'sole-candidate' ],
            [ 'last-remaining-cell' ],
            [ 'sole-candidate' ],
            [ 'last-remaining-cell' ],
            [ 'sole-candidate' ],
            [ 'last-remaining-cell' ],
            [ 'last-remaining-cell' ],
            [ 'last-remaining-cell' ],
            [ 'sole-candidate' ],
            [ 'sole-candidate' ],
            [ 'sole-candidate' ],
            [ 'last-remaining-cell' ],
            [ 'sole-candidate' ],
            [ 'sole-candidate' ],
            [ 'sole-candidate' ],
            [ 'last-remaining-cell' ],
            [ 'last-remaining-cell' ],
            [ 'last-remaining-cell' ],
            [ 'last-remaining-cell' ],
            [ 'sole-candidate' ],
            [ 'last-remaining-cell' ],
            [ 'sole-candidate' ],
            [ 'last-remaining-cell' ],
            [ 'last-remaining-cell' ],
            [ 'last-remaining-cell' ],
            [ 'last-remaining-cell' ],
            [ 'last-remaining-cell' ]
          ];
            

        let board = new Board(boardString);
        const originalCellCount = board.cellsMissing; 
        let data = [];
        while (board.cellsMissing > 0) {
            let analysis = Analyzer.analyze(board);
            const { position, solveWith, value } = analysis;
            data.push(solveWith);
            board = Board.addValue(board, position[0], position[1], value);
        }

        expect(Board.toString(board))
            .toEqual(solvedString);

        expect(data)
            .toEqual(expectedData);

        expect(data.length)
            .toEqual(originalCellCount);
    });
});