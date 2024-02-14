import { NextResponse } from "next/server";
import db from '@/db/prisma'
import { headers } from "next/headers";
import { jwtVerify } from "jose";
import { createSecretKey } from "crypto";
import 'dotenv/config'

export async function DELETE(request: Request) {
    try {
        let data = (await request.json())
        let deletion_id = data['delete_id']
        let token = data['token']
        // @ts-ignore
        let decision = await jwtVerify(token, createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let accountLookupService = await db.user.findFirst({
            where: {
                // @ts-ignore
                'username': decision?.payload.id
            }
        })
        // @ts-ignore
        if (decision.payload.aud == 'Loom' && accountLookupService != null && decision?.payload.exp * 1000 >= new Date().getTime()) {
            let lk = await db.session.findFirst({
                'where': {
                    'hostUsername': accountLookupService.username,
                    'id': deletion_id,
                }
            })

            if (lk != undefined || lk != null || accountLookupService.permission >= 3) {
                await db.session.delete({
                    'where': {
                        'hostUsername': accountLookupService.username,
                        'id': deletion_id,    
                    }
                })
                await db.sessionRegistrations.deleteMany({
                    'where': {
                        'sessionID': deletion_id
                    }
                })
                return NextResponse.json({'status': 'OK'}, {
                    'status': 200
                })
            }
        }
        return NextResponse.json({'status': 'ok'})
    } catch (err) {
        console.log(err)
        return NextResponse.json({
            'status': 'no authorization'
        })
    }
}