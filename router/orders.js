const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const {orderController} = require("../controllers");

router.post('/', orderController.getUserOrders);
router.post('/new_order',auth(), orderController.postNewOrder);


module.exports = router;