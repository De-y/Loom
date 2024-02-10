"use client";

import '@/css/account/logout.css'
import { deleteCookie } from "cookies-next";
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
export default function logOut() {   
    try {
        return (
            deleteCookie('authorization'),
            // @ts-ignore
            useEffect(() => {
                redirect('/login')
            }),
            <h1>Logging Out...</h1>
        )
    } catch (err) {
        return (
            deleteCookie('authorization')
        )
    }
}