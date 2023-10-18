var express = require('express');
var router = express.Router();
const { sql, pool } = require('../data/db')
const jwt = require('./jwt')
const bcrypt = require('bcrypt')

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

    const result = await query.request()
      .input('id', sql.VarChar, id)
      .query('select * from users where id = @id')
    const result_data = {
      result: result.recordset
    }

    if (result_data.result.length == 0) {
      res.status(400).json({
        message: "존재하지 않는 아이디 입니다"
      })
      return
    }

    if (bcrypt.compareSync(pw, result_data.result[0].pw)) {

      const accessToken = jwt.createAccessToken(result_data.result[0].name)
      const refreshToken = jwt.createRefreshToken()

      await query.request()
        .input('tk', sql.Text, refreshToken)
        .input('name', sql.VarChar, result_data.result[0].name)
        .query('insert into token(tk, name, expiryDate) values(@tk, @name, convert(varchar, GETDATE(), 120))')

      res.cookie('accessToken', accessToken)
      res.cookie('refreshToken', refreshToken)

      res.status(200).json({
        result: result_data.result[0]
      })
    }
  } catch (err) {
    res.status(400).json({
      message: "Fail",
    })
    console.error(`err, ${err}`)
  }
})

router.post('/signup', async (req, res) => {

  const { id, pw, name } = req.body

  try {
    const qu = await pool

    await qu.request()
      .input('name', sql.VarChar, name)
      .input('id', sql.VarChar, id)
      .input('pw', sql.Text, bcrypt.hashSync(pw, 10))
      .query('insert into users values(@name, @id, @pw)')
    res.status(200).json({
      message: "success"
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Fail"
    })
  }
})

module.exports = router;
