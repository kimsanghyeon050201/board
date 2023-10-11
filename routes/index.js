var express = require('express');
var router = express.Router();
const { sql, pool } = require('../data/db')

/* GET home page. */
router.get('/home', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/', function (req, res, next) {
  res.render('login')
});
router.get('/board', (req, res) => {
  res.render('board')
})

/* service logic */
router.post('/login', async (req, res) => {
  const { id, pw } = req.body
  try {
    const query = await pool

    console.log(`id : ${id}, pw : ${pw}`)
    const result = await query.request()
      .input('id', sql.VarChar, id)
      .input('pw', sql.VarChar, pw)
      .query('select * from users where id = @id and pw = @pw')
    const result_data = {
      result: result.recordset
    }

    if (result_data.result.length == 0) {
      res.status(400).json({
        message: "아이디 또는 비번 틀림"
      })
      return
    }
    res.status(200).json({
      result: result_data.result[0]
    })
    console.log(result_data.result[0])
  } catch (err) {
    res.status(400).json({
      message: "Fail",
    })
    console.error(`err, ${err}`)
  }
})

router.get('/list', async (req, res) => {
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
router.patch('/edit', async (req, res) => {
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
router.delete('/delete', async (req, res) => {

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
router.post('/post', async (req, res) => {
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


module.exports = router;
