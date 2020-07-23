import * as controllers from './controllers'
import type { ServerRoute } from '@hapi/hapi'

type RouteController = { routes: ServerRoute[] }

const controllerList = Object.keys(controllers)
    .map((name) => (controllers as Record<string, RouteController>)[name])


const getControllerRoutes = (controller: RouteController) => controller.routes

console.log(controllers, controllerList)

const routes: ServerRoute[] = controllerList.map(getControllerRoutes).flat()
console.log(routes)

export default routes