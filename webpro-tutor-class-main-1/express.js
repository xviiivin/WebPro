const express = require('express');
const app = express();
const joi = require('joi');
const pool = require('./config/database');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// joi validate
const schema3 = joi.object({
    start_date: joi.date().required(),
    end_date: joi.date()
        .required()
        .when("start_date", {
            is: joi.date().required(),
            then: joi.date().min(joi.ref("start_date")).required(),
        }),
});


const schema1 = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    due_date: joi.date()
})

// ข้อที่ 1
app.post('/todo', async(req, res) => {
    // เช็ค joi
    const result = schema1.validate(req.body)

    if (result.error) {
        // title ไม่มี
        if (result.error.details[0].path[0] == 'title') {
            return res.status(400).send({ "message": "ต้องกรอก title" })
        }
        // description ไม่มี
        if (result.error.details[0].path[0] == 'description') {
            return res.status(400).send({ "message": "ต้องกรอก description" })
        }
    }

    // หาค่า order มาที่สุด
    const [order] = await pool.query('select max(`order`) `order` from todo')

    // เพิ่มข้อมูล
    const [data1] = await pool.query('INSERT INTO todo(title, description, due_date, `order`) VALUES (?,?,?,?)', [req.body.title, req.body.description, req.body.due_date ? req.body.due_date : new Date(), order[0].order + 1])

    // เอาค่ามาแสดง โดยใช้้ข้อมูลที่ return มาจาก data1 --> return id ที่ insert ออกมา
    const [ans] = await pool.query("SELECT * ,DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date  FROM todo where id = ?", [data1.insertId])

    // ส่งค่าและ status 201
    res.status(201).send({
        "message": `สร้าง ToDo '${req.body.title}' สำเร็จ`,
        "todo": ans[0]
    })
})

// delete
app.delete("/todo/:id", async(req, res, next) => {
    const [db] = await pool.query("select * from todo where id = ?", [req.params.id]);
    console.log(db);
    const connection = await pool.getConnection()
    await connection.beginTransaction()
    try {
        connection.query("DELETE FROM todo WHERE id =? ", [req.params.id])
        await connection.commit()
        res.status(200).send({
            message: `ลบ ToDo '${db[0].title}' สำเร็จ`
        })
    } catch (error) {
        res.status(404).send({ "message": "ไม่พบ ToDo ที่ต้องการลบ" })
        await connection.rollback()
    } finally {
        connection.release()
    }
})

// get
// app.get("/todo", async(req, res, next) => {
//     const qry = req.query;
//     console.log(qry);
//     const result = schema3.validate(qry);
//     if (result.error) {
//         console.log(result.error.details);
//         return res.status(400).send(result.error.details);
//     }
//     const [data2] = await pool.query(
//         `SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date FROM todo WHERE due_date BETWEEN ? AND ?`, [qry.start_date, qry.end_date]
//     );
//     console.log(data2);
//     res.send(data2);
// });
app.get("/todo", async(req, res, next) => {
    // validate โดยใช้ schema3
    const result = schema3.validate(req.query)
        // query

    // กรณีไม่มี String query
    if (!req.query.start_date || !req.query.end_date) {
        const [data3] = await pool.query(`SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date FROM todo `, [])
        res.status(200).send(data3)
    }
    // กรณีมี String query
    else {
        const [data3] = await pool.query(`SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date FROM todo WHERE due_date BETWEEN ? AND ?`, [req.query.start_date, req.query.end_date])
        res.status(200).send(data3)
    }
})
module.exports = app;

// JOI 
// string(): ใช้ในการตรวจสอบข้อมูลที่เป็นสตริง (string) โดยกำหนดเงื่อนไขต่าง ๆ เช่นความยาวของสตริงหรือรูปแบบ (pattern) ที่ต้องการ

// number(): ใช้ในการตรวจสอบข้อมูลที่เป็นตัวเลข (number) โดยกำหนดเงื่อนไขต่าง ๆ เช่นค่าต่ำสุด (minimum) หรือค่าสูงสุด (maximum) ที่ต้องการ

// boolean(): ใช้ในการตรวจสอบข้อมูลที่เป็นบูลีน (boolean) ซึ่งต้องเป็น true หรือ false

