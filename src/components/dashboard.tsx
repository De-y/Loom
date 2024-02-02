'use client';

import ProtectedStore from '@/components/protectedStore';
import '@/css/dashboard.css'
import { getCookie } from 'cookies-next';

export default function Dash() {
    if (getCookie('authorization') == undefined) {
        return (
            // @ts-ignore
            window.location = '/login'
        )
    }
    ProtectedStore()
    return (
        <>
            <a href='/logout'>Logout </a>
        </>
    )
}