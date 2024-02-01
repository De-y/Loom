'use client'

import { deleteCookie, getCookie, hasCookie } from 'cookies-next';

export default function Session() {
    if (hasCookie('authorization')) {
        let tokenX = getCookie('authorization')
        fetch(`/api/session`,
        {
            'method': 'POST',
            'body': JSON.stringify({
                'token': tokenX
            })
        }).then((response) => {
            response.json().then((authentication_status) => {
                if (authentication_status['authenticated'] == false) {
                    // deleteCookie('authorization')
                    return (
                        // @ts-ignore
                        // window.location = '/login'
                        <></>
                    )
                } else {
                    console.log("[*] Identity Central: Confirmed Session.")
                }
            })
        }).catch((err) => {        
        })
    } else {
        
    }
}