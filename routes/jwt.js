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
    const { accessToken, refreshToken } = req.cookies


    if (!refreshToken) return res.status(400).json({ message: "refreshToken이 없습니다." })
    if (!accessToken) return res.status(400).json({ message: "accessToken이 없습니다." })

    const isAccessTokenValidate = validateAccessToken(accessToken)
    const isRefreshTokenValidate = validateRefreshToken(refreshToken)

    if (!isRefreshTokenValidate) {
        return res.status(400).json({ message: "refreshToken이 만료되었습니다." })
    }

    if (!isAccessTokenValidate) {
        const qu = await pool
        const data = await qu.request()
            .input('tk', sql.Text, refreshToken)
            .query('select * from token where tk like @tk')
            const result = {
                result : data.recordset
            }
            
            if(Object.keys(result.result).length == 0){
                res.status(400).json({
                    message : "refreshToken의 정보가 서버에 존재하지 않습니다"
                })
            }
            const accessTokenName = result.result[0].name
            const newAccessToken = createAccessToken(accessTokenName)
            res.cookie('accessToken', newAccessToken)
            return res.status(200).json({
                message : "Access Token을 새롭게 발급하였습니다"
            })
    }

    const {name} = getAccessTokenPayload(accessToken) 
    // return res.status(200).json({
    //     message : `${name} payload`
    // })
    //payload는 accessToken에서 빼면 됨 req.coockies
    //cron을 사용하여 만료된 토큰 지우는 스케쥴러 작업 해야함
    next()
}

function validateRefreshToken(refreshToken) {
    try {
        jwt.verify(refreshToken, config.secretKey)
        return true
    } catch (err) {
        return false
    }
}

function validateAccessToken(accessToken) {
    try {
        jwt.verify(accessToken, config.secretKey)
        return true
    } catch (err) {
        return false
    }
}

function getAccessTokenPayload(accessToken) {
    try {
        const payload = jwt.verify(accessToken, config.secretKey)
        return true
    } catch (err) {
        return null
    }
}

module.exports = {
    createAccessToken, createRefreshToken, validateToken
}