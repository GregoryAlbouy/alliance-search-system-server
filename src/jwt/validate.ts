const validate = (decoded: any) => {
    const username = process.env['AUTH_USERNAME']

    if (decoded.username === username) return { isValid: true }

    return { isValid: false }
}

export default validate