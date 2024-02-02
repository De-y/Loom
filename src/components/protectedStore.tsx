'use client'

import { deleteCookie, getCookie, hasCookie } from "cookies-next"
import redirect from 'nextjs-redirect'

export default function ProtectedStore() {
    if (hasCookie("authorization")) {
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
                        return (
                            // @ts-ignore
                            window.location = '/login'
                        )    
                    }
                } else {
                    deleteCookie('authorization')
                    return (
                        // @ts-ignore
                        window.location = '/login'
                    )
                }
            })
        }).catch((err) => {
            console.log("[*] Identity Central has failed to activate.")
        })
    } else {
        console.log("You do not have an account.")
    }
}