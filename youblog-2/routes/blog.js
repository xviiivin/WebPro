const express = require("express");
const router = express.Router();

var article = require("../article-db");

// กำหนดให้ path blogapi แสดงข้อมูลบทความทั้งหมดในรูปแบบ json

// router.get("/blogapi", (req, res) => {
//   //   res.json(article);
//   var data = { title: "Express", article: article, name: "wiwat" };
//   res.render("blog", data);
// });

// กำหนดให้ path blogapi/id แสดงข้อมูลบทความตาม id ที่กำหนด

router.get("/blog/:id", (req, res) => {
  if (article.length < req.params.id) {
    res.send(`Error "ไม่พบบทความ"`);
  }
  var data = { what: article[~~req.params.id - 1] };

  res.render("detail", data);
});

router.post("/blogs/addlike/:blogId", async function (req, res, next) {
  // Your code here
});

module.exports = router;
