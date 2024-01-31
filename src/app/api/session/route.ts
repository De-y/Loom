import { NextResponse } from "next/server";
import * as jwt from 'jose'
import { createSecretKey } from "crypto";
import db from '@/db/prisma'

export async function GET(request: Request) {
    return NextResponse.json({
        'authenticated': true,
    })
}