import fetch from 'node-fetch'
import { translate } from '../utils'

type SearchOptions = {
    cat: string[],
    limit: number,
    isWookiee: boolean
}

type SearchResult = {
    count: number,
    results: any[]
}

export default class Search {
    private readonly BASE_URL = 'http://swapi.dev/api'
    private readonly DEFAULT_CAT = [
        'people',
        'planets',
        'species',
        'vehicles',
        'starships'
    ]

    private options: SearchOptions = {
        cat: this.DEFAULT_CAT,
        limit: -1,
        isWookiee: false
    }

    constructor({ cat, limit, wookiee }: any = {}) {
        const sanitizedCat = cat ? cat.split(',').filter(this.categoryExists.bind(this)) : []

        if (sanitizedCat.length) this.options.cat = sanitizedCat
        if (limit) this.options.limit = Number.parseInt(limit)
        this.options.isWookiee = wookiee === 'true'
    }

    public async byName(name: string): Promise<SearchResult> {
        const resultsByCategory = await this.fetchCategoriesByName(name)
        const results = resultsByCategory.flat()
    
        return {
            count: results.length,
            results
        }
    }

    // Fetch all categories parallelly
    private fetchCategoriesByName (name: string): Promise<SearchResult[][]> {
        return Promise.all(this.options.cat.map((cat) => this.fetchCategoryByName(cat, name)))
    }

    private async fetchCategoryByName(category: string, name: string): Promise<SearchResult[]> {    
        return new Promise(async (resolve, reject) => {
            const params = this.options.isWookiee ? '&format=wookiee' : ''

            /**
             * Method 1: fetch each result page using the provided "next" value
             * Simplest, but 2 majors drawbacks
             * - Chained awaits slow down the process (each page is fully fetched
             * before moving to the next one)
             * - BREAKS in Wookiee mode since "next" value is also translated...
             */
            // const fetchPagesRecursively = async () => {
            //     const results: any[] = []

            //     const storePageResult = async (pageUrl: string) => {
            //         const pageData = await this.jsonFromUrl(pageUrl)
            //         const pageResults = pageData.results
    
            //         results.push(...pageResults)
    
            //         if (pageData.next) await storePageResult(pageData.next)
            //     }

            //     await storePageResult(`${this.BASE_URL}/${category}/?search=${name}${params}`)

            //     return results.flat()
            // }
            // const results = await fetchPagesRecursively()

            /**
             * Fetches all pages parallelly by calculating in advance the needed amount of pages
             * Drawback:
             * - will break if the number of results by page from Swapi changes
             * - must fetch the first page before in order to get the count
             */
            const fetchPagesParallelly = async () => {
                const RESULTS_BY_PAGE = 10
                const pageUrl = (n: number) => `${this.BASE_URL}/${category}/?search=${name}${params}&page=${n}`

                // Fetch first page and store the results
                const firstPageData = await this.jsonFromUrl(pageUrl(1))
                const firstPageResults = firstPageData[this.keyFor('results')]
                const count = firstPageData[this.keyFor('count')]

                if (count <= RESULTS_BY_PAGE) return firstPageResults

                // Get the number of pages according to count and results by page
                // First page has already been fetched, hence -1
                const nPages = Math.ceil(count / RESULTS_BY_PAGE) - 1

                // Create an array of n fetch promises corresponding to the n pages to fetch
                const fetchPages = [...Array(nPages)].map((_, i) => {
                    return this.jsonFromUrl(pageUrl(2 + i)) // starts at 2 (page 1 already fetched)
                        .then((data) => {
                            if (data.error) throw new Error('Some results have been ignored due to Wookiee encoding isse with Swapi')

                            return data[this.keyFor('results')]
                        }).catch((e) => console.log(e.message))
                })

                // Actual fetching
                const nextResults = (await Promise.all(fetchPages))
                    .flat()
                    .filter(Boolean) // remove eventual null values due to errors in Wookiee mode

                return [...firstPageResults, ...nextResults]
            }

            const results: Promise<SearchResult[]> = await fetchPagesParallelly()

            resolve(results)
        })
    } 

    /**
     * Performs basic fetch and returns json response.
     * BUT.
     * Since Swapi's Wookiee mode is quite buggy, it also contains
     * some hacky stuff to work around these issues:
     * 
     * - null value is translated to Wookiee but unquoted => json error
     * example: https://swapi.dev/api/people/?search=luke&format=wookiee
     * 
     * - Due to an encoding issue from Swapi, it is impossible to fetch
     * any entity that have an accent in its English name when in
     * Wookiee mode.
     * example: https://swapi.dev/api/people/35/?format=wookiee (Padmé Amidala)
     */
    private async jsonFromUrl(url: string) {
        try {
            const pageData = await fetch(url)

            if (!this.options.isWookiee) return pageData.json()
    
            // in Wookiee mode, use text response to replace incorrect json value
            // (unquoted 'whhuanan') with actual null
            const textResponse = await pageData.text()
            const safeText = textResponse.replace(/whhuanan/g, 'null')

            return Promise.resolve(JSON.parse(safeText))
        } catch {
            return Promise.resolve({ error: true })
        }
    }

    private categoryExists(category: string) {
        return this.DEFAULT_CAT.includes(category)
    }

    /**
     * Provides basic translation to help navigate through the API
     * while in Wookiee mode
     */
    private keyFor(keyname: string): string {
        return this.options.isWookiee
            ? translate(keyname).toWookiee()
            : keyname
    }
}