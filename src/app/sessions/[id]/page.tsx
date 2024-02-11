import db from "@/db/prisma"
import * as jwt from 'jose'
import { cookies, headers } from "next/headers"
import { createSecretKey } from "crypto";
import 'dotenv/config';
import { redirect } from "next/navigation";
import '@/css/sessions/sessionpage.css'

export default async function sessionInformation({ params }: { params: { id: string } }) {
    const cookieStore = cookies().get('authorization')?.value
    if (cookieStore == undefined) {
        redirect('/logout')
    }
    // @ts-ignore
    let decision = await jwt.jwtVerify(cookieStore, createSecretKey(process.env.JWT_Secret, 'utf-8'))
    let accountLookupService = await db.user.findFirst({
        where: {
            // @ts-ignore
            'username': decision?.payload.id
        }
    })
    if (decision == undefined || accountLookupService == undefined) {
        redirect('/logout')
    }
    let isVerified = accountLookupService['verified']
    if (isVerified == false) {
        redirect('/application')
    }
    let sessionData = await db.session.findFirst({where: {
        'id': parseInt(params.id)
    }});
    console.log(sessionData)
    return (
        <>
            <h1>{sessionData.sessionTime}</h1>
        </>
    )
}