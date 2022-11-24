const express = require("express");
const router = express.Router();
const controller = require("../controller/home-controller");

router.get("/", controller.home);

router.get("/juego", controller.juego);

router.get("/sala", controller.sala);

module.exports = router;
