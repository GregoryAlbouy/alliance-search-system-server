import type { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi'
import { Route, Controller } from '../decorators'
import { categories } from '../utils'
import fetch from 'node-fetch'

class EntityController {
    static routes: ServerRoute[] = []

    @Route({
        method: 'GET',
        path: '/entity/{category}/{id}'
    })
    static async getEntity(req: Request, h: ResponseToolkit) {
        const { category, id } = req.params

        if (!categories.includes(category)) return h.response({
            code: 400,
            message: `Category ${category} does not exist.`
        })

        try {
            const res = await (await fetch(`http://swapi.dev/api/${category}/${id}`)).json()
            
            return h.response(res).code(200)
        } catch(error) {
            console.log(error)
        }
    }
}

export default EntityController