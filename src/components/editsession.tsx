'use client'

import { getCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function EditSession({ id }: { id: any }) {
    const router = useRouter();
    const [information, setInformation] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/sessions/find_session', {
            method: 'POST',
            body: JSON.stringify({ id: id }),
        }).then((response) => {
            response.json().then((res) => {
                const hours = new Date(res.sessionTime * 1000).getHours();
                const minutes = new Date(res.sessionTime * 1000).getMinutes();
                const sessionDate = new Date(res.sessionTime * 1000).toLocaleDateString().split('T')[0];
                const sessionTime = `${hours}:${minutes}`;
                const updatedInformation = {
                    maxUsers: res.maxUsers,
                    sessionDuration: res.sessionDuration,
                    sessionName: res.sessionName,
                    sessionDate: sessionDate,
                    sessionTime: sessionTime
                };
                setInformation(updatedInformation);
                setLoading(false);
            });
        });
    }, [id]);

    function del() {
        fetch('/api/sessions/delete_session', {
            method: 'DELETE',
            body: JSON.stringify({
                delete_id: id,
                token: getCookie('authorization')
            }),
        }).then((res) => {
            res.json().then((res) => {
                if (res.status === 'OK') {
                    console.log("[*] Session Deleted");
                    router.push('/dashboard');
                }
            });
        });
    }

    function submitSession(event: React.FormEvent) {
        event.preventDefault();
        const sessionName = (document.getElementById('session_n') as HTMLInputElement).value;
        const sessionTime = (document.getElementById('session_t') as HTMLInputElement).value;
        const sessionDate = (document.getElementById('session_date') as HTMLInputElement).value;
        const sessionDuration = (document.getElementById('session_d') as HTMLSelectElement).value;
        const maxUsers = (document.getElementById('max-users') as HTMLSelectElement).value;

        fetch('/api/sessions/edit_session', {
            method: 'POST',
            body: JSON.stringify({
                sessionInformation: {
                    name: sessionName,
                    // @ts-ignore
                    destinedTime: new Date(`${session_date} ${sessionTime}`).getTime() / 1000,
                    duration: sessionDuration,
                    max_users: maxUsers
                },
                handoff: {
                    token: getCookie('authorization'),
                    path: id
                }
            }),
        }).then((response) => {
            response.json().then((responseInformation) => {
                if (responseInformation.status === 'OK') {
                    console.log("Attempting to refresh");
                    router.push(`/sessions/${id.id}`);
                } else {
                    const error = document.getElementById('error');
                    // @ts-ignore
                    error.style.display = 'inline';
                    // @ts-ignore
                    error.innerHTML = responseInformation.status;
                }
            });
        });
    }

    function delConfirm() {
        const confirmDialog = document.getElementById('confirm') as HTMLDialogElement;
        confirmDialog.showModal();
    }

    let oy = new Date().toLocaleDateString().split('T')[0].split('/')

    return (
        <>
            <dialog id="confirm">
                <div id="st">
                    <h1>You sure?</h1>
                    <p>Deleting the session will delete it from the session view, with it not being also added to your tutoring history <strong>forever.</strong></p>
                    <br />
                    <a href="#" onClick={del} id="s">
                        I confirm, delete this session.
                    </a>
                </div>
            </dialog>
                {!loading ? (
                    <>
                        <form onSubmit={submitSession}>
                        <h1 className='error' id='error'></h1>
                        <label htmlFor="session_n">Session Name: </label>
                        <input type='text' defaultValue={information?.sessionName} placeholder='Session Name' id="session_n" required />
                        <label htmlFor="session_t">Session Time Starts (Local Time):</label>
                        <input type='time' placeholder='Session Time' defaultValue={information?.sessionTime} id="session_t" required />
                        <label htmlFor="session_date">Session Date:</label>
                        <input type='date' defaultValue={information?.sessionDate} min={new Date().toLocaleDateString().split('T')[0]} max={`${oy[0]}/${oy[1]}/${(parseInt(oy[2]) + 1).toString()}`} placeholder='Session Date' id="session_date" required />
                        <label htmlFor="session_d">Session Duration (Minutes):</label>
                        <select id='session_d' defaultValue={information?.sessionDuration} required>
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="60">60</option>
                            <option value="120">120</option>
                            <option value="180">180</option>
                        </select>
                        <div className="fik">
                            <label htmlFor="max-users">Maximum Users:</label>
                            <select id='max-users' defaultValue={information?.maxUsers} required>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                            <button type='submit' className="button">Update Session Information</button>
                        </div>
                        </form>
                    </>
                ) : (
                        <>
                            <h1>Loading...</h1>
                        </>
                    )}
            <br />
            <button id="s" onClick={delConfirm}>Delete</button>
        </>
    );
}
