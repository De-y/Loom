'use client'

import { deleteCookie, getCookie, hasCookie } from "cookies-next"
import { redirect } from "next/navigation"

export default function ProtectedStore() {
    if (hasCookie("authorization")) {
        console.log(JSON.stringify(getCookie('authorization')))
        fetch('/api/profile', {
            'method': 'POST',
            'body': JSON.stringify({
                // @ts-ignore
                'token': getCookie('authorization')
            })
        }).then((response) => {
            response.json().then((data) => {
                if (data['authenticated'] == true) {
                    if (data['verified'] == true) {
                        console.log("[*] Identity Central. You are verified as a user.")
                    } else {
                        // @ts-ignore
                        return (
                            location.href = '/application'
                        )
                    }
                } else {
                    deleteCookie('authorization')
                    // @ts-ignore
                    return (
                    location.href = '/login'
                    )
                }
            })
        }).catch((err) => {
            console.log("[*] Identity Central has failed to activate.")
        })
    } else {
        // @ts-ignore
        return (
            location.href = '/login'
        )
    }
}