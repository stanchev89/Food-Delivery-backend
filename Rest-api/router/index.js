const router = require("express").Router();
const users = require("./users");
const dishes = require("./dishes");
const admins = require("./admins");
const posts = require('./posts')

router.use("/user", users);
router.use("/dishes", dishes);
router.use("/cms", admins);
router.use("/posts", posts);

module.exports = router;