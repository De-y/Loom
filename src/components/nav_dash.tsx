'use client'

import '@/css/components/dashboard_navbar.css'
import Image from 'next/image'

export default function DashboardNavCli() {
    function ej() {
        let e = document.getElementById('profile-settings')
        // @ts-ignore
        // @ts-ignore
        e?.addEventListener('click', () => document.getElementById('profile-settings')?.close());
        document.getElementById('pr-in')?.addEventListener('click', (event) => event.stopPropagation())
        // @ts-ignore
        e?.showModal()
    }
    return (
        <>
            <dialog id="profile-settings">
                <div id="pr-in">
                    <div className='prop'>
                        <h1>Profile</h1>
                        <div className='options'>
                            <a href='/dashboard'>Dashboard</a>
                            <a href='/tutoring'>Tutoring Central</a>
                            <a href="/spaces">Spaces</a>
                            <a href='/logout'>Logout</a>
                        </div>
                    </div>
                </div>
            </dialog>
            <div className='navbar'>
                <a className='logo' href='/dashboard'>
                    <Image alt="Loom Logo" width={50} height={50} src={'/loom.png'}/>
                    <span className='loom-lg'>Loom.</span>
                </a>
                <div className='userIcn'>
                    <button type='submit' onClick={ej}>
                        <Image className='userIcnA' alt="User" width={50} height={50} src={'/default_profile.svg'} />
                    </button>
                </div>
            </div>
        </>
    )
}