// Overhaul this

'use client'
import '@/css/sessions/sessionpage.css'
import db from '@/db/prisma';
import { CircularProgress } from '@mui/material';
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
export default function JoinSession({id}: any) {
    let url = ''
    const [cl, setCl] = useState(null);
    const [el, setEl] = useState(null);
    const [endedecidor, setEndedDecisor] = useState(false);
    const [meetingJoin, setmeetingJoin] = useState(false);
    const [meetingURL, setmeetingURL] = useState(null)
    const [loading, setLoading] = useState(true)
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
    useEffect(() => {
        fetch(url + '/api/meetings/get', {
            'method': 'POST',
            'body': JSON.stringify({
                'token': getCookie('authorization'),
                'sessionID': id,
            })
        }).then((req) => {
            req.json().then((res) => {
                // @ts-ignore
                setLoading(false)
                if (res.status == "Yes") {
                    setmeetingJoin(true);
                    // @ts-ignore
                    setmeetingURL(res.inv_link)
                    // @ts-ignore
                    setEl('ok')
                    // @ts-ignore
                    setCl('ok')
                } else if (res.status == "accountNotRegistered") {
                    setEndedDecisor(false)
                    setmeetingJoin(false)
                    setEl(null)
                    setCl(null)
                } else if (res.status == "Meeting ended.") {
                    setmeetingJoin(false)
                    setEndedDecisor(true)
                } else if (res.status == "WAIT") {
                    setmeetingJoin(false)
                    // @ts-ignore
                    setEl('yes')
                    // @ts-ignore
                    setCl('ok')
                }
            })
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
                (el == null || el == undefined) ? (
                    <>
                    {cl != null ? (
                            <p className='alr'>You are registered for this session!</p>
                        ) : (
                            <>
                                {(loading == true) ? (
                                    <>
                                        <div className='l'>
                                            <CircularProgress className='l' color={'inherit'} />
                                        </div>
                                    </>
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