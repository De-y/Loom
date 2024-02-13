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
        // @ts-ignore
        let id = authorization['id']
        // @ts-ignore
        let c = await db.session.findFirst({'where': {'id': parseInt(id)}})
        let time = ((c.sessionTime) + (c.sessionDuration /60)* 1000)
        let s = new Date().getTime()
        if (time <= s) {
            await db.session.update({'where': {
                'id': parseInt(id)
            }, 'data': {
                'ended': true,
            }})
            return NextResponse.json({
                'meetingEnded': true,
                'meetingFull': false,
            })
        }
        return NextResponse.json({
            'meetingEnded': false,
            'meetingFull': false,
        })
    } catch (err) {
        console.log(err)
        return NextResponse.json({
            'authenticated': false,
            'authID': 'SEI',
            'errorInformation': err,
        })
    }
}