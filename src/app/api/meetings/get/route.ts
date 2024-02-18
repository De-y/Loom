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
                if (((parseInt(m_id.sessionTime) - (60 * 10)) * 1000 <= l) != true && m_id.ended == false) {
                    if (accountLookupService.permission >= 3) {
                        return NextResponse.json({'status': 'WAIT'})
                    }
                    return NextResponse.json({'status': 'WAIT'})
                } else if (m_id.ended == false) {
                    let room_prefix = m_id.sessionName.toLowerCase().split(' ').join('')
                    let mR = await db.meetingRegistrar.findFirst({
                        'where': {
                            'sessionID': parseInt(id)
                        }
                    })
                    if (mR != null) {
                        let c = await Axios.get(`https://api.whereby.dev/v1/meetings/${mR.meetingID}`, {
                            'headers': {
                                'Authorization': `Bearer ${process.env.WHEREBY_API}`,
                                'Content-Type': 'application/json',
                            }
                        })
                        let s = await Axios.get("https://api.whereby.dev/v1/insights/room-sessions", {
                            'headers': {
                                'Authorization': `Bearer ${process.env.WHEREBY_API}`,
                                'Content-Type': 'application/json',
                                'roomName': mR.meetingName,
                                'roomSessionId': mR.meetingID
                            }
                        })
                        s = s.data.results
                        for (let i in s) {
                            // @ts-ignore
                            if (s[i].roomName == mR.meetingName) {
                                // @ts-ignore
                                s = s[i]
                                await Axios.delete(`https://api.whereby.dev/v1/meetings/${mR.meetingID}`, {
                                    'headers': {
                                        'Authorization': `Bearer ${process.env.WHEREBY_API}`,
                                        'Content-Type': 'application/json',
                                        'roomName': mR.meetingName
                                    }
                                })
                                // @ts-ignore
                                let tutorMinutes = new Date(s.totalParticipantMinutes * 60 * 1000).getMinutes()
                                // @ts-ignore
                                let tutorProfile = await db.profile.findFirst({
                                    'where': {
                                        'relatedUsername': m_id.hostUsername
                                    }
                                })
                                await db.profile.update({
                                    'where': {
                                        'id': tutorProfile.id,
                                    },
                                    'data': {
                                        // @ts-ignore
                                        'minutesEarned': tutorProfile.minutesEarned + parseInt(tutorMinutes),
                                        // @ts-ignore
                                        'sessionsHosted': tutorProfile.sessionsHosted + 1,
                                    }
                                })
                                await db.session.update({
                                    'where': {
                                        'id': parseInt(id)
                                    },
                                    'data': {
                                        'ended': true
                                    }
                                })
                                return NextResponse.json({'status': 'Meeting ended.'})    
                            }
                            else {
                                continue
                            }
                        }
                        // @ts-ignore
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
                    // @ts-ignore

                    await db.meetingRegistrar.create({data: {
                        'meetingPrefix': room_prefix.toString(),
                        'sessionID': parseInt(id),
                        // @ts-ignore
                        'meetingURL': post_information['roomUrl'],
                        // @ts-ignore
                        'meetingName': post_information['roomName'],
                        // @ts-ignore
                        'meetingID': post_information['meetingId'],
                        // @ts-ignore
                        'endDate': post_information['endDate']
                    }})
                    // @ts-ignore
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