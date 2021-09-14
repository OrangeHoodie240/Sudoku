const {Worker, parentPort} = require('worker_threads'); 
const { Board } = require('../Board');


async function createWorker(level){
    return new Promise((resolve, reject)=>{
        const worker = new Worker('./puzzle_making/puzzleWorker.js', {workerData: {level}}); 
        worker.on('message', board => resolve(board)); 
    });
}



async function createPuzzles(level, puzzleNum){
    let puzzleWorkers = []; 
    for(let i = 0; i < puzzleNum; i++){
        puzzleWorkers.push(createWorker(level));
    }
    let boards =  await Promise.all(puzzleWorkers); 
    return boards;
}

async function createPuzzle(level, threadNum = 5){
    let puzzleWorkers = []; 
    for(let i = 0; i < threadNum; i++){
        puzzleWorkers.push(createWorker(level));
    }

    return await Promise.race(puzzleWorkers); 
}




module.exports = {createPuzzles, createPuzzle}; 


