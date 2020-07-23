import Hapi from '@hapi/hapi'
import dotenv from 'dotenv'
dotenv.config()

import config from './config'
import routes from './routes'
import { setupJwt } from './jwt'

const init = async () => {
    const server = Hapi.server(config.SERVER_OPTIONS)

    if (config.AUTH_ENABLED) await setupJwt(server)

    server.route(routes)
    await server.start()

    console.table(server.info)
};

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

init()