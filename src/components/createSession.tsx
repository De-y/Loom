"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import '@/css/sessions/sessions.css'

export default function UseSession() {
    function dialogue() {
        console.log("FHN")
        let e = document.getElementById('dialog')
        // @ts-ignore
        e?.addEventListener('click', () => e?.close());
        document.getElementById('createSession')?.addEventListener('click', (event) => event.stopPropagation())
        // @ts-ignore
        e?.showModal()
    }
    function submitSession() {

    }
    return (
        <>
                <dialog id='dialog'>
                    <div className='createSessionContent' id='createSession'>
                        <form action={submitSession}>
                            <h1 className='confirm'>Create a session</h1>
                            <label htmlFor="session_n">Session Name: </label>
                            <input type='text' placeholder='Session Name' id="session_n" required/>
                            <label htmlFor="session_t">Session Time Starts (Local Time):</label>
                            <input type='time' placeholder='Session Time' id="session_t" required/>
                            <label htmlFor="session_date">Session Date:</label>
                            <input type='date' min={new Date().toISOString().split('T')[0]}  placeholder='Session Date' id="session_date" required/>
                            <label htmlFor="session_d">Session Duration (Minutes):</label>
                            <select id='session_d' required>
                                <option value="volvo">15</option>
                                <option value="saab">30</option>
                                <option value="fiat">60</option>
                                <option value="audi">120</option>
                                <option value="audi">180</option>
                            </select>
                            <label htmlFor="max-users">Maximum Users:</label>
                            <select id='max-users' required>
                                <option value="volvo">5</option>
                                <option value="saab">10</option>
                                <option value="fiat">20</option>
                                <option value="audi">50</option>
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