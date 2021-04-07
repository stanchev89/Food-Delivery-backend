const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { dishController } = require("../controllers");
// middleware that is specific to this router

router.get("/", dishController.getDailyMenu);

router.get("/category/:category", dishController.getDishesByCategory);

// router.post("/add-new-dish", auth(), dishController.addNewDish);


// router.get('/my-trips/:id/reservations', auth(), themeController.getReservations);

module.exports = router;