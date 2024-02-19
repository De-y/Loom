'use client'

import '@/css/login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { getCookie, setCookie } from 'cookies-next'
import jsSHA from "jssha";
import React, { useState } from 'react';

export default function LoginIt() {
    var message = ''
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    if (getCookie('authorization') != undefined) {
        console.log("[*] Identity Central has forbidden login.")
        // @ts-ignore
        window.location = '/dashboard'
    }
    const submit = async function() {
        const username = (document.getElementById('username') as HTMLInputElement)?.value
        const passwordValue = password;
        if (passwordValue && username) {
            const passwordHash = new jsSHA("SHA3-512", "TEXT", { encoding: "UTF8" }).update(passwordValue).getHash('HEX');
            const responseData = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: passwordHash
                }),
            })
            const {token, authenticated} = await responseData.json()
            if (authenticated != true && token == undefined) {
                // @ts-ignore
                document.getElementById('errsucc').style.display =  'block'
                // @ts-ignore
                document.getElementById('err-message').innerHTML = "Incorrect username or password."                    
            } else {
                let expiry_date = new Date()
                expiry_date.setFullYear(expiry_date.getFullYear() + 1)
                setCookie('authorization', token, {'secure': true, 'sameSite': 'strict', 'expires': expiry_date})
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
                    <input className='input' type={showPassword ? 'text' : 'password'} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} id='show_password'  onClick={togglePasswordVisibility}/>
                    <button  onClick={submit} className='submit'>Login</button>
                    <a href="/signup">Don&apos;t have an account?</a>
                </div>
            </div>
        </div>
 
        </>
    )
}