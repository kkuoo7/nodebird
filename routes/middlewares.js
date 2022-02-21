exports.isLoggedin = (req,res,next)=>{
    if(req.isAuthenticated()) {
        next(); 
    } else {
        res.status(403);
        res.redirect("/");
    }
}

exports.isNotLoggedin = (req,res,next)=>{ 
    if(!req.isAuthenticated()){ // 로그인이 안되어있을 때
        next(); 
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.'); 
        res.redirect(`?/error=${message}`);
    }
}