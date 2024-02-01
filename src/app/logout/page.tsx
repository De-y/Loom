"use client";

import '@/css/account/logout.css'
import { deleteCookie } from "cookies-next";
import { redirect } from 'next/navigation';
export default function logOut() {   
    try {
        return (
            deleteCookie('authorization'),
            // @ts-ignore
            window.location = '/login',
            <h1>Logging Out...</h1>
        )
    } catch (err) {
        return (
            deleteCookie('authorization')
        )
    }
}