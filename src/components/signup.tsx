'use client'

import '@/css/signup.css'
import '@/css/login.css'
import { getCookie, setCookie } from 'cookies-next'
import jsSHA from "jssha";

export default function SignupIt() {
    var message = ''
    if (getCookie('authorization') != undefined) {
        console.log("[*] Identity Central has forbidden registration.")
        // @ts-ignore
        window.location = '/dashboard'
    }

    const submit = async function() {
        const username = (document.getElementById('username') as HTMLInputElement)?.value
        const email = (document.getElementById('email') as HTMLInputElement)?.value
        const name = (document.getElementById('full_name') as HTMLInputElement)?.value
        const age = (document.getElementById('age') as HTMLInputElement)?.value
        const password = ((document.getElementById('password')) as HTMLInputElement)?.value
        let password_rei = new jsSHA("SHA3-512", "TEXT", { encoding: "UTF8" }).update(password).getHash('HEX')

        if (password && username) {
            const responseData = await fetch('/api/signup', {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password_rei,
                    age: age,
                    name: name,
                    email: email,
                }),
            })
            const {token, authenticated, message} = await responseData.json()
            if (authenticated != true && token == undefined) {
                // @ts-ignore
                document.getElementById('errsucc').style.display =  'block'
                // @ts-ignore
                document.getElementById('err-message').innerHTML = message;
            } else {
                setCookie('authentication', token, {'secure': true, 'sameSite': 'strict'})
                // @ts-ignore
                window.location = '/application'
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
        <div className='signup'>
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
                    <input className='input' type='text' placeholder='Username' id='username' name="Username" required/>
                    <input className='input' type='email' placeholder='Email' id='email' name="Email" required/>
                    <input className='input' type='text' placeholder='Full Name' id='full_name' name="Name" required/>
                    <input className='input' type='password' placeholder='Password' id='password' name="Password" required/>
                    <input className='input' type='number' placeholder='Age' id='age' name='Age' required/>
                    <button type='submit' className='submit' onClick={submit}>Apply</button>
                    <div className='links-lgl'>
                        <a href="/login">Have an account?</a>
                        <a href="/login">Terms of Service</a>
                    </div>
                </div>
            </div>
        </div>
 
        </>
    )
}