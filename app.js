//const mysql = require('mysql');
const axios = require('axios');
const querystring = require('querystring');
const config = require('./config').config;
const async = require('async');
const loggerDevelopment = require('./config/winstonDevelopment').logger;
const loggerLive = require('./config/winstonLive').logger;
let logger = {};
let targetObject = {};

const instance = axios.create();
instance.defaults.timeout = config.process.requestTimeOut;

if (process.argv[2] == 'dev') {
    targetObject = config.dev;
    logger = loggerDevelopment;
} else {
    targetObject = config.live;
    logger = loggerLive;
}

setInterval(() => {
    logger.info("[MONITERING] Start...!");
    healthCheck((error, result) => {
        async.eachSeries(targetObject.apiAndDatabaseList, (serverObject, callback) => {
            checkAPIAndDatabase(serverObject, (error, result) => { callback(null, null); });
        }, (error, result) => {
            logger.info('[MONITERING] Complete...!');
        });
    });
}, config.process.checkInterval);

function checkAPIAndDatabase(serverObject, callback) {
    const start = new Date();
    instance.get(serverObject.url)
    .then((response) => {
        const timeDiff = new Date() - start;
        if (response.data.result == "success") {
            logger.info(`checkAPIAndDatabase : ${serverObject.url} : ${response.data.result} : ${timeDiff}ms : failCount = ${serverObject.failCount}`);

            // 정상화 알림
            if(serverObject.failCount >= targetObject.notificationBaseValue)
                sendWarning(`[API_DATABASE_NORMALIZED] URL - ${serverObject.url} : failCount = ${serverObject.failCount}`);

            serverObject.failCount = 0;
        } else {
            serverObject.failCount += 1;
            logger.error(`checkAPIAndDatabase : ${serverObject.url} : ${response.data.result} : ${timeDiff}ms : failCount = ${serverObject.failCount}`);

            if (serverObject.failCount == targetObject.notificationBaseValue)
                sendWarning(`[DATABASE_FAIL] URL - ${serverObject.url} Other : failCount = ${serverObject.failCount}`);
        }
        callback(null, null);
    }).catch((error) => {
        serverObject.failCount += 1;
        logger.error(`checkAPIAndDatabase : ${serverObject.url} : Axios Error : ${error} : failCount = ${serverObject.failCount}`);

        if (serverObject.failCount == targetObject.notificationBaseValue)
            sendWarning(`[REST_FAIL] URL - ${serverObject.url} ${error} : failCount = ${serverObject.failCount}`);

        callback(null, null);
    });
}

function healthCheck(callback) {
    async.eachSeries(targetObject.healthCheck.serverList, (serverObject, callback) => {
        const start = new Date();
        instance.get(serverObject.url)
        .then((response) => {
            const timeDiff = new Date() - start;
            const result = removeEnter(response.data);
            
            if (result == 'OK') {
                logger.info(`healthCheck : ${serverObject.url} : ${result} : ${timeDiff}ms : failCount = ${serverObject.failCount}`);
                
                // 정상화 알림
                if(serverObject.failCount >= targetObject.notificationBaseValue)
                    sendWarning(`[HEALTH_CHECK_NOMALIZED] URL - ${serverObject.url} : failCount = ${serverObject.failCount}`);

                serverObject.failCount = 0;
            } else {
                serverObject.failCount += 1;
                logger.error(`healthCheck : ${serverObject.url} : fail : ${timeDiff}ms : failCount = ${serverObject.failCount}`);

                if (serverObject.failCount == targetObject.notificationBaseValue)
                    sendWarning(`[HEALTH_CHECK_FAIL] URL - ${serverObject.url} : failCount = ${serverObject.failCount}`);
            }
            callback(null, null);
        }).catch((error) => {
            serverObject.failCount += 1;
            logger.error(`healthCheck : Axios Send Error : ${serverObject.url} : ${error} : failCount = ${serverObject.failCount}`);

            if (serverObject.failCount == targetObject.notificationBaseValue)
                sendWarning(`[HEALTH_CHECK_FAIL] URL - ${serverObject.url} : ${error} : failCount = ${serverObject.failCount}`);

            callback(null, null);
        });
    }, (error, result) => {
        if (error) logger.error(`healthCheck Error : ${error}`);
        
        callback(null, null);
    });
}

//sendWarning("Warning Test 한글 ==============");

function sendWarning(message) {
    logger.error('[SEND_WARNING]====================================================');
    logger.error(message);
    sendNateOn(`${message} (${new Date()})`);
    //sendSMS(message);
}

function sendNateOn(message) {
    axios.post(targetObject.nateOnWebHook
        , querystring.stringify({ content: message })
        , { headers: { "Content-Type": `application/x-www-form-urlencoded`}})
    .then((response) => {
        //logger.info(response.status);
    }).catch((error) => { logger.error(`sendNateOn catch : ${error}`); });
}
/*
//sendSMS("응답이 느려요");
function sendSMS(message) {
    logger.info('sendSMS');

    let query = "INSERT INTO rd_data.hp_msg(MSG_TYPE, SEND_PHONE, DEST_PHONE, SUBJECT, MSG_BODY, VXML_FILE, REQUEST_TIME, SEND_TIME) VALUES ";

    for (let i = 0; i < config.smsTargetList.length; i++) {
        if (i > 0) query += ", ";

        query += `(${config.smsTargetList[i].MSG_TYPE}, '${config.smsTargetList[i].SEND_PHONE}', '${config.smsTargetList[i].DEST_PHONE}', 
            '${config.smsTargetList[i].SUBJECT}', '${message}', '${config.smsTargetList[i].VXML_FILE}', NOW(), NOW())`;
    }

    const connection = mysql.createConnection(config.database);
    connection.connect();
    let que = connection.query(query, (error, result) => {
        logger.info(que.sql);
        if (error) logger.info(error);
        logger.info(result);
    });
    
    connection.end();
}
*/
function removeEnter(string) {
    let value = string.replace(/(\n| )/g,"");
    value = value.replace(/\r/g, "");
    return value;
}