'use client'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/router'

export default function Session() {
    fetch('http://localhost:3000/api/session').then((response) => {
        response.json().then((authentication_status) => {
            if (authentication_status['authenticated'] == false) {
                deleteCookie('authorization')
                // return (
                //     window.location = '/logout'
                // )
            } else {
                console.log("[*] Identity Central: Confirmed Session.")
            }
        })
    })
}