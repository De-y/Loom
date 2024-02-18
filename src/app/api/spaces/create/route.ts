import db from "@/db/prisma";
import { createSecretKey } from "crypto";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function generateRandomCode(length: any) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
}

export async function POST(request: Request) {
    // @ts-ignore
    try {
        // @ts-ignore
        let class_name = (await request.json()).class_name
        // @ts-ignore
        let token = cookies().get('authorization').value
        if (token == undefined) {
            return NextResponse.json({
                'status': 'No Amigo'
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
        if (accountLookupService != null && class_name != undefined || class_name != null && accountLookupService != null) {
                let uid = (await db.spaceTeaching.aggregate({'_count': {'_all': true}}))['_count']['_all'] + 1
                const join_code = generateRandomCode(7);
                await db.spaceTeaching.create({
                    'data': {
                        'TeacherID': accountLookupService.id,
                        'name': class_name,
                        'uid': uid,
                        'joinCode': join_code,
                        'url': `/spaces/${uid}`
                    },
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
    } catch {
        return NextResponse.json({
            'status': 'error'
        }, {
            'status': 400
        })
    }
}