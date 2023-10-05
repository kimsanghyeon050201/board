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
      .then((result) => {
        const result_data = {
          total: result.output.TOTAL,
          result: result.recordset
        }
        return result_data
      }).catch((err) => {
        console.error(`err, ${err}`)
      })
    if (Object.keys(result.result).length == 0) {
      res.send({
        message : "failed"
      })
      return
    }
    res.send(result)
  } catch (err) {
    console.error(`err, ${err}`)
  }
})

router.get('/list', async (req, res) => {
  try {
    const qu = await pool

    const result = await qu.request()
      .query('select title, name, convert(varchar, la_time, 120) as la_time, views from post')
      .then((result) => {
        const result_data = {
          total: result.output.TOTAL,
          result: result.recordset
        }
        return result_data
      }).catch((err) => {
        console.error(`err, ${err}`)
      })
      
      res.send(result)
  } catch (err) {
    console.error(`err, ${err}`)
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
    res.send({
      message : "success"
    })
  } catch (err) {
    console.error(`err, ${err}`)
  }
})
//delete
router.delete('/delete', async (req, res) => {

  const { id } = req.body

  try {
    const query = await pool

    const result = await query.request()
      .input('id', sql.VarChar, id)
      .query('delete from post where id = @id')
  } catch (err) {
    console.error(`err, ${err}`)
  }
})

//insert
router.post('/post', async (req, res) => {
  const {title, content,} = req.body

  try {
    const query = await pool

    const result = await query.request()
      .input('name', sql.VarChar, name)
      .input('title', sql.VarChar, title)
      .input('content', sql.VarChar, content)
      .query('INSERT into post(name, title, content, la_time, views) values(@name, @title, @content, convert(varchar, GETDATE(), 120), 0)')
    console.log({
      message : "success"
    })
  } catch (err) {
    console.error(`err, ${err}`)
  }
})


module.exports = router;
