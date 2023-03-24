const express = require("express");
const pool = require("../config");

const router = express.Router();

// Get comment
router.get("/:blogId/comments", function (req, res, next) {});

// Create new comment
router.post("/:blogId/comments", async function (req, res, next) {
  try {
    const blogId = req.params.blogId;
    const { comment, like, comment_by_id } = req.body;
    console.log(comment, like, comment_by_id);
    const [row, fields] = await pool.query(
      "INSERT INTO comments (comment,`like`,comment_by_id,blog_id) VALUES(?,?,?,?);",
      [comment, like, comment_by_id, blogId]
    );
    console.log("row", row);
    res.json({ message: "A new comment is added (ID:" + row.insertId + ")" });
  } catch (err) {
    console.log(err);
  }
});

// Update comment
router.put("/comments/:commentId", async function (req, res, next) {
  try {
    const commentId = req.params.commentId;

    const { comment, like, comment_by_id, comment_date, blog_id } = req.body;

    const [row, fields] = await pool.query(
      "UPDATE `comments` set comment= ?, `like`=?, comment_by_id=?,comment_date=?, blog_id=? where id=?;",
      [comment, like, comment_by_id, comment_date, blog_id, commentId]
    );

    const [row1, fields1] = await pool.query(
      "SELECT * FROM `comments` WHERE comments.id=?;",
      [commentId]
    );
    console.log(row1);
    res.json({
      message: "A new comment is added ID:" + row.insertId + " is updated.",
      comment: {
        comment: row1[0].comment,
        like: row1[0].like,
        comment_date: row1[0].comment_date,
        comment_by_id: row1[0].comment_by_id,
        blog_id: row1[0].id,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Delete comment
router.delete("/comments/:commentId", async function (req, res, next) {
  try {
    const commentId = req.params.commentId;
    const [row, fields] = await pool.query(
      "DELETE FROM `comments` WHERE id =?;",
      [commentId]
    );
    res.json({ message: "Comment ID " + commentId + " is deleted." });
  } catch (err) {
    console.log(err);
  }
});

// Delete comment
router.put("/comments/addlike/:commentId", async function (req, res, next) {
  try {
    const commentId = req.params.commentId;
    const [row, fields] = await pool.query(
      "SELECT comments.like FROM `comments` WHERE comments.id=? ;",
      [commentId]
    );
    const ans = row[0].like + 1;
    console.log(ans);
    const [row1, fields1] = await pool.query(
      "UPDATE `comments` set comments.like= ? where comments.id = ?;",
      [ans, commentId]
    );
    const [row2, fields2] = await pool.query(
      "SELECT * FROM `comments` WHERE comments.id = ?;",
      [commentId]
    );
    console.log(row2);
    return res.json({
      blogId: row2[0].blog_id,
      commentId: row2[0].id,
      likeNum: row2[0].like,
    });
  } catch (err) {
    console.log(err);
  }
});

exports.router = router;
