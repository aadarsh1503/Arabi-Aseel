import express from "express";
import * as publicController from "../controllers/publicController.js";

const router = express.Router();

// Route using the imported controller object
router.get("/menus/:lang", publicController.getMenus); // lang = 'en' or 'ar'

export default router;