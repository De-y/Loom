import { NextResponse } from "next/server";
import * as jwt from 'jose'
import { createSecretKey } from "crypto";
import db from '@/db/prisma'
import { PrismaClientInitializationError } from "@prisma/client/runtime/library.js";
import {parse} from 'cookie'

export async function GET(request: Request) {
    try {
        let token = request.headers.get('cookie')
        // @ts-ignore
        let decision = await jwt.jwtVerify(parse(token)['authorization'], createSecretKey(process.env.jwt_secret, 'utf-8'))
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
        })
    } catch (err) {
        return NextResponse.json({
            'authenticated': false,
        })
    }
}