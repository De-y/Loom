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
        // @ts-ignore
        let decision = await jwtVerify(token, createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let accountLookupService = await db.user.findFirst({
            where: {
                // @ts-ignore
                'username': decision?.payload.id
            }
        })
        if (accountLookupService != null && join_code != undefined || join_code != null && accountLookupService != null) {
            let t_spaces_lookup = await (db.spaceTeaching.findFirst({
                'where': {
                    'joinCode': join_code,
                }
            }))
            if (t_spaces_lookup == null) {
                return NextResponse.json({
                    'status': 'The join code might be invalid. Please check the join code.'
                }, {
                    'status': 400
                })
            }
            let spaces_lookup = await db.spaceRegistrar.findFirst({
                'where': {
                    'StudentID': accountLookupService.id,
                    'spaceID': t_spaces_lookup.id
                }
            })

            if (spaces_lookup == null && t_spaces_lookup != null) {
                await db.spaceRegistrar.create({
                    'data': {
                        'StudentID': accountLookupService.id,
                        'spaceID': t_spaces_lookup.id
                    }
                })
                return NextResponse.json({
                    'status': 'DONE'
                }, {
                    'status': 201
                })
            }
        }
        return NextResponse.json({
            'status': 'FAIL'
        }, {
            'status': 400
        })

    } catch (err) {
        return NextResponse.json({
            'status': 'error'
        }, {
            'status': 400
        })
    }
}