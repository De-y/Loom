'use client';

import ProtectedStore from '@/components/protectedStore';
import '@/css/dashboard.css'
export default function Dashboard() {
    ProtectedStore()
    return (
        <>
            <a href='/logout'>Logout </a>
        </>
    )
}