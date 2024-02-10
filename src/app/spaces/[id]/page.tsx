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
    }
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
    let profileLookupService = await db.profile.findFirst({where: {
        'relatedUsername': accountLookupService['username']
    }})
    if (profileLookupService.certifications == undefined) {
        for (let certifications in profileLookupService.certifications) {
            if (certifications != currentSpaceID) {
                if (accountLookupService.permission >= 2) {
                    isTutor = true;
                } else {
                    isTutor = false;
                }        
            }
        }
    } else {
        if (accountLookupService.permission >= 2) {
            isTutor = true;
        } else {
            isTutor = false;
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
            <br />
            <div className='sessions'>
                <h1>Your Sessions</h1>
                <div className='sessions-cd'>
                    <div className='card'>
                        <div className='card-content'>
                            <h1>No sessions created.</h1>
                            <p>Click Create a new session to make a new session</p>
                        </div>
                    </div>
                </div>
            </div>
        </>) : null}
        <br />
        <div className='sessions'>
            <h1>Open Sessions</h1>
            <br />
            <div className='sessions-cd'>
                <div className='united-card'>
                    <a className='card' href="/spaces/sessions">
                        <div className='live-pill'>
                                <h2>ENDED</h2>
                        </div>
                        <div className='card-content'>
                            <h1>Session Name</h1>
                            <h2>By sessionAuthor</h2>
                            <h3>On sessionDate</h3>
                            <h4>From tStart - tEnd</h4>
                        </div>
                    </a>
                </div>
            </div>
        </div>

        </>
    )
}