const express = require('express');
const { Post, User, Hashtag } = require('../models');
const { isLoggedin, isNotLoggedin } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => { 
  res.locals.user = req.user;
  res.locals.followerCount =  req.user ? req.user.Followers.length : 0,
  res.locals.followingCount = req.user ? req.user.Followings.length : 0,
  res.locals.followerIdList = req.user ? req.user.Followings.map(f=>f.id) : []; 
  next();
});

router.get('/profile', isLoggedin, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedin, (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({ 
            include : [{ 
                model : User,
                attributes : ['id','nick'],
            }, {
              model: User,
              attributes: ['id'],
              as : 'Liker'
            }], 

            order : [['createdAt', 'DESC']],
        });

        likeObject = posts.map(post => post.Liker)
        idObject = posts.map(post => post.id)

        ObjectToArray = Object.entries(likeObject); 
       
        like2DArray = ObjectToArray.map(arr => {
          return arr[1]
        }) 
        //console.log("like2DArray :", like2DArray);

        likeList = like2DArray.map(arr => arr.map(f => f.id)); 
        //console.log(likeList);


        dicLike = {} 
        for (let i = 0; i<idObject.length; i++) {
          dicLike[idObject[i]] = likeList[i]
        }

        res.render('main',{
          title: "NodeBird",
          twits : posts,
          dicLike: dicLike
      });

    } catch (err) {
        console.error(err); 
        next(err); 
    }
    
  });

  router.get("/hashtag", isLoggedin, async (req,res,next)=> {
    let query = req.query.hashtag; // query는 #을 제외하고 검색한 해쉬태그(문자열 타입)

    if(!query) {
      return res.redirect("/"); 
    }

    try {
  
      const hashtag = await Hashtag.findOne({where : {title : query}}); 
      let posts = []; 
     // console.log("In page.js, hashtag : ",hashtag+"\n");
      
      if(hashtag) {
        posts = await hashtag.getPosts({ include : [{model : User}]}); // 검색된 해쉬태그가 들어간 트윗을 모두 가져온다. 
      } 

      return res.render('main', {
        title : `${query} | NodeBird`,
        twits : posts,
        hashtags : hashtag
      }); 

    } catch (error) {
      console.error(error); 
      return next(error); 
    }
  });


module.exports = router;