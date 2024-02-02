import { PrismaClient } from '@prisma/client'
import {createHash, randomBytes} from 'crypto'
import jsSHA from "jssha";

async function createAdministratorAccount() {
    const saltA = randomBytes(32).toString('hex')
    const saltB = randomBytes(32).toString('hex')
    console.log('E')
    const name = 'Dheeraj Chintapalli'
    const password = 'df@avnce.org'
    const age = '15';
    const username = 'owner';
    const email = 'df@avnce.org'
    const password_rei = new jsSHA("SHA3-512", "TEXT", { encoding: "UTF8" }).update(password).getHash('HEX')
    console.log(password_rei)
    let db = new PrismaClient()
    
    const userService = await db.user.create({data: {
        'username': username,
        'age': age,
        'name': name,
        'email': email,
        'saltA': saltA,
        'saltB': saltB,
        'verified': true,
        'tutor': true,
        'permission': "admin",
        'password': createHash('SHA3-512').update(`${saltA}${password_rei}${saltB}`).digest('hex'),
      }})
    console.log(userService)
}

createAdministratorAccount()