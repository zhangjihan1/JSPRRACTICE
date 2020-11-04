'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}



/*
 * Complete the 'getNumDraws' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts INTEGER year as parameter.
 */
const https = require('https');

async function getNumDraws(year) {
    
    let totalDrawn = 0;
    
    for (let i = 0; i < 10; i++) {
        let url = `https://jsonmock.hackerrank.com/api/football_matches?year=${year}&team1goals=${i}&team2goals=${i}&page=1`;
        totalDrawn += await getPageTotal(url);
    }
    
    return totalDrawn;
}

async function getPageTotal(url) {
    let total = 0;
    let promise = new Promise(function (resolve, reject) {
        https.get(url, function (response) {
            let reqData = "";
            response.on("data", chunk => {
                reqData += chunk.toString();
            })
            response.on("end", () => {
                resolve(JSON.parse(reqData).total);
            });
        }).on("error", function (err) {
            console.log("Error: " + err.message);
        });
    });
    return promise;
}

async function main() {