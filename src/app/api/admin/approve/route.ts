import { NextResponse } from "next/server";
import * as jwt from 'jose'
import { createSecretKey } from "crypto";
import db from '@/db/prisma'
import 'dotenv/config'

export async function POST(request: Request) {
    try {
        // @ts-ignore
        let authorization = await request.json()
        const token = authorization['token'];
        const uid = authorization['confirm']['UID']
        const all = authorization['confirm']['all']
        console.log(token, uid, all)
        // @ts-ignore
        let decision = await jwt.jwtVerify(token, createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let accountLookupService = await db.user.findFirst({
            where: {
                // @ts-ignore
                'username': decision?.payload.id
            }
        })
        // @ts-ignore
        if (decision.payload.aud == 'Loom' && accountLookupService != null && decision?.payload.exp * 1000 >= new Date().getTime() && accountLookupService.permission >= 3) {
            if (all == true) {
                let e = await db.user.updateMany({
                    // @ts-ignore
                    'where': {
                        'verified': false,
                    },
                    'data': {
                        'verified': true
                    }
                })
                return NextResponse.json({'status': 'ok'})
            }    
            let e = await db.user.update({
                'where': {
                    'id': uid,
                },
                'data': {
                    'verified': true
                }
            })            
            return NextResponse.json({'status': 'ok'})
        }
    } catch (err) {
        console.log(err)
        return NextResponse.json({'status': 'Error'}, {
            'status': 500
        })
    }
}