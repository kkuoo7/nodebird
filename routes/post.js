const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
const { isLoggedin } = require('./middlewares');
const { POINT_CONVERSION_COMPRESSED } = require('constants');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      console.log("In post.js muler, file.originalname : ",file.originalname);

      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedin, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}`, flag : "hello" });
});


const upload2 = multer();

router.post('/', isLoggedin, upload2.none(), async (req, res, next) => {
  try {
    console.log("in post.js req.body : ",req.body);
    
    const post = await Post.create({
        include : [{
            model : User
        }],
        content: req.body.content,
        img: req.body.url,
        USerId: req.user.id,
    });
    
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    //console.log("In post.js this is hashtags: ",hashtags);

    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
    //  console.log("In post.js this is result of hashtag, result : ",result);
      await post.addHashtags(result.map(r => r[0]));
      //console.log("In post.js this is final post",post);
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:twitId/like", isLoggedin, async(req,res,next)=>{
    
    try{
        const post = await Post.findOne({where : {id : req.params.twitId}});

        if(post){
            await post.addLiker(parseInt(req.user.id, 10)); 
            console.log("좋아요 성공")
            res.redirect('/')
        } 
        
        
    } catch (err){
        console.error(err); 
        next(err);
    }
}); 

router.post("/:twitId/unlike", isLoggedin, async(req, res, next) => {

  try {
    const post = await Post.findOne({ where : { id : req.params.twitId }}); 

    if(post) {
      await post.removeLiker(parseInt(req.user.id, 10)); 

      console.log("좋아요 취소성공")
      res.redirect('/')
    }
    else {
      console.log("게시글을 찾을 수 없다.")
      res.status(404).redirect('/')
    }

  }
  catch(err) {
    console.error(err); 
    next(err); 
  }
});

module.exports = router;