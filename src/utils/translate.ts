const wookieeDict: Record<string, string> = {
    count: 'oaoohuwhao',
    results: 'rcwochuanaoc'
}
const englishDict: Record<string, string> = {
    oaoohuwhao: 'count',
    rcwochuanaoc: 'results'
}

const translate = (query: string) => {
    return {
        toWookiee: () => wookieeDict[query],
        toEnglish: () => englishDict[query]
    }
}

export default translate