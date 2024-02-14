import { NextResponse } from "next/server";
import * as jwt from 'jose'
import { createSecretKey } from "crypto";
import db from '@/db/prisma'
import 'dotenv/config'
import { headers } from "next/headers";

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const coreInformation = data['sessionInformation']
        const handoffInformation = data['handoff']
        const ID = handoffInformation.path.id
        let availableSpaces = await fetch(`${headers().get('origin')}/api/spaces`)
        availableSpaces = await availableSpaces.json()
        // @ts-ignore
        availableSpaces = availableSpaces.availableSpaces
        let credentialsIdentity;
        for (let i in availableSpaces) {
            // @ts-ignore
            if (availableSpaces[i].url = ID) {
                // @ts-ignore
                credentialsIdentity = availableSpaces[i].uid
                break
            }
        }
        // for (spaces in availableSpaces.availableSpaces) {
        //     console.log(spaces)
        // }
        // @ts-ignore
        let decision = await jwt.jwtVerify(handoffInformation.token, createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let accountLookupService = await db.user.findFirst({
            where: {
                // @ts-ignore
                'username': decision?.payload.id
            }
        })
        // @ts-ignore
        if (decision.payload.aud == 'Loom' && accountLookupService != null && decision?.payload.exp * 1000 >= new Date().getTime() && accountLookupService?.permission >= 1) {
            const profileLookupService = await db.profile.findFirst({
                where: {
                    'relatedUsername': accountLookupService.username
                }
            })
            let matchFound;
            for (let identity in profileLookupService.certifications) {
                if (profileLookupService.certifications[identity] == credentialsIdentity) {
                    matchFound = true;
                    break
                }
            }
            if (matchFound || accountLookupService.permission >= 2) {
                if (coreInformation.destinedTime <= (new Date().getTime() / 1000)) {
                    return NextResponse.json({'status': 'Invalid Time. The time needs to be hours ahead of the current time.'}, {
                        'status': 400,
                    })    
                }
                if ((new Date(coreInformation.destinedTime * 1000).getUTCFullYear() <= (new Date().getUTCFullYear() + 1))) {
                    if ((new Date(coreInformation.destinedTime * 1000).getUTCMonth() == new Date().getUTCMonth()) == false) {
                        return NextResponse.json({'status': 'Start date must be within a full year and date of today.'})
                    }
                    await db.session.update({
                        'where': {
                            'id': ID
                        },
                        'data': {
                            'sessionName': coreInformation.name,
                            'sessionTime': coreInformation.destinedTime.toString(),
                            'sessionDuration': parseInt(coreInformation.duration),
                            // @ts-ignore
                            'hostUsername': decision?.payload.id,
                            'hostFirstName': `${accountLookupService.name.split(' ')[0]} ${accountLookupService.name.split(' ')[accountLookupService.name.split(' ').length - 1][0]}`,
                            'maxUsers': parseInt(coreInformation.max_users),   
                        }
                    })
                    // @ts-ignore
                    // USE ${l.id} BELOW
                    return NextResponse.json({'status': 'OK', 'sessionPage': `/sessions/${ID}`}, {'status': 202})
                }
                return NextResponse.json({'status': 'You do not have permissions to create a session.'}, {
                    'status': 403,
                })

            } else {
                return NextResponse.json({'status': 'You do not have permissions to create a session.'}, {
                    'status': 403,
                })
            }
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