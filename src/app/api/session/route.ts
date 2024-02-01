import { NextResponse } from "next/server";
import * as jwt from 'jose'
import { createSecretKey } from "crypto";
import db from '@/db/prisma'
import { cookies } from 'next/headers'
import {parse} from 'cookie'

export async function GET(request: Request) {
    try {
        // @ts-ignore
        let token = cookies().get('authorization')['value']
        // @ts-ignore
        let decision = await jwt.jwtVerify(parse(token)['authorization'], createSecretKey(process.env.jwt_secret, 'utf-8'))
        console.log(decision)
        let accountLookupService = await db.user.findFirst({
            where: {
                // @ts-ignore
                'email': decision?.payload.id
            }
        })
        // @ts-ignore
        if (decision.payload.aud == 'Loom' && accountLookupService != null && decision?.payload.exp * 1000 >= new Date().getTime()) {
            return NextResponse.json({
                'authenticated': true,
            })
        }
        return NextResponse.json({
            'authenticated': false,
            'authID': 'VEJ',
            'debugAuth': [token, decision, accountLookupService]
        })
    } catch (err) {
        return NextResponse.json({
            'authenticated': false,
            'authID': 'SEI',
            'error': err,
        })
    }
}