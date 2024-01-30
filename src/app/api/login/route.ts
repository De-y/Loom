import { NextResponse } from "next/server"
import * as jwt from 'jose'
import { createSecretKey } from "crypto";

export async function POST(request: Request) {
  const data = await request.json();
  const { username, password } = data;
  let token, authenticated;
  if (username == 'admin' && password=='admin') {
    token = await new jwt.SignJWT({id: username}).setProtectedHeader({alg: 'HS256'}).setAudience('Loom').setExpirationTime('1 year').sign(createSecretKey(process.env.JWT_Secret, 'utf-8'))
    authenticated = true
  } else {
    token = undefined;
    authenticated = false;
  }
  console.log(username, password)
  return NextResponse.json({
    'token': token,
    'authenticated': authenticated,
  })
}