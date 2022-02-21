const passport = require("passport");

const local = require("./localStrategy"); 
const kakao = require("./kakaoStrategy"); 

const User = require("../models/user");
let countDeserial = 0; 

module.exports = () => {
    passport.serializeUser((user, done)=>{ 
        // serializeUser는 passport.authenticate의 return req.login 에 의해서 실행 

        console.log("passport/index.js에서 serializeUser 실행"); 
        done(null, user.id); // 이 함수가 실행되면, req.session에서 user.id 전달 

         // user.id 만 전달되는 이유는 
        // user 정보 (사용자 정보)를 모두 담고 쿠키로 전달하기에는 무리가 있으니까
        // id만 쿠키에 담아 브라우저에 보내고 다시 요청이 왔을 때 받은 id로 DB에서 
        // 꺼내서 작업하기 위함이다.  
    }); 

    passport.deserializeUser((id,done)=>{ 
        // 로그인 완료 이후, 매 요청 들어올 때 마다 passport.session이 passport.deserializeUser을 호출 
        // 라우터에 요청이 도달하기 전에 req.session에 저장된 id(첫 번째 매개변수)로 DB에서 사용자 조회 
        // 조회한 사용자 정보를 req.user에 저장하므로 이후 라우터에서 req.user 사용 가능
        // 따라서  req.user에 들어있는 값을 변경하고 싶으면 deserialIzeUser를 변경해야 한다. 
        
        console.log("passport/index.js에서 deserializeUser 실행");

        User.findOne({
            where : {id},
            include : [
                {
                    model : User,
                    attributes : ['id','nick'],
                    as : "Followers",  // req.user에 Followers 항을 추가해준다. 
                },

                {
                    model : User,
                    attributes : ['id','nick'],
                    as : 'Followings', // req.user에 Followings 항을 추가해준다.
                }
            ]
        })
        .then(user => done(null, user)) 
        .catch(err=> done(err)); 
    }); 

    local(); 
    //kakao();
};