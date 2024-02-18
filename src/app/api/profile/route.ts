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
            const profileLookupService = await db.profile.findFirst({
                where: {
                    'relatedUsername': accountLookupService.username
                }
            })
            if (profileLookupService == null || profileLookupService == undefined) {
                await db.profile.create({data: {
                    'relatedUsername': accountLookupService.username
                }})
                return NextResponse.json({
                    'authenticated': true,
                    'profileInformation': {
                        'verified': accountLookupService.verified,
                        'full_name': accountLookupService.name,
                        'age': accountLookupService.age,
                        'is_tutor': accountLookupService.tutor,
                        'learner_statistics': {
                            'hoursLearnt': 0,
                            'minutesLearnt': 0,
                            'sessionsAttended': 0
                        },
                        'tutor_statistics': {
                            'certifications': [],
                            'hoursEarned': 0,
                            'minutesEarned': 0,
                            'sessionsHosted': 0
                        }
                    }
                })    
            }
            return NextResponse.json({
                'authenticated': true,
                'profileInformation': {
                    'verified': accountLookupService.verified,
                    'full_name': accountLookupService.name,
                    'age': accountLookupService.age,
                    'is_tutor': accountLookupService.tutor,
                    'teacher': (accountLookupService.permission >= 2),
                    'learner_statistics': {
                        'hoursLearnt': profileLookupService.hoursLearnt,
                        'minutesLearnt': profileLookupService.minutesLearnt,
                        'sessionsAttended': profileLookupService.sessionsAttended
                    },
                    'tutor_statistics': {
                        'certifications': profileLookupService.certifications,
                        'hoursEarned': profileLookupService.hoursEarned,
                        'minutesEarned': profileLookupService.minutesEarned,
                        'sessionsHosted': profileLookupService.sessionsHosted
                    }
                }
            })
        }
        return NextResponse.json({
            'authenticated': false,
            'authID': 'VEJ',
            'debugAuth': [token, decision, accountLookupService]
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