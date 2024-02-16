"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import '@/css/sessions/sessions.css'
import { usePathname, useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next';

export default function UseSession() {
    let n = usePathname()
    let router = useRouter()
    function dialogue() {
        let e = document.getElementById('dialog')
        // @ts-ignore
        e?.addEventListener('click', () => e?.close());
        document.getElementById('createSession')?.addEventListener('click', (event) => event.stopPropagation())
        // @ts-ignore
        e?.showModal()
    }
    function submitSession() {
        // @ts-ignore
        let information = [document.getElementById('session_n')?.value, document.getElementById('session_t')?.value, document.getElementById('session_date')?.value, document.getElementById('session_d')?.value, document.getElementById('max-users')?.value]
        let [session_name, session_time, session_date, session_duration, max_users] = information
        let session_invite = document.getElementById('session_i')

        fetch('/api/sessions/create_session', {
            'method': 'POST',
            'body': JSON.stringify({
                'sessionInformation': {
                    'name': session_name,
                    'destinedTime': new Date(`${session_date} ${session_time}`).getTime() / 1000,
                    'duration': session_duration,
                    'max_users': max_users,
                    // @ts-ignore
                },
                'handoff': {
                    'token': getCookie('authorization'),
                    'path': n
                }
            })
        }).then((json_info) => {
            json_info.json().then((responseInformation) => {
                if (responseInformation.status == 'OK') {
                    console.log("Attempting to refresh")
                    router.push(responseInformation.sessionPage)
                } else {
                    let error = document.getElementById('error')
                    // @ts-ignore
                    error.style.display = 'inline';
                    // @ts-ignore
                    error.innerHTML = responseInformation.status;
                }
            })
        })
    }
    let oy = new Date().toLocaleDateString().split('T')[0].split('/')
    return (
        <>
                <dialog id='dialog'>
                    <div className='createSessionContent' id='createSession'>
                        <form action={submitSession}>
                            <h1 className='error' id='error'>
                            </h1>
                            <h1 className='confirm'>Create a session</h1>
                            <label htmlFor="session_n">Session Name: </label>
                            <input type='text' placeholder='Session Name' id="session_n" required/>
                            <label htmlFor="session_t">Session Time Starts (Local Time):</label>
                            <input type='time' placeholder='Session Time' id="session_t" required/>
                            <label htmlFor="session_date">Session Date:</label>
                            <input type='date' min={new Date().toLocaleDateString().split('T')[0]} max={`${oy[0]}/${oy[1]}/${(parseInt(oy[2]) + 1).toString()}`}  placeholder='Session Date' id="session_date" required/>
                            <label htmlFor="session_d">Session Duration (Minutes):</label>
                            <select id='session_d' required>
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="60">60</option>
                                <option value="120">120</option>
                                <option value="180">180</option>
                            </select>
                            <label htmlFor="max-users">Maximum Users:</label>
                            <select id='max-users' required>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                            <button type='submit'>Submit</button>
                        </form>
                    </div>
                </dialog>
                        <div className='tutor-btn'>
                            <button onClick={dialogue}><FontAwesomeIcon icon={faPlus} /> Create a New Session</button>
                        </div>
        </>
    )
}