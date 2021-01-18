const config = {
    process: {
        requestTimeOut: 10000
        , checkInterval: 15000
    }
    , dev : {
        nateOnWebHook: 'https://teamroom.nate.com/api/webhook/0c062513/D4eISxiRnLFGs3BD72fuXzSF'
        , notificationBaseValue: 3
        , apiAndDatabaseList: [
            { url: 'https://devapi2.dalbitlive.com/socket/dbCheck/bySocket', fail: false, failCount: 0 }
            , { url: 'http://wadmin2.inforex.co.kr/socket/dbCheck/bySocket', fail: false, failCount: 0 }
            , { url: 'https://devphoto2.dalbitlive.com/socket/dbCheck/bySocket', fail: false, failCount: 0 }
            , { url: 'https://devpay2.dalbitlive.com/socket/dbCheck/bySocket', fail: false, failCount: 0 }
            //, { url: 'http://121.134.5.188:8000/ttest', fail: false, failCount: 0 }
        ]
        , socket: {
            serverList: [
                { url:'https://sv163.dalbitlive.com:8000/health-check', fail: false, failCount: 0 }
                , {url:'https://sv164.dalbitlive.com:8000/health-check', fail: false, failCount: 0 }
            ]
        }
        , healthCheck: {
            serverList: [
                { url: 'https://devapi2.dalbitlive.com/ctrl/check/service', fail: false, failCount: 0 }
                , { url: 'https://devpay2.dalbitlive.com/ctrl/check/service', fail: false, failCount: 0 }
                , { url: 'https://devphoto2.dalbitlive.com/ctrl/check/service', fail: false, failCount: 0 }
                , { url: 'https://devm2.dalbitlive.com/ctrl/check/service', fail: false, failCount: 0 }
                , { url: 'https://devwww2.dalbitlive.com/ctrl/check/service', fail: false, failCount: 0 }
            ]
        }
    }
    , live : {
        nateOnWebHook: 'https://teamroom.nate.com/api/webhook/0c062513/xzLUzzXo86RCNk1hUHul3GsM'
        , notificationBaseValue: 3
        , apiAndDatabaseList: [
            { url: 'https://api.dalbitlive.com/socket/dbCheck/bySocket', fail: false, failCount: 0 }
            , { url: 'http://dalbit.inforex.co.kr/socket/dbCheck/bySocket', fail: false, failCount: 0 }
        ]
        , socket: {
            serverList: [
                { url:'https://sv163.dalbitlive.com:8000/health-check', fail: false, failCount: 0 }
                , {url:'https://sv164.dalbitlive.com:8000/health-check', fail: false, failCount: 0 }
            ]
        }
        , healthCheck: {
            serverList: [
                { url: 'https://api.dalbitlive.com/ctrl/check/service', fail: false, failCount: 0 }
                //, { url: 'http://dalbit.inforex.co.kr/ctrl/check/service', fail: false, failCount: 0 }
            ]
        }
    }
    
    /*, database: {
        host: '125.141.223.157'
        , user: 'inforex'
        , password: 'inforex'
        , database: 'rd_data'
        , dateStrings: 'date'
        , port: 13306
        , multipleStatements: true
    }
    , smsTargetList: [
        { MSG_TYPE: 0, SEND_PHONE: '1522-0251', DEST_PHONE: '010-2049-1354', SUBJECT: 'API 체크', MSG_BODY: '응답이 느립니다.', VXML_FILE: '99' }
    ]*/
};

exports.config = config;