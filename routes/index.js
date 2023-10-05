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

router.post('/sign')
//read
router.get('/select', async (req, res) => {
  try {
    const query = await pool

    const result = await query.request().input('name', sql.VarChar, 't1')
      .query('SELECT * FROM users where name = @name').then((result) => {//값 형식 결정
        const result_data = {
          total: result.output.TOTAL,
          result: result.recordset
        }
        return result_data
      }).catch((err) => {
        console.error('err, ', err)
      })
    // console.log(Object.keys(result.result).length) //검색된 목록 갯수
    console.log(result.result[0].name) //검색된 이름
    res.send(result)
  } catch (err) {
    console.error(`err, ${err}`)
  }
})

//update
router.get('/update', async (req, res) => {
  try {
    const query = await pool

    const result = await query.request()
      .input('pw', sql.VarChar, 'asd2')
      .input('name', sql.VarChar, 't1')
      .query('update users set pw = @pw where name = @name')
    console.log('update 성공')
  } catch (err) {

  }
})
//delete
router.get('/delete', async (req, res) => {
  try{
    const query = await pool

    const result = await query.request()
      .input('name', sql.VarChar, 't')
      .query('delete from users where name = @name')
    console.log('delete 성공')
  }catch(err){
    
  }
})

//insert
router.get('/insert', async (req, res) =>{
  try{
    const query = await pool

    const result = await query.request()
      .input('pw', sql.VarChar, 'a')
      .input('name', sql.VarChar, 't')
      .input('id', sql.VarChar, 'i')
      .query('insert into users values(@name, @id, @pw)')
    console.log('insert 성공')
  }catch(err){

  }
})


module.exports = router;
