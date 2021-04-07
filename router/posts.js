const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { postController } = require("../controllers");

router.get('/', postController.getPosts);
router.post('/create_post', auth(), postController.addNewPost);
router.post('/edit_post',auth(),postController.editPost)

module.exports = router;