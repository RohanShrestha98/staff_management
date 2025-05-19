const express = require("express");
const router = express.Router();
const storeControler = require("../controllers/store");

router.get("/", storeControler.getStore);
router.post("/create", storeControler.createStore);
router.patch("/update/:id", storeControler.updateStore);
router.delete("/delete/:id", storeControler.deleteStore);

module.exports = router;
