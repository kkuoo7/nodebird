const {createLogger, format, transports} = require("winston"); 

const logger = createLogger({
    level : "info", // llogger의 심각도를 의미한다. 
    format : format.json(), // 로그의 형식으로 기본적으로 json 파일로 저장. 로그 시간을 표시하려면
    // timestamp를 쓰는 것이 좋다. 

    transports : [ // 로그의 저장방식
        new transports.File({filename : 'combined.log'}), // 파일로 저장한다는 뜻이다. 
        new transports.File({filename : 'error.log', level : "error"}),
    ]
}); 

if(process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({format : format.simple()})); 
    // new transports.Console()은 콘솔에 출력한다는 뜻이디.
}

module.exports = logger;