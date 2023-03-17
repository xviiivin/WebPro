const express = require("express");
const router = express.Router();
var article = require("../article-db");

router.get("/", function (req, res, next) {
  console.log(req.query);
  console.log(req.query.search);
  if (req.query.search) {
    const www = article.filter((x) =>
      x.title.toLowerCase().includes(req.query.search.toLowerCase())
    );
    var data = { title: "Expqress", article: www };
    res.render("index", data);
  }

  else{
    var data = { title: "Expqress", article: article };
    res.render("index", data);
  }
});
router.get("/feawfeawfe/:id", function (req, res, next) {
  console.log(req.params.id);

  var data = { title: "Expqress", article: article, name: "wiwat" };
  res.render("ex101", data);
});

module.exports = router;
