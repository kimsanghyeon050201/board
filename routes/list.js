var express = require('express');
var router = express.Router();
const { sql, pool } = require('../data/db')

router.get('/', async (req, res) => {
    try {
        const query = await pool

        const result = await query.request()
            .query('select title, name, convert(varchar, la_time, 120) as la_time, views, id from post')

        const result_data = {
            result: result.recordset
        }

        res.status(200).json(result_data)
    } catch (err) {
        console.error(`err, ${err}`)
        res.status(400).json({
            message: "Fail",
        })
    }
})

//update
router.patch('/list/edit', async (req, res) => {
    const { id, title, content } = req.body
    try {
        const query = await pool

        const result = await query.request()
            .input('id', sql.Int, parseInt(id))
            .input('title', sql.VarChar, title)
            .input('content', sql.VarChar, content)
            .query('update post set title = @title, la_time = convert(varchar, GETDATE(), 120), content = @content where id = @id')
        res.status(200).json({
            message: "success"
        })
    } catch (err) {
        console.error(`err, ${err}`)
        res.status(400).json({
            message: "Fail",
        })
    }
})
//delete
router.delete('/list/delete', async (req, res) => {

    const { id } = req.body
    try {
        const query = await pool

        const result = await query.request()
            .input('id', sql.Int, parseInt(id))
            .query('delete from post where id = @id')

        res.status(200).json({
            message: "success"
        })
    } catch (err) {
        console.error(`err, ${err}`)
        res.status(400).json({
            message: "Fail",
        })
    }
})

//insert
router.post('/list/post', async (req, res) => {
    const { title, content, name } = req.body

    try {
        const query = await pool

        const result = await query.request()
            .input('name', sql.VarChar, name)
            .input('title', sql.VarChar, title)
            .input('content', sql.VarChar, content)
            .query('INSERT into post(name, title, content, la_time, views) values(@name, @title, @content, convert(varchar, GETDATE(), 120), 0)')

        res.status(200).json({
            message: "success"
        })
    } catch (err) {
        console.error(`err, ${err}`)
        res.status(400).json({
            message: "Fail",
        })
    }
})

module.exports = router