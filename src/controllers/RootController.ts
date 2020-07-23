import type { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
import { Route } from '../decorators'

export default class RootController {
    static routes: ServerRoute[] = []

    @Route({
        method: 'GET',
        path: '/',
        options: {
            auth: false
        }
    })
    static welcome(req: Request, h: ResponseToolkit) {
        const message = 'Welcome to the Alliance Search System!'

        return h.response(message).code(200)
    }
}