declare module 'dotenv' {
    const value: any
    export default value
}

declare module 'node-fetch' {
    const value: any
    export default value
}

type SwapiSearchResponse = {
    count: number,
    next: string | null,
    previous: string | null
    results: any[]
}