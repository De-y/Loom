import { NextResponse } from "next/server";
import * as jwt from 'jose'
import { createSecretKey } from "crypto";
import db from '@/db/prisma'
import {parse} from 'cookie'

export async function POST(request: Request) {
    try {
        // @ts-ignore
        let authorization = await request.json()
        const token = authorization['token'];
        // @ts-ignore
        let decision = await jwt.jwtVerify(token, createSecretKey(process.env.jwt_secret, 'utf-8'))
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
        console.log(err)
        return NextResponse.json({
            'authenticated': false,
            'authID': 'SEI',
        })
    }
}