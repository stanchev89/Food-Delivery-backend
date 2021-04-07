const express = require("express");
const router = express.Router();
const {userController} = require("../controllers");
const {userModel} = require("../models");
const {auth} = require("../utils");
const validator = require("../validators");


router.post(
    "/register",
    auth(false),
    validator.checkMinLength(3, "username"),
    validator.checkMinLength(5, "password"),
    validator.onlyEnglishAndNumbers("username", "password"),
    validator.checkUsernameExisting(userModel),
    validator.handleValidationErrors,
    userController.register
);
router.post(
    "/login",
    validator.checkMinLength(3, "username"),
    validator.checkMinLength(5, "password"),
    validator.onlyEnglishAndNumbers("username", "password"),
    validator.handleValidationErrors,
    userController.login
);
router.post("/logout", userController.logout);

router.get("/profile", auth(false), userController.getProfileInfo);

router.put("/profile", auth(true), userController.editProfileInfo);


router.post('/change_password',
    auth(),
    validator.checkMinLength(5, 'oldPassword', 'newPassword'),
    validator.handleValidationErrors,
    userController.changeUserPassword
);


module.exports = router;