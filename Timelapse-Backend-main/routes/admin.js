var express = require('express');
var router = express.Router();
const adminController = require("../controllers/adminController");
const { authJwt } = require("../middlewares");

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Authrozation - Admin
router.post("/login", adminController.validate('login'), adminController.login);
router.post("/check_login", adminController.validate('check_login'), adminController.checkLogin);

// User Management
router.post("/getUserListWithPagination", adminController.getUserListWithPagination);
router.post("/deleteUser", adminController.deleteUser);
router.post("/updateUser", adminController.updateUser)

module.exports = router;