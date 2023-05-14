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

let schema2 = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    due_date: Joi.date()
})


app.post("/todo", async(req, res, next) => {
    const title = req.body.title
    const description = req.body.description
    let due_date = req.body.due_date
    const date = await pool.query("SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date  FROM todo")
    const conn1 = await pool.getConnection();
    await conn1.beginTransaction();
    const [max] = await conn1.query("SELECT max(\`order\`) AS maxorder from todo")
    try {
        await schema2.validateAsync({
            title,
            description,
            due_date,
        });
    } catch (error) {
        if (error.details[0].message === '"title" is required') {
            res.status(400).json({ message: "ต้องกรอก title" });
        }
        if (error.details[0].message === '"description" is required') {
            res.status(400).json({ message: "ต้องกรอก description" });
        }
    }
    try {
        if (due_date == null) {
            due_date = new Date();
        } else {
            due_date = new Date(due_date)
        }

        const insert = await conn1.query("insert into todo (title, description, `due_date`, `order`) value (?,?,?,?)", [title, description, due_date, (max[0].maxorder + 1)])
        console.log(insert)

        conn1.commit()
        return res.status(201).send({
            "message": `สร้าง ToDo '${title}' สำเร็จ`,
            "todo": {

            }
        })
    } catch (err) {
        console.log(err)
        return res.status(400).send(err)
        conn1.rollback()
    } finally {
        conn1.release()
    }

});

/**
 *  เริ่มทำข้อสอบได้ที่ใต้ข้อความนี้เลยครับ
 * !!! ไม่ต้องใส่ app.listen() ในไฟล์นี้นะครับ มันจะไป listen ที่ไฟล์ server.js เองครับ !!!
 * !!! ห้ามลบ module.exports = app; ออกนะครับ  ไม่งั้นระบบตรวจไม่ได้ครับ !!!
 */
app.get("/todo", async(req, res, next) => {
    const qry = req.query;
    console.log(qry);
    const result = schema.validate(qry);
    if (result.error) {
        console.log(result.error.details);
        return res.status(400).send(result.error.details);
    }
    const [data2] = await pool.query(
        `SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date FROM todo WHERE due_date BETWEEN ? AND ?`, [qry.start_date, qry.end_date]
    );
    console.log(data2);
    res.send(data2);
});




app.delete("/todo/:id", async(req, res, next) => {
    const id = req.params.id;
    const [data1] = await pool.query("select * from todo where id = ?", [id]);
    console.log(data1);
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
        const [del] = await pool.query("delete  from todo where id = ?", [id]);
        await conn.commit();
        res.status(200).send({
            message: `
                ลบ Todo '${data1[0].title}' สำเร็จ`,
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
});




// title VARCHAR(255) NOT NULL,
//     description TEXT NOT NULL,
//     due_date DATE NOT NULL, \`order\` INT NOT NULL)`
// const title = req.body.title
// const description = req.body.description
// const due_date = req.body.due_date

// const conn1 = await pool.getConnection();
// await conn1.beginTransaction();
// try {
//     await sehampost.validateAsync({
//         title,
//         description,
//         due_date,
//     });
// } catch (err) {
//     if (err.details[0].message == '"title" is required') {
//         res.status(400).send({
//             message: "ต้องกรอก title"
//         })
//     } else if (err.details[0].message == '"description" is required') {
//         res.status(400).send({ message: "ต้องกรอก description" })
//     }
//     console.log(err.details[0])
// }

// const [todos] = await db.query(
//     `select max(\`order\`) as maxOrder from todo`);

// try {
//     const todolist = await pool.query(
//         // 'select * from todo'
//         `select max(\`order\`) as maxOrder from todo`
//     );
//     if (due_date == null) {
//         due_date = new Date().toLocaleDateString("en-CA");
//     } else {
//         due_date = new Date(due_date).toLocaleDateString("en-CA");
//     }
//     console.log(todolist[0][0].maxOrder)
//     const create1 = await pool.query(`insert into todo (title, description,due_date,\`order\) values[?,?,?,?]`, [title, description, due_date, (todolist[0][0].maxOrder + 1)])
//     res.status(201).send({
//         "message": `สร้าง ToDo '${create1[0].title}`,
//         "todo": {
//             "id": create1.insertId,
//             "title": title,
//             "description": description,
//             "due_date": due_date,
//             "order": (todolist[0][0].maxOrder + 1)
//         }
//     })
//     await conn1.commit()
// } catch (err) {
//     res.send(err)
//         // res.status(400).send({
//         //     message: `ต้องกรอก`
//         // })
//     console.log(err)

//     conn1.rollback();
// } finally {
//     conn1.release()
// }






module.exports = app;