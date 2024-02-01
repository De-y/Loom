'use client'

import '@/css/login.css'
import { getCookie, setCookie } from 'cookies-next'
import webcrypto from '@acusti/webcrypto';

export default function LoginIt() {
    var message = ''
    if (getCookie('authorization') != undefined) {
        console.log("[*] Identity Central has forbidden login.")
        // @ts-ignore
        window.location = '/dashboard'
    }
    const submit = async function() {
        const username = (document.getElementById('username') as HTMLInputElement)?.value
        let password = (document.getElementById('password') as HTMLInputElement)?.value
        const password_rei = await webcrypto.subtle.digest({ name: 'SHA-512' }, new TextEncoder().encode(password));
        if (password && username) {
            const responseData = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password_rei
                }),
            })
            const {token, authenticated} = await responseData.json()
            if (authenticated != true && token == undefined) {
                // @ts-ignore
                document.getElementById('errsucc').style.display =  'block'
                // @ts-ignore
                document.getElementById('err-message').innerHTML = "Incorrect username or password."                    
            } else {
                setCookie('authorization', token, {'secure': true, 'sameSite': 'strict'})
                // @ts-ignore
                window.location = '/dashboard'
            }
        } else {
            // @ts-ignore
            document.getElementById('errsucc').style.display =  'block'
            // @ts-ignore
            document.getElementById('err-message').innerHTML = "No Username or Password Provided."
        }
    }
    return (
        <>
        {/* <script>
            let f = await fetch('/api/session')
            let decision = await f.json()
            if (decision == true) {
                redirect('/dashboard')
            }
        </script> */} 
        <div className='login'>
            <div className='atech'>
                <div className='logo'>
                        <a href="/"><img src='/loom.png'draggable="false"/></a>
                        <a href="/"><h1>Loom</h1></a>
                </div>
                <p>Welcome back! Log in with your account.</p>    
                <br />
                <div className='errsucc' id='errsucc'>
                    <div className='error_success'>
                        <p id='err-message'>{message}e</p>
                    </div>
                    <br />
                </div>
                <div className='form'>
                    <input className='input' type='text' placeholder='Username' name="Username" id="username"/>
                    <input className='input' type='password' placeholder='Password' name="Password" id="password"/>
                    <button  onClick={submit} className='submit'>Login</button>
                    <a href="/signup">Don&apos;t have an account?</a>
                </div>
            </div>
        </div>
 
        </>
    )
}