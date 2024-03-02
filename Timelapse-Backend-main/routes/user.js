var express = require('express');
var router = express.Router();
const userController = require("../controllers/userController");
const { authJwt } = require("../middlewares");

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/login", userController.login);
router.post("/oauth", userController.oauth);
router.post("/signup", userController.signup);
router.post("/check_login", userController.check_login);
router.post("/verifiedUser", userController.verifiedUser);
router.post("/resetPassword", userController.resetPassword);

module.exports = router;