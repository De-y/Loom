'use client';

import '@/css/dashboard.css'
import Session from '@/components/session'
export default async function Dashboard() {
    Session()
    return (
        <>
            <a href='/logout'>Logout </a>
        </>
    )
}