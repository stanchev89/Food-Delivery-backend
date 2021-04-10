const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { postController } = require("../controllers");

router.get('/', postController.getPosts);
router.post('/create_post', postController.addNewPost);
router.post('/edit_post',postController.editPost);
router.post('/delete_post',postController.deletePost)

module.exports = router;