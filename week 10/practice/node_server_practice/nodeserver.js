const http = require('http');
const https = require('https');
const Stream = require('stream').Transform;
const url = require('url');
const fs = require('fs');
const baseDirectory = __dirname;   // or whatever base directory you want
const port = 8888;

//(0) 定义 HTTP 头部返回信息
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET'
};

http.createServer(function (request, response) {
    try {
        if (request.method === "POST") {
            saveImageHandler(request, response);
        } else if (request.method === "GET") {
            if (request.url === "/images") getImageFileHandler(response);
            else staticResourceHandler(request, response);
        }

    } catch (e) {
        response.writeHead(500)
        response.end() // end the response so browsers don't hang
        console.log(e.stack)
    }

}).listen(port)

//【跟新】返回服务器上的静态资源
function staticResourceHandler(request, response) {
    let fsPath = baseDirectory + request.url;
    let fileStream = fs.createReadStream(fsPath)
    fileStream.pipe(response);
    fileStream.on('open', function () {
        response.writeHead(200);
    })
    fileStream.on('error', function (e) {
        response.writeHead(404);     // assume the file doesn't exist
        response.end();
    })
}

//处理保存图片到服务器上的POST Request
function saveImageHandler(request, response) {
    console.log("POST Requird: receive new image data from client to be saved on server.");

    //定义了一个reqData变量，用于暂存请求体的信息
    let reqData = "";

    //读取客户端发来的一段一段数据，通过req的data事件监听函数，每当接受到请求体的数据， 就累加到reqData中
    request.on("data", chunk => {
        reqData += chunk.toString();
    })

    //在end事件触发后，所有数据读取完毕
    request.on("end", () => {
        //处理图片链接数据
        let imgData = JSON.parse(reqData);
        console.log(imgData);
        for (let img of imgData) {
            console.log(`Save image ${img.id} to server.`);
            downloadImg(img);
        }
        //发送响应数据
        response.writeHead(200, headers);
        response.write(`All ${imgData.length} images has been saved to server.`);
        response.end();
    })
}


//下载图片并保存
function downloadImg(img) {
    https.get(img.link, function (response) {
        let data = new Stream();
        response.on('data', function (chunk) {
            data.push(chunk);
        });
        response.on('end', function () {
            fs.writeFileSync(`./imgs/${img.id}.jpg`, data.read());
        });
    }).on("error", function (err) {
        console.log("Error: " + err.message);
    });
}

//从服务器本地获取图片名字
function getImageFileHandler(response) {
    console.log("GET Requird: return all image file names from server.");
    let fileArray = fs.readdirSync("./imgs");
    //发送响应数据
    response.writeHead(200, headers);
    response.write(JSON.stringify(fileArray));
    response.end();
}

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');