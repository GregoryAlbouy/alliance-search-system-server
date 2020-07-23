import bcrypt from 'bcrypt'
import { createToken } from '../jwt'

export default class Auth {
    username: string
    password: string

    constructor(username: string, password: string) {
        this.username = username
        this.password = password
    }

    public getToken() {
        if (!this.isValid()) throw new Error('Invalid login')

        return createToken(this.username)
    }

    private isValid() {
        const check = this.getUser()
        return (
            this.username === check.username
            && bcrypt.compareSync(this.password, check.password)
        )
    }

    private getUser() {
        return {
            username: process.env['AUTH_USERNAME']!,
            password: process.env['AUTH_PASSWORD']!
        }
    }

}