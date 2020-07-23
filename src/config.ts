export default {
    AUTH_ENABLED: true,
    SERVER_OPTIONS: {
        port: process.env['PORT'] || 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    }
}