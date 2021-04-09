const {postModel} = require('../models');

function getPosts(req, res, next) {
    return postModel.find()
        .populate({path: 'author', select: 'username'})
        .then(posts => res.json(posts))
        .catch(next);
};

function addNewPost(req, res, next) {
    if(req.user || req.body.userId) {
        const newPost = {
            title: req.body.newPost.title,
            description: req.body.newPost.description,
            likes: [],
            dislikes: [],
            author: req.user._id || req.body.userId
        };
        postModel.find({ author: newPost.author,
            description: newPost.description,
            title: newPost.title
        }).then(exist => {
            if(exist.length > 0) {
                res.status(409).send({message: `The post is already published!`});
                return;
            }
            return postModel.create(newPost)
                .then(post => {
                    return getPosts(req,res,next);
                }).catch(next)
        })
    }else {
        res.status(401).send({message: 'Unauthorized!'})
    }

}

function editPost (req,res,next) {
    const post = req.body.post;
    const userId = req.user._id || req.body.userId;
    if(userId === post.author) {
        const update = {
            $set : {
                title: post.title,
                description: post.description,
                likes: post.likes,
                dislikes: post.dislikes
            }
        }
    
        postModel.findOneAndUpdate({_id: post._id}, update)
            .then(() =>  {
               return getPosts(req,res,next);
            } )
            .catch(next);  
        }
}


module.exports = {
    getPosts,
    addNewPost,
    editPost
}