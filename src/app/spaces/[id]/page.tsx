import db from '@/db/prisma'
import * as jwt from 'jose'
import { cookies, headers } from "next/headers"
import { createSecretKey } from "crypto";
import 'dotenv/config'
import { redirect } from 'next/navigation';
import '@/css/sessions/sessions.css'
import UseSession from '@/components/createSession';
import DashboardNavbar from '@/components/dashboard_nav';
export default async function space({ params }: { params: { id: string } }) {
    // Authenticate
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
    async function tutoringfilterer(session: any) {
        if (parseInt(session.sessionTime) >= (new Date().getTime() / 1000) || session.ended != false) {
            return true;
        } else {
            return false;
        }
    }
    let sessionsList = await db.session.findMany({where: {
        'hostUsername': accountLookupService['username'],
        'spaceID': currentSpaceID
    }})
    
    async function sessionsFilterer(s: any) {
        let better_l = []
        for (let i in s) {
            let session = s[i]
            if (parseInt(session.sessionTime) >= (new Date().getTime() / 1000) || session.ended == false) {
                if (((new Date().getTime() / 1000) + (604800 * 10)) >= session.sessionTime) {
                    better_l.push(session)
                } else {
                    continue
                }
            } else {
                continue
            }
        }
        return better_l;
    }
    
    let openSessions = await db.session.findMany({
        where: {
            'ended': false,
            'spaceID': currentSpaceID,
        }
    })
    openSessions = (await sessionsFilterer(openSessions))
    sessionsList = (await sessionsFilterer(sessionsList))
    return (
        <>
        <DashboardNavbar />
        <div className='tutoringlearn'>
            <h1>{currentSpace.name}</h1>
        </div>
        {isTutor ? (<>
                    <UseSession />
            </>) : null
        }
        {isTutor ? (<>
            <br />
            <div className='sessions'>
                <h1>Your Current Sessions:</h1>
                <br />
                <div className='sessions-cd'>
                    {(sessionsList.length > 0) ? (<>
                    {Object.keys(sessionsList).map((sessions) => (
                        <a key={sessions} className='card' href={`/sessions/${sessionsList[sessions].id}`}>
                            <div className='card-content'>
                                <h1>{sessionsList[sessions].sessionName}</h1>
                                <h3>On {new Date(sessionsList[sessions].sessionTime * 1000).toDateString()}</h3>
                                <h4>From {`${new Date(sessionsList[sessions].sessionTime * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} - ${new Date((parseInt(sessionsList[sessions].sessionTime) + (sessionsList[sessions].sessionDuration * 60)) * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`}</h4>
                                <h4>Registered Students (Including yourself): {sessionsList[sessions].registeredUsers}/{sessionsList[sessions].maxUsers}</h4>
                            </div>
                        </a>                   
                    ))}
                    </>) : (<>
                        <div className='card'>
                            <div className='card-content'>
                                <h1>No sessions created.</h1>
                                <p>Click create a new session to create a new session.</p>
                            </div>
                        </div>                   
                    </>)
                    }
                </div>
            </div>
        </>) : null}
        <br />
        <div className='sessions'>
            <h1>Open Sessions</h1>
            <br />
            <div className='sessions-cd'>
                {(openSessions.length > 0) ? (<>
                    {Object.keys(openSessions).map((sessions) => (
                            <a key={sessions} className='card' href={`/sessions/${openSessions[sessions].id}`}>
                                <div className='card-content'>
                                    <h1>{openSessions[sessions].sessionName}</h1>
                                    <h2>Hosted by {openSessions[sessions].hostFirstName}.</h2>
                                    <h3>On {new Date(openSessions[sessions].sessionTime * 1000).toDateString()}</h3>
                                    <h4>From {`${new Date(openSessions[sessions].sessionTime * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} - ${new Date((parseInt(openSessions[sessions].sessionTime) + (openSessions[sessions].sessionDuration * 60)) * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`}</h4>
                                    <h4>Registered Students: {openSessions[sessions].registeredUsers}/{openSessions[sessions].maxUsers}</h4>
                                </div>
                            </a>                    
                    ))}
                </>) : (<>
                    <div className='card'>
                            <div className='card-content'>
                                <h1>No sessions available.</h1>
                                <p>Well, this is embarrasing. Please check back later.</p>
                            </div>
                        </div>                   
                </>)}
                </div>
            </div>
            <br />
        </>
    )
}