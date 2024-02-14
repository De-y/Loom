import DashboardNavbar from '@/components/dashboard_nav';
import EditSession from '@/components/editsession';
import '@/css/sessions/edit.css'
import db from "@/db/prisma"
import { createSecretKey } from 'crypto';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export default async function editSessionInformation({ params }: { params: { id: string } }) {
    let id = parseInt(params.id);
    let tk = cookies().get('authorization')?.value
    let decision;            <div className='edit'>
                <h1>Edit Session</h1>
            </div>
    try {
        // @ts-ignore
        decision = await jwtVerify(tk, createSecretKey(process.env.JWT_Secret, 'utf-8'))
    } catch {
        redirect('/logout')
    }
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

    // let authy = await db.session.findFirst({
    //     'where': {

    //     }
    // })
    let c = await db.session.findFirst({'where': {
        'id': id
    }})
    if (c == undefined || c == null) {
        redirect('/spaces')
    } else {
        if (c.hostUsername != accountLookupService.username) {
            redirect('/spaces')
        } else if (c.ended == true) {
            redirect('/spaces')
        }
    }
    
    return (
        <>
            <DashboardNavbar />
            <div className='edit'>
                <h1>Edit Session</h1>
                <EditSession id={id}/>
            </div>
        </>
    )
};