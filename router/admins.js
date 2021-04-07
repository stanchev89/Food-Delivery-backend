const express = require("express");
const router = express.Router();
const { adminController, dishController, userController } = require("../controllers");
const { adminModel, userModel, dishModel } = require("../models");
const { adminAuth } = require("../utils");
const validator = require("../validators");


router.post(
	"/register",
	validator.checkMinLength(3, "username"),
	validator.checkMinLength(5, "password"),
	validator.onlyEnglishAndNumbers("username", "password"),
	validator.checkUsernameExisting(adminModel),
	validator.handleValidationErrors,
	adminController.register
);
router.post(
	"/login",
	validator.checkMinLength(3, "username"),
	validator.checkMinLength(5, "password"),
	validator.onlyEnglishAndNumbers("username", "password"),
	validator.handleValidationErrors,
	adminController.login
);
router.post("/logout", adminController.logout);

router.get("/profile", adminController.getProfileInfo);

router.put("/profile",
	adminController.editProfileInfo);
router.post('/change_password',
	// adminAuth(),
	validator.checkMinLength(5, 'oldPassword', 'newPassword'),
	validator.handleValidationErrors,
	adminController.changeUserPassword
);

router.get('/users/', adminController.getAllUsers);



router.get('/food/',
	// adminAuth(),
	dishController.getAllDishes
);
router.get('/food/daily_menu',
	// adminAuth(),
	dishController.getDailyMenu
);

router.post('/food/add_new_dish',
	// adminAuth(),
	dishController.addNewDish
);

router.get('/food/dish/:id',
	// adminAuth(),
	dishController.getDish
);

router.put('/food/dish/:id',
	// adminAuth(),
	dishController.editDish
);
router.post('/food/dish/:id',
	// adminAuth(),
	dishController.removeDish
);





module.exports = router;