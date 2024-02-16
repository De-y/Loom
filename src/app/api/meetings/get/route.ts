import { NextResponse } from "next/server";
import * as jwt from 'jose'
import { createSecretKey, randomUUID } from "crypto";
import db from '@/db/prisma'
import 'dotenv/config'
import Axios from 'axios'

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
                    let room_prefix = m_id.sessionName.toLowerCase().split(' ').join('')
                    let mR = await db.meetingRegistrar.findFirst({
                        'where': {
                            'sessionID': parseInt(id)
                        }
                    })
                    if (mR != null) {
                        return NextResponse.json({
                            'status': 'Yes',
                            'inv_link': mR.meetingURL
                        })
                    }
                    let post_information = await Axios.post('https://api.whereby.dev/v1/meetings', {
                        "endDate": new Date((parseInt(m_id.sessionTime) + (m_id.sessionDuration * 60)) * 1000),
                        "roomMode": "group",
                        "roomNamePrefix": `${room_prefix}`,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${process.env.WHEREBY_API}`,
                            'Content-Type': 'application/json',
                        }
                    })
                    post_information = post_information.data
                    console.log(post_information)
                    // @ts-ignore

                    let x = await db.meetingRegistrar.create({data: {
                        'meetingPrefix': room_prefix.toString(),
                        'sessionID': parseInt(id),
                        'meetingURL': post_information['roomUrl'],
                        'meetingName': post_information['roomName'],
                        'meetingID': post_information['meetingId'],
                        'endDate': post_information['endDate']
                    }})
                    return NextResponse.json({'status': 'Yes', 'inv_link': post_information['meetingURL']})
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