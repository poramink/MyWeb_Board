const express = require('express')
const dayjs = require('dayjs');
const db = require('../db');
const { response } = require('express');
const { request } = require('http');
const router = express.Router();

async function getPostAndComment(postId){
    let onePost = null;
    let postComments =[];
    try {
        //Get one post
        const somePOst = await db
            .select('*')
            .from('post')
            .where('id', +postId);

        onePost =somePOst[0];
        onePost.createdAtText = dayjs(onePost.createdAt).format('D MMM YYYY - HH:mm');

        //Get post comment
        postComments = await db
            .select('*')
            .from('comment')
            .where('postid', +postId);
        postComments = postComments.map(Comment => {
            const createdAtText = dayjs(Comment.createdAt).format('D MMM YYYY - HH:mm');
            return {...Comment, createdAtText};
       });

    } catch (error) {
        console.error(error);
    }
    const customTitle = !!onePost ? `${onePost.title} | ` : 'ไม่พบสัส | ';
    return { onePost, postComments, customTitle};
}

router.get('/new', (request,response) =>{
    response.render('postNew');
});

router.post('/new', async(request, response) => {
    const { title,content,from,accepted } = request.body ?? {};
   
    try {
        //validation
        if(!title || !content || !from){
            throw new Error('no text');
        }
        else if (accepted !='on'){
            throw new Error('no accepted');
        }
        //creat post
        await db.insert({ title,content,from, createdAt: new Date()}).into('post');

    } catch (error) {
        console.error(error);
        let errorMessage = 'ผิดพลาด';
        if (error.message === 'no text'){
            errorMessage = 'ใส่ให้ครบ'
        }
        else if (error.message = 'no accepted'){
            errorMessage = 'กดยอมรับ';
        }
        return response.render('postNew', { errorMessage, values:{title,content,from}});
    }
    response.redirect('/p/new/done');
});

router.get('/new/done', (require, response)=>{
    response.render('postNewDone');
});



router.get('/:postId', async(request,response) =>{
    const { postId } = request.params;
    const postData = await getPostAndComment(postId);
    response.render('postid',postData);
});

router.post('/:postId/comment', async(request,response) =>{
    const {postId} = request.params;
    const { content,from,accepted } = request.body ?? {};
   
    try {
        //validation
        if(!content || !from){
            throw new Error('no text');
        }
        else if (accepted !='on'){
            throw new Error('no accepted');
        }
        //creat comment
        await db.insert({ content,from, createdAt: new Date(), postId: +postId}).into('comment');

    } catch (error) {
        console.error(error);
        let errorMessage = 'ผิดพลาด';
        if (error.message === 'no text'){
            errorMessage = 'ใส่ให้ครบ'
        }
        else if (error.message = 'no accepted'){
            errorMessage = 'กดยอมรับ';
        }
        const postData = await getPostAndComment(postId);
        return response.render('postid', { ...postData ,errorMessage, values:{content,from}});
    }
    response.redirect(`/p/${postId}`);
});



module.exports = router;