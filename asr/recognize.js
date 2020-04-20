'use strict'

const crypto = require('crypto');
const https = require('https');

let HOST = "asr.ilivedata.com"; 
let URI = "/api/v1/speech/recognize";
let PROJECT_ID = "YOUR_PROJECT_ID_GOES_HERE";
let SECRET_KEY = "YOUR_SECRET_KEY_GOES_HERE";

function createSign(data, key) {
    var hmac = crypto.createHmac("sha256", key);
    return hmac.update(data).digest("base64");
}

function sendHttpRequest(sign, body, nowTime, callback) {
    var options = {
        hostname: HOST,
        port: 443,
        path: URI,
        method: 'POST',
        headers: {
            'X-AppId': PROJECT_ID,
            'X-TimeStamp': nowTime,
            'Content-type': 'application/json',
            'Authorization': sign,
            'Host': HOST,
            'Connection': 'keep-alive'
        }
    };

    var req = https.request(options, (res) => {    
        res.on('data', (d) => {
            callback(d.toString(), null);
        });
    });
    
    req.on('error', (e) => {
        callback(null, e);
    });
    
    req.write(body);
    req.end();
}

function recognize(audio, languageCcode, userId, profanityFilter, callback) {
    let codeC = "AMR_WB";
    let sampleRateHertz = "16000";

    profanityFilter = profanityFilter ? 1 : 0;
    var queryBodyJson = "{\"languageCode\": \"" + languageCcode + "\", \"profanityFilter\": " + profanityFilter + ", \"config\": {\"codec\": \"" + codeC + "\", \"sampleRateHertz\": " + sampleRateHertz + "}, \"audio\": \"" + audio + "\", \"userId\": \"" + userId + "\"}";
    
    var nowTime = new Date().toISOString().replace(/\..+/,'') + 'Z';

    var parameter = "POST\n"
                     + HOST + "\n"
                     + URI + "\n"
                     + crypto.createHash('sha256').update(queryBodyJson).digest('hex') + "\n"
                     + "X-AppId:" + PROJECT_ID + "\n"
                     + "X-TimeStamp:" + nowTime;

    var sign = createSign(parameter, SECRET_KEY);
    sendHttpRequest(sign, queryBodyJson, nowTime, callback);
}

let audioBase64 = "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";

recognize(audioBase64, "zh-CN", "12345678", true, function (result, error) {
    if (!error) {
        console.log(result);
    } else
        console.log(error);
});

recognize(audioBase64, "zh-CN", "12345678", false, function (result, error) {
    if (!error)
        console.log(result);
    else
        console.log(error);
});