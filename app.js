const express = require('express'); 
const cookieParser = require("cookie-parser"); 
const morgan = require("morgan"); 
const path = require('path');
const session = require("express-session"); 
const nunjucks = require('nunjucks'); 
const dotenv = require('dotenv'); 

const passport = require("passport");

const helmet = require("helmet");
const hpp = require("hpp"); 
// 이 2개를 사용하면 서버의 각종 취약점을 보완해준다. 

dotenv.config(); 

// const redis = require('redis'); 
// const RedisStore = require("connect-redis")(session); 
// //.env에 있는 값을 써야하므로 dotenv.config() 아래에 있어야 한다. 
// const redisClient = redis.createClient({
//     url : `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//     password : process.env.REDIS_PASSWORD,
// }); // 여기서 생성한 redisClient를 express-session 에 추가한다. 
// // 원래는 메모리에 세션을 저장하지만 이제는 RedisStore에 저장한다는 뜻이다.
// // 이를 통한 멀티 프로세스를 이용할 때 프로세스 간의 세션을 공유할 수 있다. 

const pageRouter = require("./routes/page"); 
const { sequelize } = require('./models');
const logger = require("./logger.js"); 

const authRouter = require("./routes/auth");
const passportConfig = require("./passport/index");;
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const deleteRouter = require("./routes/delete");

const app = express(); 
app.set('port',process.env.PORT || 8081);
app.set('view engine','html'); 
nunjucks.configure('views', {
    express : app,
    watch : true,
}); 

passportConfig(); // 패스포트 설정 

// app.use(cors({
//     origin : '*', 
//     Credential : true,
// }));


sequelize.sync({force : false })
    .then(()=>{
        console.log("데이터 베이스 연결 성공");
    })
    .catch((err)=>{
        console.error(err);
    });

if(process.env.NODE_ENV === "production") {
    app.use(morgan("combined")); 
    app.use(helmet());
    app.use(hpp({contentSecurityPolicy : false})); 
} else {
    app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname,'public'))); 
app.use('/img',express.static(path.join(__dirname,'uploads')));

// 프론트 서버에서 post, put, patch로 보낸 데이터를 req.body에 넣어주는 역할 
app.use(express.json()); 
app.use(express.urlencoded({extended : false})); 

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));


// const sessionOption = { // 배포시에 express-session을 사용하는 법 
//     resave : false,
//     saveUninitialized : false,
//     secret : process.env.COOKIE_SECRET, 
//     cookie : {
//         httpOnly : true,
//         secure : false,
//     },

//     store : new RedisStore({client : redisClient}),
// }; 
// if(process.env.NODE_ENV === "production") {
//     sessionOption.proxy = true;; 
// }
// app.use(session(sessionOption));


app.use(passport.initialize()); // req.login 과 req.logout 메소드 자동생성
app.use(passport.session());

app.use("/",pageRouter); 
app.use("/auth",authRouter);
app.use("/post",postRouter);
app.use("/user",userRouter);
app.use("/delete",deleteRouter);

app.use((req,res,next)=> {
    const error  = new Error(`${req.method} ${req.url} 라우터가 없습니다.`); 
    error.status = 404; 
    logger.info("hello"); 
    logger.error(error.message); 

    next(error); 
})


app.use((err,req,res,next)=> {
    res.locals.message = err.message; 
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500); 
    res.render('error');  
}); 

module.exports = app; 


