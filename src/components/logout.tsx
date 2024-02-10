'use client';

import '@/css/account/logout.css'
import { deleteCookie } from "cookies-next";
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { CircularProgress } from '@mui/material';

export default function LogoutIt() {   
    try {
        deleteCookie('authorization')
        useEffect(() => {
            redirect('/login')
        })
        return (
            <>
                <div className='loggingout'>
                    <h1>Loom is logging you out.</h1>
                    <br />
                    <div className='loader'>
                        <CircularProgress className='loom-load'/>                    
                    </div>
                </div>
            </>
        )
    } catch (err) {
        console.log(err)
        return (
            deleteCookie('authorization')
        )
    }
}