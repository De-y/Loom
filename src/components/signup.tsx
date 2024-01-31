'use client'

import '@/css/signup.css'
import '@/css/login.css'
import { setCookie } from 'cookies-next'
import { sha512 } from 'crypto-hash'
export default function SignupIt() {
    var message = ''
    const submit = async function() {
        const username = document.getElementById('username').value
        const email = document.getElementById('email').value
        const name = document.getElementById('full_name').value
        const age = document.getElementById('age').value
        const password = await sha512(document.getElementById('password').value)
        if (password && username) {
            const responseData = await fetch('/api/signup', {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password,
                    age: age,
                    name: name,
                    email: email,
                }),
            })
            const {token, authenticated, message} = await responseData.json()
            if (authenticated != true && token == undefined) {
                document.getElementById('errsucc').style.display =  'block'
                document.getElementById('err-message').innerHTML = message;
            } else {
                setCookie('authentication', token, {'secure': true, 'sameSite': 'strict'})
                window.location = '/application'
            }

        } else {
            document.getElementById('errsucc').style.display =  'block'
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