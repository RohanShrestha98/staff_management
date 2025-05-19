const express = require("express");
const router = express.Router();
const userControler = require("../controllers/user");

router.get("/", userControler.getUsers);
router.post("/sign-up", userControler.signUp);
router.post("/login", userControler.login);
router.patch("/update/:id", userControler.updateUser);
router.delete("/delete/:id", userControler.deleteUser);

module.exports = router;
