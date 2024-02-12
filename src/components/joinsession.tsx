'use client'
import '@/css/sessions/sessionpage.css'
import { getCookie } from 'cookies-next'
import { useState } from 'react'
export default function JoinSession() {
    const [cl, setCl] = useState(null);
    const [el, setEl] = useState(null);
    function sumit() {
        fetch('/api/sessions/signup', {
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
    fetch('/api/profile', {
        'method': 'POST',
        'body': JSON.stringify({
            'token': getCookie('authorization')
        })
    }).then((ex) => {
        ex.json().then((cl) => {
            fetch('/api/sessions/check_registration', {
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
    return (
        <>
            <br />
            {
                (el != null || el != undefined) ? (
                    <>
                    {cl != null ? (
                            <p className='alr'>You are registered!</p>
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
                    <p className='alr'>You are already registered!</p>
                </>)
            }
            </>
    )
}