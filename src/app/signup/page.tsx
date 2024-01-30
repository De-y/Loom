import '@/css/signup.css'
import { getImage } from '@/library/etcetera/images'
export default async function login() {
    return (
        <>
        <div className='gt' style={{backgroundImage: `url("/images/${await getImage()}"`}}>
        </div>
        <div className='signup'>
            <div className='atech'>
                <div className='logo'>
                        <a href="/"><img src='/loom.png'draggable="false"/></a>
                        <a href="/"><h1>Loom</h1></a>
                </div>
                <p>Apply for an account.</p>    
                <br />
                <form method='POST'>
                    <input className='input' type='text' placeholder='Username' name="Username" required/>
                    <input className='input' type='email' placeholder='Email' name="Email" required/>
                    <input className='input' type='text' placeholder='Full Name' name="Name" required/>
                    <input className='input' type='password' placeholder='Password' name="Password" required/>
                    <input className='input' type='number' placeholder='Age' name='Age' required/>
                    <button type='submit' className='submit'>Apply</button>
                    <div className='links-lgl'>
                        <a href="/login">Have an account?</a>
                        <a href="/login">Terms of Service</a>
                    </div>
                </form>        
            </div>
        </div>
        </>
    )
}