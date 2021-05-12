const router = require("express").Router();
const users = require("./users");
const dishes = require("./dishes");
const admins = require("./admins");
const posts = require('./posts');
const orders = require('./orders');

router.use("/user", users);
router.use("/dishes", dishes);
router.use("/cms", admins);
router.use("/posts", posts);
router.use("/orders",orders);

module.exports = router;