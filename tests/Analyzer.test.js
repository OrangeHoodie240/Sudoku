const Analyzer = require('../Analyzer');
const { Board } = require("../Board");

describe('Analyzer', ()=>{
const boardString = 
`1,0,4,0,0,7,6,0,9
0,7,8,1,0,0,2,0,0
0,0,0,0,0,0,0,0,0
0,0,0,0,7,0,0,9,5
0,5,0,3,0,2,0,7,1
0,0,7,8,0,0,0,0,0
0,0,0,9,0,0,5,3,0
0,0,0,2,1,6,0,0,0
0,9,0,0,0,3,0,0,8`;

const solvedString = 
`1,3,4,5,2,7,6,8,9
6,7,8,1,3,9,2,5,4
5,2,9,4,6,8,7,1,3
2,4,3,6,7,1,8,9,5
8,5,6,3,9,2,4,7,1
9,1,7,8,4,5,3,2,6
7,6,1,9,8,4,5,3,2
3,8,5,2,1,6,9,4,7
4,9,2,7,5,3,1,6,8`


    test('works', ()=>{
        const expectedData = [
            '{"success":true,"position":[1,4],"value":"5","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[1,8],"value":"8","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[8,8],"value":"4","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[2,8],"value":"5","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[3,8],"value":"1","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[8,9],"value":"7","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[8,7],"value":"9","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[9,7],"value":"1","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[3,7],"value":"7","solveWith":["unique-candidate"]}',
            '{"success":true,"position":[9,4],"value":"7","solveWith":["unique-candidate"]}',
            '{"success":true,"position":[7,1],"value":"7","solveWith":["unique-candidate"]}',
            '{"success":true,"position":[9,5],"value":"5","solveWith":["unique-candidate"]}',
            '{"success":true,"position":[6,6],"value":"5","solveWith":["unique-candidate"]}',
            '{"success":true,"position":[4,6],"value":"1","solveWith":["unique-candidate"]}',
            '{"success":true,"position":[6,2],"value":"1","solveWith":["unique-candidate"]}',
            '{"success":true,"position":[7,3],"value":"1","solveWith":["unique-candidate"]}',
            '{"success":true,"position":[9,1],"value":"4","solveWith":["naked-subset{setSize-2}"]}',
            '{"success":true,"position":[4,2],"value":"4","solveWith":["unique-candidate"]}',
            '{"success":true,"position":[4,4],"value":"6","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[3,4],"value":"4","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[2,6],"value":"9","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[3,6],"value":"8","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[7,6],"value":"4","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[7,5],"value":"8","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[3,9],"value":"3","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[2,9],"value":"4","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[8,2],"value":"8","solveWith":["pointing-pairs-and-tripples","hidden-subset{setSize-2}"]}',
            '{"success":true,"position":[1,2],"value":"3","solveWith":["pointing-pairs-and-tripples","hidden-subset{setSize-2}"]}',
            '{"success":true,"position":[1,5],"value":"2","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[2,1],"value":"6","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[2,5],"value":"3","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[3,5],"value":"6","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[3,2],"value":"2","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[7,2],"value":"6","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[7,9],"value":"2","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[6,9],"value":"6","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[9,8],"value":"6","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[9,3],"value":"2","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[6,8],"value":"2","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[4,3],"value":"3","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[4,7],"value":"8","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[4,1],"value":"2","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[5,7],"value":"4","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[6,7],"value":"3","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[5,5],"value":"9","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[6,5],"value":"4","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[6,1],"value":"9","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[3,1],"value":"5","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[3,3],"value":"9","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[5,1],"value":"8","solveWith":["sole-candidate"]}',
            '{"success":true,"position":[5,3],"value":"6","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[8,1],"value":"3","solveWith":["last-remaining-cell"]}',
            '{"success":true,"position":[8,3],"value":"5","solveWith":["last-remaining-cell"]}'
          ];

          let board = new Board(boardString);
          let data = [];
          while(board.cellsMissing > 0){
              let analysis = Analyzer.analyze(board);
              data.push(analysis); 
              analysis = JSON.parse(analysis); 
              board = Board.addValue(board, analysis.position[0], analysis.position[1], analysis.value); 
          }

          expect(Board.toString(board))
            .toEqual(solvedString); 

          expect(data)
            .toEqual(expectedData);
    });
});