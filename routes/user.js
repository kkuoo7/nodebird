const express = require("express"); 
const { User } = require('../models');

const {isLoggedin} = require("./middlewares"); 
//const {addFollowing} = require("../controllers/user");

const router = express.Router(); 

router.post("/:twitUserId/follow", isLoggedin, async(req, res, next) => {
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
  
      if (user) {
        await user.addFollowing(parseInt(req.params.twitUserId, 10));
        res.send('success');
      } else {
        res.status(404).send('no user');
      }

    } 
    catch (err) {
      console.error(err);
      next(err);
    }
  }
);

router.post("/:twitUserId/unfollow", isLoggedin, async(req, res, next) => {
    try {
        console.log("왜오애ㅗ애ㅗ애ㅗ애ㅗ애ㅗ애ㅗ애"); 

        const user = await User.findOne({ where : {id : req.user.id}});
        
        if(user) {
            await user.removeFollowing(parseInt(req.params.twitUserId, 10));
            console.log('언팔로우 성공');

            res.redirect('/');
        } 
        else {
            res.status(404).send('사용자가 검색되지 않아 팔로잉 해제가 불가능합니다.'); 
        }

    } 
    catch(err) {
        console.error(err);
        next(err); 
    }
})


  
module.exports = router; 