import { NextResponse } from "next/server";
import db from '@/db/prisma'
import { headers } from "next/headers";

export async function POST(request: Request) {
    let data = (await request.json())
    return NextResponse.json({'status': 'ok'})
}