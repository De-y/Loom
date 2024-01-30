'use client'

import '@/css/login.css'
import { setCookie } from 'cookies-next'
export default function LoginIt() {
    var message = ''
    const submit = async function() {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
        if (password && username) {
            const responseData = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            })
            const {token, authenticated} = await responseData.json()
            if (authenticated != true && token == undefined) {
                document.getElementById('errsucc').style.display =  'block'
                document.getElementById('err-message').innerHTML = "Incorrect username or password."                    
            } else {
                setCookie('authentication', token, {'secure': true, 'sameSite': 'strict'})
            }
        } else {
            document.getElementById('errsucc').style.display =  'block'
            document.getElementById('err-message').innerHTML = "No Username or Password Provided."
        }
    }
    return (
        <>
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
                    <a href="/signup">Don't have an account?</a>
                </div>
            </div>
        </div>
 
        </>
    )
}