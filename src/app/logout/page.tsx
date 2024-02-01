"use client";

import { deleteCookie } from "cookies-next";
import { redirect } from 'next/navigation'
export default function logOut() {   
    return (
        deleteCookie('authentication'),
        redirect('/login')
    )
}