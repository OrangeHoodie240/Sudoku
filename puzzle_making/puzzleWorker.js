const {workerData, parentPort} = require('worker_threads');
const Generator = require('../Generator'); 
const {Board} = require('../Board');

let level = workerData.level;
let board = Generator.generatePuzzle(level); 
board = Board.serialize(board);
parentPort.postMessage(board);


