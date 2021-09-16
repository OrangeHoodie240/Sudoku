const { Worker, parentPort } = require('worker_threads');
const { Board } = require('../Board');


async function createWorker(level) {
    return new Promise(function (resolve, reject) {
        const worker = new Worker('./puzzle_making/puzzleWorker.js', { workerData: { level } });
        worker.on('message', board => resolve(board));
    });
}


function createWorkerSync(level) {
    const worker = new Worker('./puzzle_making/puzzleWorker.js', { workerData: { level } });
    const promise = new Promise(function (resolve, reject) {
        worker.on('message', board => resolve(board));
    });
    promise.worker = worker;
    return promise;
}


async function createPuzzles(level, puzzleNum) {
    let puzzleWorkers = [];
    for (let i = 0; i < puzzleNum; i++) {
        puzzleWorkers.push(createWorker(level));
    }
    let boards = await Promise.all(puzzleWorkers);
    return boards;
}


async function createPuzzle(level, threadNum = 5) {
    let puzzleWorkers = [];
    for (let i = 0; i < threadNum; i++) {
        puzzleWorkers.push(createWorkerSync(level));
    }

    let results = await Promise.race(puzzleWorkers);
    puzzleWorkers.forEach(promise => {
        promise.worker.terminate();
    });
    return results;
}



module.exports = { createPuzzles, createPuzzle};



