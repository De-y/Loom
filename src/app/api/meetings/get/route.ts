import { NextResponse } from "next/server";
import * as jwt from 'jose'
import { createSecretKey } from "crypto";
import db from '@/db/prisma'
import 'dotenv/config'
import { headers } from "next/headers";

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const id = data['sessionID']
        const token = data['token']
        // @ts-ignore
        // for (spaces in availableSpaces.availableSpaces) {
        //     console.log(spaces)
        // }
        // @ts-ignore
        let decision = await jwt.jwtVerify(token, createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let accountLookupService = await db.user.findFirst({
            where: {
                // @ts-ignore
                'username': decision?.payload.id
            }
        })
        // @ts-ignore
        if (decision.payload.aud == 'Loom' && accountLookupService != null && decision?.payload.exp * 1000 >= new Date().getTime() && accountLookupService?.permission >= 1) {
            let s_id = await db.sessionRegistrations.findFirst({
                'where': {
                    'sessionID': parseInt(id),
                    'studentID': accountLookupService.id
                }
            })     
            if (s_id != null) {
                let m_id = await db.session.findFirst({
                    'where': {
                        'id': parseInt(id),
                    }
                })
                let l = new Date().getTime()
                if (((m_id.sessionTime - (60 * 10)) * 1000 <= l) == false) {
                    return NextResponse.json({'status': 'Not yet'})
                }
                return NextResponse.json({'e': 'e'})
            }
            return NextResponse.json({'e': 'e'})
        } else {
            return NextResponse.json({'status': 'Account does not exist.'}, {
                'status': 403,
            })
        }
    } catch (err) {
        console.log(err)
        return NextResponse.json({'status': 'Your session is invalid.'}, {
            'status': 403,
        })
    }
}