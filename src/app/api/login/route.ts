import { NextResponse } from "next/server"
import * as jwt from 'jose'
import { createSecretKey, createHash } from "crypto";
import db from '@/db/prisma'

export async function POST(request: Request) {
  const data = await request.json();
  const { username, password } = data;
  let token, authenticated;
  const userService = await db.user.findFirst({where: {
    'username': username,
  }})
  if (userService != undefined && userService.password == createHash('SHA3-512').update(`${userService.saltA}${password}${userService.saltB}`).digest('hex')) {
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
}