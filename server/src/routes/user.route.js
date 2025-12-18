const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

const { checkRole, validateUser } = require("../middlewares");

router.delete("/deleteAllUsers", userController.deleteAllUsers);

router.get("/", userController.getAllUsers);
// router.post('/', validateUser, checkRole('admin'), userController.createUser); ---------HAVE RBAC
router.post("/", validateUser, userController.createUser);
router.get("/:id", userController.getUserById);
router.put("/:id", validateUser, userController.updateUser); // VALIDATE USER DATA ON UPDATE
router.delete("/:id", userController.deleteUser);

module.exports = router;
