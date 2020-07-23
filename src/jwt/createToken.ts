import jwt from 'jsonwebtoken'

const secretKey = process.env['JWT_SECRET_KEY']!

const createToken = (username: string) => jwt.sign({
    username,
}, secretKey, { expiresIn: '1h', algorithm: 'HS256' })

export default createToken