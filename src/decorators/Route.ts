import type { ServerRoute } from '@hapi/hapi'

const Route = (routeOptions: ServerRoute) => {
    return (target: any, name: string, descriptor: PropertyDescriptor) => {
        const routeConfig = {
            ...routeOptions,
            handler: descriptor.value
        }

        if (!target.routes) target.routes = []
        target.routes.push(routeConfig)
    }
}

export default Route