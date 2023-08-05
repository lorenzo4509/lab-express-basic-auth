const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/dashboard", isLoggedIn, (req, res, next) => {
  res.render("dashboard");
});

module.exports = router;