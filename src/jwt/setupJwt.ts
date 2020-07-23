import type Hapi from '@hapi/hapi'
import Jwt from 'hapi-auth-jwt2'
import { validate } from './'

const setupJwt = async (server: Hapi.Server) => {
    await server.register(Jwt)

    const options = {
        key: process.env['JWT_SECRET_KEY'],
        validate,
        verifyOptions: {
            algorithm: ['HS256']
        }
    }

    server.auth.strategy('jwt', 'jwt', options)
    server.auth.default('jwt')
}

export default setupJwt