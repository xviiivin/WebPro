const express = require('express');
const app = express();

const pool = require('./config/database');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** 
 *  เริ่มทำข้อสอบได้ที่ใต้ข้อความนี้เลยครับ
 * !!! ไม่ต้องใส่ app.listen() ในไฟล์นี้นะครับ มันจะไป listen ที่ไฟล์ server.js เองครับ !!!
 * !!! ห้ามลบ module.exports = app; ออกนะครับ  ไม่งั้นระบบตรวจไม่ได้ครับ !!!
*/

app.post("/todo", async (req, res) => {

    if (!req.body.title) {
        return res.status(400).json({
            "message": "ต้องกรอก title"
        })
    }
    if (!req.body.description) {
        return res.status(400).json({
            "message": "ต้องกรอก description"
        })
    }
    if (!req.body.due_date) {
        req.body.due_date = new Date() //บันทึกเป็นวันปัจจุบัน
    }

    const [max, _] = await pool.query("SELECT max(`order`) AS max_order_amount FROM todo", [])
    const incre = max[0].max_order_amount + 1

    const [result1] = await pool.query("INSERT INTO todo(`title`, `description`, `due_date`, `order`) VALUES(?, ?, ?, ?)", [req.body.title, req.body.description, req.body.due_date, incre])

    res.status(201).json({
        "message": `สร้าง ToDo '${req.body.title}' สำเร็จ`,
        "todo": {
            "id": result1.insertId,
            "title": req.body.title,
            "description": req.body.description,
            "due_date": req.body.due_date,
            "order": incre
        }
    })
})

app.delete("/todo/:id", async (req, res) => {
    const [result1, _] = await pool.query("SELECT * FROM todo WHERE id = ?", [req.params.id])
    if (result1.length === 0) {
        return res.status(404).json({
            "message": "ไม่พบ ToDo ที่ต้องการลบ"
        })
    }
    const [result2] = await pool.query("DELETE FROM todo WHERE id = ?", [req.params.id])
    res.status(200).json({
        "message": `ลบ ToDo '${result1[0].title}' สำเร็จ`,
    })
})

app.get("/todo", async (req, res) => {
    if (!req.query.start_date || !req.query.end_date) {
        const [result1, _] = await pool.query("SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date FROM todo", [])
        res.send(result1)
    } else {
        const [result1, _] = await pool.query("SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date FROM todo WHERE due_date BETWEEN ? AND ?", [req.query.start_date, req.query.end_date])
        res.send(result1)
    }
})

module.exports = app;
