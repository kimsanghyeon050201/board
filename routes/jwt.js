const config = require('../config')
const jwt = require('jsonwebtoken')
const { sql, pool } = require('../data/db')

function createAccessToken(name) {

    const accessToken = jwt.sign({ name: name }, config.secretKey, {
        expiresIn: '30s'
    })
    return accessToken
}

function createRefreshToken() {

    const refreshToken = jwt.sign({}, config.secretKey, { expiresIn: '7d' })
    return refreshToken
}

async function validateToken(req, res, next) {
    const {accessToken, refreshToken} = req.cookies

    console.log(refreshToken)

    if(!refreshToken) return res.status(400).json({message : "refreshToken이 없습니다."})
    if(!accessToken) return res.status(400).json({message : "accessToken이 없습니다."})

    const isAccessTokenValidate = validateAccessToken(accessToken)
    const isRefreshTokenValidate = validateRefreshToken(refreshToken)

    if(!isRefreshTokenValidate){
        return res.status(400).json({message : "refreshToken이 만료되었습니다."})
    }
    if(!isAccessTokenValidate){
        const qu = await pool
        const data = await qu.request().input('tk', sql.Text, refreshToken).query('select name from token where tk = @tk')
        const result = {
            result : data.recordset
        }
        console.log(result.result[0].name)
        if(Object.keys(result.result).length == 0){
            res.status(400).json({
                message : "refreshToken의 정보가 서버에 존재하지 않습니다"
            })
        }
        const accessTokenName = result.result[0].name
        const newAccessToken = createAccessToken(accessTokenName)
        res.cookies('accessToken', newAccessToken)
        return res.status(200).json({
            message : "Access Token을 새롭게 발급하였습니다"
        })
    }

    // const {name} = getAccessTokenPayload(accessToken) 
    // return res.status(200).json({
    //     message : `${name} payload`
    // })
    next()
}

function validateRefreshToken(refreshToken){
    try{
        jwt.verify(refreshToken, config.secretKey)
        return true
    }catch(err){
        return false
    }
}

function validateAccessToken(accessToken){
    try{
        jwt.verify(accessToken, config.secretKey)
        return true
    }catch(err){
        return false
    }
}

function getAccessTokenPayload(accessToken){
    try{
        const payload = jwt.verify(accessToken, config.secretKey)
        return true
    }catch(err){
        return null
    }
}

module.exports = {
    createAccessToken, createRefreshToken, validateToken
}