// object(): ใช้ในการตรวจสอบข้อมูลที่เป็นออบเจกต์ (object) โดยกำหนดเงื่อนไขต่าง ๆ เช่นการตรวจสอบค่าในคีย์ของออบเจกต์ หรือจำนวนคีย์ที่ต้องมี

// array(): ใช้ในการตรวจสอบข้อมูลที่เป็นอาเรย์ (array) โดยกำหนดเงื่อนไขต่าง ๆ เช่นขนาดอาเรย์ (length) หรือประเภทของข้อมูลภายในอาเรย์

// date(): ใช้ในการตรวจสอบข้อมูลที่เป็นวันที่ (date) โดยกำหนดเงื่อนไขต่าง ๆ เช่นรูปแบบวันที่ (format) หรือค่า

// required(): ใช้ในการกำหนดว่าข้อมูลต้องไม่เป็นค่าว่างหรือ null และต้องมีค่าที่ถูกต้อง

// min(), max(): ใช้ในการกำหนดค่าต่ำสุดและค่าสูงสุดของข้อมูล เช่น min(18) จะตรวจสอบว่าต้องมีค่าไม่น้อยกว่า 18

// email(): ใช้ในการตรวจสอบว่าสตริงที่กำลังตรวจสอบเป็นอีเมลที่ถูกต้องหรือไม่

// pattern(): ใช้ในการตรวจสอบว่าสตริงตรงตามรูปแบบที่กำหนด

// allow(): ใช้ในการระบุค่าที่ยอมรับให้ถูกต้อง เช่น allow('male', 'female') จะตรวจสอบว่าค่าต้องเป็น "male" หรือ "female" เท่านั้น

// forbidden(): ใช้ในการระบุว่าค่านั้นต้องไม่มีอยู่ โดยเฉพาะในกรณีที่ต้องการแบ่งกลุ่มคีย์ที่สามารถมีค่าหรือไม่มีค่าได้

// type email ต้องเป็น string ก่อน


// const schema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//     confirmPassword: Joi.string()
//         .valid(Joi.ref('password'))
//         .required()
//         .error(new Error('Passwords do not match')),
//     role: Joi.string().required()
// });



// Joi.object(): ใช้สำหรับการสร้าง schema ของ object
// const schema = Joi.object({
//     name: Joi.string().required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).required(),
//   });


// Joi.array(): ใช้สำหรับการสร้าง schema ของ array
// const schema = Joi.array().items(Joi.string().valid('small', 'medium', 'large'));


// Joi.string(): ใช้สำหรับการตรวจสอบว่าข้อมูลเป็น string
// const schema = Joi.string();


// Joi.number(): ใช้สำหรับการตรวจสอบว่าข้อมูลเป็น number
// Joi.number(): ใช้สำหรับการตรวจสอบว่าข้อมูลเป็น number


// Joi.optional(): ใช้สำหรับการตรวจสอบว่าข้อมูลนั้นเป็น optional
// const schema = Joi.string().optional();


// Joi.validate(): ใช้สำหรับการตรวจสอบว่าข้อมูลที่รับมาเป็นรูปแบบที่ถูกต้องตาม schema
// const schema = Joi.string().required();
// const result = schema.validate('Hello');
// if (result.error) {
//   console.log(result.error.details);
// } else {
//   console.log(result.value);
// }


// Joi.alphanum()
//const schema = Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/);

// Joi.valid(): ใช้สำหรับการกำหนดค่าที่ถูกต้องสำหรับข้อมูล
// const schema = Joi.string().valid('small', 'medium', 'large');

// Joi.invalid(): ใช้สำหรับการกำหนดค่าที่ไม่ถูกต้องสำหรับข้อมูล
// const schema = Joi.string().invalid('small', 'medium', 'large');



// custom 
// const passwordValidator = (value, helpers) => {
//     if (value.length < 8) {
//         throw new Joi.ValidationError('Password must contain at least 8 characters')
//     }
//     if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
//         throw new Joi.ValidationError('Password must be harder')
//     }
//     return value
// }

// const signupSchema = Joi.object({
//     email: Joi.string().required().email(),
//     mobile: Joi.string().required().pattern(/0[0-9]{9}/),
//     first_name: Joi.string().required().max(150),
//     last_name: Joi.string().required().max(150),
//     password: Joi.string().required().custom(passwordValidator),
//     confirm_password: Joi.string().required().valid(Joi.ref('password')),
//     username: Joi.string().required().min(5).max(20).external(usernameValidator),
// })