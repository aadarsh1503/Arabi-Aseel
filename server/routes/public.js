const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

router.get("/menus/:lang", publicController.getMenus); // lang = 'en' or 'ar'

module.exports = router;
