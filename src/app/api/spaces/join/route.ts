import db from "@/db/prisma";
import { createSecretKey } from "crypto";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // @ts-ignore
    try {
        // @ts-ignore
        let join_code = (await request.json()).join_code
        // @ts-ignore
        let token = cookies().get('authorization').value
        if (token == undefined) {
            return NextResponse.json({
                'availableSpaces': [
                    {
                        'name': 'Algebra 1',
                        'url': '/spaces/algebra1',
                        'uid': 1
                    },
                    {
                        'name': 'Algebra 2',
                        'url': '/spaces/algebra2',
                        'uid': 2
                    },
                    {
                        'name': 'Precalculus',
                        'url': '/spaces/precalculus',
                        'uid': 3
                    },
                    {
                        'name': 'English',
                        'url': '/spaces/english',
                        'uid': 4
                    },
                    {
                        'name': '日本語',
                        'url': '/spaces/japanese',
                        'uid': 5
                    }
                ]
            })    
        }
        // @ts-ignore
        let decision = await jwtVerify(token, createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let accountLookupService = await db.user.findFirst({
            where: {
                // @ts-ignore
                'username': decision?.payload.id
            }
        })
        if (accountLookupService != null && join_code != undefined || join_code != null && accountLookupService != null) {
            let spaces_lookup = await db.spaceRegistrar.findMany({
                'where': {
                    'StudentID': accountLookupService.id
                }
            })
            let t_spaces_lookup = await (db.spaceTeaching.findFirst({
                'where': {
                    'joinCode': join_code
                }
            }))
            if (spaces_lookup == null && t_spaces_lookup != null) {
                await db.spaceRegistrar.create({
                    'data': {
                        'StudentID': accountLookupService.id,
                        'spaceID': spaces_lookup.id
                    }
                })
                return NextResponse.json({
                    'status': 'DONE'
                }, {
                    'status': 201
                })
            }
            return NextResponse.json({
                'status': 'FAIL'
            }, {
                'status': 400
            })
        }
    } catch {
        return NextResponse.json({
            'status': 'error'
        }, {
            'status': 400
        })
    }
}