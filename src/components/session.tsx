'use client'

import { deleteCookie } from 'cookies-next'
import { fetch } from "popsicle";

export default function Session() {
    const sessionDecider = function () {
        let e = fetch(`${window.location.origin}/api/session`)
    }
    return (
        <>
        <script>
            {sessionDecider()}
        </script>
        </>
    )
}