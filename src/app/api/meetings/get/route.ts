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
            let m_id = await db.session.findFirst({
                'where': {
                    'id': parseInt(id),
                }
            })
            
            if (s_id != null || m_id.hostUsername == accountLookupService.username) {
                let l = new Date().getTime()
                if (((m_id.sessionTime - (60 * 10)) * 1000 <= l) == false && m_id.ended == false) {
                    if (accountLookupService.permission >= 3) {
                        return NextResponse.json({'status': 'WAIT'})
                    }
                    return NextResponse.json({'status': 'Not yet'})
                } else if (m_id.ended == false) {
                    return NextResponse.json({'status': 'Yes'})
                } else {
                    return NextResponse.json({'status': 'Meeting ended.'})
                }
            } else if (m_id.ended == true) {
                return NextResponse.json({'status': 'Meeting ended.'})
            }
            return NextResponse.json({'status': 'accountNotRegistered'})
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