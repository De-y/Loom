'use client'
import '@/css/sessions/sessionpage.css'
import { getCookie } from 'cookies-next'
export default function JoinSession() {
    function sumit() {
        fetch('/api/sessions/signup', {
            'method': 'POST',
            'body': JSON.stringify({
                'token': getCookie('authorization'),
            })
        })
    }
    return (
        <>
            <br />
            <form action={sumit}>
                <button className='signup' type='submit'>
                    Signup
                </button>
            </form>
        </>
    )
}