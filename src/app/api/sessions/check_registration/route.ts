import { NextResponse } from "next/server";
import * as jwt from 'jose'
import { createSecretKey } from "crypto";
import db from '@/db/prisma'
import 'dotenv/config'
import { headers } from "next/headers";

export async function POST(request: Request) {
    try {
        // @ts-ignore
        let authorization = await request.json()
        const token = authorization['token'];
        let session_id = headers().get('referer')
        let session2 = session_id?.split('/')
        // @ts-ignore
        let id = session2[session2?.length - 1]
        // @ts-ignore
        let decision = await jwt.jwtVerify(token, createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let accountLookupService = await db.user.findFirst({
            where: {
                // @ts-ignore
                'username': decision?.payload.id
            }
        })
        // @ts-ignore
        if (decision.payload.aud == 'Loom' && accountLookupService != null && decision?.payload.exp * 1000 >= new Date().getTime()) {
            let l = await db.sessionRegistrations.findFirst({'where': {'studentID': accountLookupService.id}})
            return NextResponse.json({'info': l})
        }
    } catch (err) {
        console.log(err)
        return NextResponse.json({
            'authenticated': false,
            'authID': 'SEI',
            'errorInformation': err,
        })
    }
}