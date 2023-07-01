const express = require('express');
const dayjs = require('dayjs');
const db = require('../db');

const router = express.Router();


router.get('/', async(request, response) =>{
    let allPost = [];
    try {
        allPost = await db
            .select('post.id','post.title','post.from','post.createdAt')
            .count('comment.id as CommentCount')
            .from('post')
            .leftJoin('comment','post.id', 'comment.postid')
            .groupBy('post.id')
            .orderBy('post.id', 'desc');
    
        allPost = allPost.map(post => {
            const createdAtText = dayjs(post.createdAt).format('D MMM YYYY - HH:mm');
            return {...post, createdAtText};
            
        });
        console.log(allPost);
    } catch (error) {
        console.error(error);
    }
    response.render('home', { allPost });
});



module.exports = router;
