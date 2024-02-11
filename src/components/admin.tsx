"use client"

import { getCookie } from "cookies-next"
import { useRouter } from "next/navigation"

export default function AdminApprove() {
    let e = useRouter()
    function userCONFIRM() {
        let userID = document.getElementById('UserID')
        // @ts-ignore
        userID = userID?.value
        fetch('/api/admin/approve', {
            'method': 'POST',
            'body': JSON.stringify({
                'token': getCookie('authorization'),
                'confirm': {
                    'all': false,
                    'UID': userID,
                }
            })
        }).then((id) => {
            id.json().then((ok) => {
                if (ok.status == 'ok') {
                    e.push('/admin')
                } else {
                    e.push('/admin')
                }
            })
        })
    }
    function userALL() {
        fetch('/api/admin/approve', {
            'method': 'POST',
            'body': JSON.stringify({
                'token': getCookie('authorization'),
                'confirm': {
                    'all': true,
                }
            })
        }).then((id) => {
            id.json().then((ok) => {
                if (ok.status == 'ok') {
                    e.push('/admin')
                } else {
                    e.push('/admin')
                }
            })
        })
    }

    return (
        <>
                <form action={userCONFIRM}>
                    <h1>Approve a specific user:</h1> <br />
                    <input type="text" placeholder="User ID" id="UserID"/>
                    <button type="submit" id="submit">Submit</button>
                </form>
                <form action={userALL}>
                    <h1>Approve All</h1>
                    <button type="submit" id="submit">Submit</button>
                </form>
        </>
    )
}