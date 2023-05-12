const express = require("express");
const app = express();
const Joi = require("joi");
const pool = require("./config/database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const schema = Joi.object({
  start_date: Joi.date().required(),
  end_date: Joi.date()
    .required()
    .when("start_date", {
      is: Joi.date().required(),
      then: Joi.date().min(Joi.ref("start_date")).required(),
    }),
});

/**
 *  เริ่มทำข้อสอบได้ที่ใต้ข้อความนี้เลยครับ
 * !!! ไม่ต้องใส่ app.listen() ในไฟล์นี้นะครับ มันจะไป listen ที่ไฟล์ server.js เองครับ !!!
 * !!! ห้ามลบ module.exports = app; ออกนะครับ  ไม่งั้นระบบตรวจไม่ได้ครับ !!!
 */
app.get("/todo", async (req, res, next) => {
  const qry = req.query;
  console.log(qry);
  const result = schema.validate(qry);
  if (result.error) {
    console.log(result.error.details);
    return res.status(400).send(result.error.details);
  }
  //   const [data] = await pool.query("select * from todo");
  //   res.status(200).send(data);
  //   console.log(data);
  const [data2] = await pool.query(
    `SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date 
  FROM todo WHERE due_date BETWEEN ? AND ?`,
    [qry.start_date, qry.end_date]
  );
  console.log(data2);
  res.send(data2);
});

app.delete("/todo/:id", async (req, res, next) => {
  const id = req.params.id;
  const [data1] = await pool.query("select * from todo where id = ?", [id]);
  console.log(data1);

  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [del] = await pool.query("delete  from todo where id = ?", [id]);
    await conn.commit();
    res.status(200).send({
      message: `ลบ Todo '${data1[0].title}' สำเร็จ`,
    });
  } catch (err) {
    res.status(404).send({
      message: "ไม่พบ ToDo ที่ต้องการลบ",
    });
    conn.rollback();
  } finally {
    conn.release();
  }
  //
  res.send(data1);
});

module.exports = app;
