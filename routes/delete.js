const express = require("express");
const {isLoggedin} = require("./middlewares"); 

const { Post, User} = require('../models');

const router = express.Router(); 

router.delete("/:id",isLoggedin,async (req,res,next)=>{
    //console.log("삭제되냐고!! : ",req.params.id);

    try {
        await Post.destroy({where : { id : req.params.id}});
        res.send("Delete Ok"); 
    } catch (err){
        console.error(err); 
        next(error);
    }
    
});

module.exports= router; 