import { NextResponse } from "next/server";
import db from '@/db/prisma'
import { headers } from "next/headers";

export async function POST(request: Request) {
    let data = (await request.json())
    let id = data['id'].id
    let session_finder = await db.session.findFirst({
        'where': {
            'id': id,
        }
    })
    if (session_finder != null || session_finder != undefined) {
        return NextResponse.json({
            'status': 'authorized',
            'sessionDuration': session_finder.sessionDuration,
            'sessionName': session_finder.sessionName,
            'sessionTime': session_finder.sessionTime,
            'maxUsers': session_finder.maxUsers,
        })
    }
    return NextResponse.json({'status': 'ok'})
}