import { NextResponse } from "next/server"
import * as jwt from 'jose'
import { createSecretKey, createHash, randomBytes } from "crypto";
import db from '@/db/prisma'
import 'dotenv/config'

export async function POST(request: Request) {
  const data = await request.json();
  const { username, password, age, name, email } = data;
  let token, authenticated;
  const checkService = await db.user.findFirst({where: {
    'username': username,
  }})
  const checkEmailService = await db.user.findFirst({where: {
    'email': email,
  }})
  if (checkService == null || checkService == undefined) {
    if (checkEmailService == null || checkEmailService == undefined) {
      const saltA = randomBytes(32).toString('hex')
      const saltB = randomBytes(32).toString('hex')
      const userService = await db.user.create({data: {
        'username': username,
        'age': age,
        'name': name,
        'email': email,
        'saltA': saltA,
        'saltB': saltB,
        'password': createHash('SHA3-512').update(`${saltA}${password}${saltB}`).digest('hex'),
      }})
      if (true == true) {
        // @ts-ignore
        token = await new jwt.SignJWT({id: username}).setProtectedHeader({alg: 'HS256'}).setAudience('Loom').setExpirationTime('1 year').sign(createSecretKey(process.env.JWT_Secret, 'utf-8'))
        authenticated = true    
      } else {
        token = undefined;
        authenticated = false;
      }
      return NextResponse.json({
        'token': token,
        'authenticated': authenticated,
      })
    } else {
      return NextResponse.json({
        'token': undefined,
        'authenticated': false,
        'message': 'Email is used.'
      })
    }
  } else {
    return NextResponse.json({
      'token': undefined,
      'authenticated': false,
      'message': 'Username is used.'
    })
  }  
}