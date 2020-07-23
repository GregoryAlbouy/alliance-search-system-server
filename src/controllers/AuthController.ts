import type { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
import Joi from '@hapi/joi'
import { Route } from '../decorators'
import { Auth } from '../models/'

export default class AuthController {
    static routes: ServerRoute[] = []

    @Route({
        method: 'POST',
        path: '/auth',
        options: {
            auth: false,
            /* Not working as the payload is actually a stringified JSON */
            // validate: {
            //     payload: Joi.object().keys({
            //         username: Joi.string().min(1).max(10).required(),
            //         password: Joi.string().min(1).required()
            //     })
            // }
        },
    })
    static authenticate(req: Request, h: ResponseToolkit) {
        try {
            const { username, password } = JSON.parse(req.payload as string)
            const token = new Auth(username, password).getToken()

            return h.response({
                success: true,
                token
            }).code(200)

        } catch (error) {
            return h.response({
                success: false,
                message: error.message
            })
        }
    }

    @Route({
        method: 'GET',
        path: '/auth'
    })
    static get(req: Request, h: ResponseToolkit) {
        const username = (req.auth.credentials as any)['username']
        return h.response(username).code(200)
    }
}