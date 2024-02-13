import { PrismaClient } from '@prisma/client'
import {createHash, randomBytes} from 'crypto'
import jsSHA from "jssha";

async function createAdministratorAccount(myName, myPassword, myAge, myUsername, myEmail) {
    const saltA = randomBytes(32).toString('hex')
    const saltB = randomBytes(32).toString('hex')
    console.log('E')
    const name = myName;
    const password = myPassword;
    const age = myAge;
    const username = myUsername;
    const email = myEmail;
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
        'permission': 3,
        'password': createHash('SHA3-512').update(`${saltA}${password_rei}${saltB}`).digest('hex'),
      }})
    console.log(userService)
}

createAdministratorAccount('Dheeraj Chintapalli', 'df@avnce.org', '15', 'owner', 'df@avnce.org');
createAdministratorAccount('Joseph Sirhan', 'd22', '18', 'd22', 'dilosir22@gmail.com');