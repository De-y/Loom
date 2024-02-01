'use client'
import { deleteCookie } from 'cookies-next'

export default function Session() {
    fetch(`/api/session`).then((response) => {
        response.json().then((authentication_status) => {
            if (authentication_status['authenticated'] == false) {
                deleteCookie('authorization')
                return (
                    // @ts-ignore
                    window.location = '/login'
                )
            } else {
                console.log("[*] Identity Central: Confirmed Session.")
            }
        })
    }).catch((err) => {        
    })
}