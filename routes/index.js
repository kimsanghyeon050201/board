var express = require('express');
var router = express.Router();
const { sql, pool } = require('../data/db')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { id, pw } = req.body
  try {
    const query = await pool

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

    if (Object.keys(result.result) == 0) {
      res.send('틀림')
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
      .query('select title, name, la_time, views from post')
      .then((result) => {
        const result_data = {
          total: result.output.TOTAL,
          result: result.recordset
        }
        return result_data
      }).catch((err) => {
        console.error(`err, ${err}`)
      })
  } catch (err) {
    console.error(`err, ${err}`)
  }
})

//update
router.put('/edit', async (req, res) => {
  const { id, title, name, time, views, content } = req.body
  try {
    const query = await pool

    const result = await query.request()
      .input('id', sql.Int, parseInt(id))
      .input('title', sql.VarChar, title)
      .input('name', sql.VarChar, name)
      .input('time', sql.DateTime, time)
      .input('views', sql.Int, parseInt(views))
      .input('content', sql.VarChar, content)
      .query('update post set title = @title, name = @name, la_time = @time, views = @views, content = @content where id = @id').then(result => {

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
  const { name, title, content, time, views } = req.body

  try {
    const query = await pool

    const result = await query.request()
      .input('name', sql.VarChar, name)
      .input('title', sql.VarChar, title)
      .input('content', sql.VarChar, content)
      .input('time', sql.DateTime, time)
      .input('views', sql.Int, parseInt(views))
      .query('INSERT into post(name, title, content, la_time, views) values(@name, @title, @content, @time, @views)')
    console.log('insert 성공')
  } catch (err) {
    console.error(`err, ${err}`)
  }
})


module.exports = router;
