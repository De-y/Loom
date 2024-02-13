// Overhaul this

'use client'
import '@/css/sessions/sessionpage.css'
import db from '@/db/prisma';
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
export default function JoinSession({id, url}: any) {
    const [cl, setCl] = useState(null);
    const [el, setEl] = useState(null);
    const [endedecidor, setEndedDecisor] = useState(false);
    const [meetingJoin, setmeetingJoin] = useState(false);
    const [meetingURL, setmeetingURL] = useState(null)
    function sumit() {
        fetch(url + '/api/sessions/signup', {
            'method': 'POST',
            'body': JSON.stringify({
                'token': getCookie('authorization'),
            })
        }).then((req) => {
            req.json().then((promise) => {
                // @ts-ignore
                setCl(true)
            })
        })
    }
    fetch(url + '/api/profile', {
        'method': 'POST',
        'body': JSON.stringify({
            'token': getCookie('authorization')
        })
    }).then((ex) => {
        ex.json().then((cl) => {
            fetch(url + '/api/sessions/check_registration', {
                'method': 'POST',
                'body': JSON.stringify({
                    'token': getCookie('authorization')
                })
            }).then((mr) => {
                mr.json().then((ec) => {
                    if (ec.info == null) {
                        // @ts-ignore
                        setEl('JSP')
                    }
                })
            })
        })
    })
    fetch(url + '/api/sessions/check_session', {
        'method': 'POST',
        'body': JSON.stringify({
            'id': id
        })
    }).then((res) => {
        res.json().then((ens) => {
            if (ens.meetingEnded != false && el != null) {
                setEndedDecisor(false)
            } else {
                setEndedDecisor(false)
            }
        })
    })
    fetch(url + '/api/meetings/get', {
        'method': 'POST',
        'body': JSON.stringify({
            'token': getCookie('authorization'),
            'sessionID': id,
        })
    }).then((req) => {
        req.json().then((res) => {
            // @ts-ignore
            if (res.status != "Not yet") {
                setmeetingJoin(true);
                // @ts-ignore
                setmeetingURL("rvre")
            }
        })
    })
    return (
        <>
            <br />
            { (endedecidor == true) ? (
                <>
                        <button className='signup-disabled' disabled={true}>
                            Signup
                        </button>
                </>
            ) : (
                <>
                            {
                (el != null || el != undefined) ? (
                    <>
                    {cl != null ? (
                            <p className='alr'>You are registered for this session!</p>
                        ) : (
                            <>
                                        <form action={sumit}>
                                            <button className='signup' type='submit'>
                                                Signup
                                            </button>
                                        </form>
                            </>
                        )}
                    </>      
                ) : (<>
                    {
                        (meetingJoin != false) ? (
                            <>
                                <form action={`${meetingURL}`}>
                                    <button className='signup' type='submit'>
                                    Join Meeting
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <form action={`${meetingURL}`}>
                                    <button className='signup-disabled' disabled={true} type='submit'>
                                    Join Meeting
                                    </button>
                                </form>
                                <p>The meeting link will open up 10 minutes before the session begins.</p>
                            </>
                        )
                    }
                </>)
            }
                </>
            )}
            </>
    )
}