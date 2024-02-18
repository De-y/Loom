import db from "@/db/prisma";
import { createSecretKey } from "crypto";
import { jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // @ts-ignore
    try {
        let token
        // @ts-ignore
        try {
            // @ts-ignore
            token = cookies().get('authorization').value
        } catch {
            token = headers().get('authorization')
        }
        if (token == undefined) {
            return NextResponse.json({
                'availableSpaces': [
                    {
                        'name': 'Algebra 1',
                        'url': '/spaces/algebra1',
                        'uid': 1029589992
                    },
                    {
                        'name': 'Algebra 2',
                        'url': '/spaces/algebra2',
                        'uid': 1029589993
                    },
                    {
                        'name': 'Precalculus',
                        'url': '/spaces/precalculus',
                        'uid': 1029589994
                    },
                    {
                        'name': 'English',
                        'url': '/spaces/english',
                        'uid': 1029589995
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
        if (accountLookupService != null) {
            let spaces_lookup = await db.spaceRegistrar.findMany({
                'where': {
                    'StudentID': accountLookupService.id
                }
            })
            let t_spaces_lookup = await (db.spaceTeaching.findMany({
                'where': {
                    'TeacherID': accountLookupService.id
                }
            }))
            if (spaces_lookup.length == 0 && t_spaces_lookup.length == 0) {
                return NextResponse.json({
                    'availableSpaces': [
                        {
                            'name': 'Algebra 1',
                            'url': '/spaces/algebra1',
                            'uid': 1029589992
                        },
                        {
                            'name': 'Algebra 2',
                            'url': '/spaces/algebra2',
                            'uid': 1029589993
                        },
                        {
                            'name': 'Precalculus',
                            'url': '/spaces/precalculus',
                            'uid': 1029589994
                        },
                        {
                            'name': 'English',
                            'url': '/spaces/english',
                            'uid': 1029589995
                        },
                        {
                            'name': '日本語',
                            'url': '/spaces/japanese',
                            'uid': 5
                        }
                    ]
                })
            } else {
                let c = [
                    {
                        'name': 'Algebra 1',
                        'url': '/spaces/algebra1',
                        'uid': 1029589992
                    },
                    {
                        'name': 'Algebra 2',
                        'url': '/spaces/algebra2',
                        'uid': 1029589993
                    },
                    {
                        'name': 'Precalculus',
                        'url': '/spaces/precalculus',
                        'uid': 1029589994
                    },
                    {
                        'name': 'English',
                        'url': '/spaces/english',
                        'uid': 1029589995
                    },
                    {
                        'name': '日本語',
                        'url': '/spaces/japanese',
                        'uid': 5
                    }
                ]
                for (let i in c) {
                    t_spaces_lookup.push(c[i])
                }
                if (spaces_lookup.length == 0) {
                    return NextResponse.json({
                        'availableSpaces': t_spaces_lookup
                    })
                } else {
                    let c = [
                        {
                            'name': 'Algebra 1',
                            'url': '/spaces/algebra1',
                            'uid': 1029589992
                        },
                        {
                            'name': 'Algebra 2',
                            'url': '/spaces/algebra2',
                            'uid': 1029589993
                        },
                        {
                            'name': 'Precalculus',
                            'url': '/spaces/precalculus',
                            'uid': 1029589994
                        },
                        {
                            'name': 'English',
                            'url': '/spaces/english',
                            'uid': 1029589995
                        },
                        {
                            'name': '日本語',
                            'url': '/spaces/japanese',
                            'uid': 5
                        }
                    ]
                    for (let i in c) {
                        spaces_lookup.push(c[i])
                    }
                    return NextResponse.json({
                        'availableSpaces': spaces_lookup
                    })
                }
            }
        }
    } catch (err) {
        return NextResponse.json({
            'status': 'error'
        }, {
            'status': 400
        })
    }
}