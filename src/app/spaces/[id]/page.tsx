import db from '@/db/prisma'
import * as jwt from 'jose'
import { cookies, headers } from "next/headers"
import { createSecretKey } from "crypto";
import 'dotenv/config'
import { redirect } from 'next/navigation';
import '@/css/sessions/sessions.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'

export default async function space({ params }: { params: { id: string } }) {
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
    let isTutor = accountLookupService['tutor']
    let isVerified = accountLookupService['verified']
    if (isVerified == false) {
        redirect('/application')
    }
    let e =await fetch(`http://${headers().get('Host')}/api/spaces`);
    e = await e.json()
    // @ts-ignore
    e = e.availableSpaces
    let currentSpaceID, currentSpace;
    for (let i in e) {
        // @ts-ignore
        if (e[i].url == `/spaces/${params.id}`) {
            // @ts-ignore
            currentSpaceID = e[i].uid;
            // @ts-ignore
            currentSpace = e[i]
        }
        else {
            if (currentSpace == undefined) {
                return (
                    <>
                        <div className='invalid-loom-space'>
                            <h1>This space does not exist.</h1>
                            <br />
                            <a href='/spaces'>Return to Spaces</a>
                        </div>
                    </>
                )
            }
        }
    }   
    return (
        <>
        <div className='tutoringlearn'>
            <h1>Spaces / {currentSpace.name}</h1>
        </div>
        {isTutor ? (<>
                <div className='tutor-btn'>
                    <a href="/"><FontAwesomeIcon icon={faPlus} /> Create a New Session</a>
                </div>
            </>) : null
        }
        {isTutor ? (<>
            <div className='sessions'>
                <h1>Your Sessions</h1>
            </div>
        </>) : null}
        <div className='sessions'>
        <h1>Available Sessions</h1>
        </div>

        </>
    )
}