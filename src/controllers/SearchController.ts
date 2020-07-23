import type { Request, ResponseToolkit } from '@hapi/hapi'
import { Search } from '../models'
import { Route } from '../decorators'

export default class SearchController {
    static routes = []

    @Route({
        method: 'GET',
        path: '/search',
        // options: { auth: false }
    })
    static async get(req: Request, h: ResponseToolkit) {
        const { name, cat, limit, wookiee } = req.query

        if (!name) return h.response({ message: 'Empty query' }).code(200)

        return new Search({
            cat,
            limit,
            wookiee
        }).byName(name as string)
    }
} 