'use client'
import React, { useEffect, useState } from 'react';
import Session from "@/components/session"
import { hasCookie, getCookie, deleteCookie } from "cookies-next"
import { CircularProgress } from '@mui/material';
import '@/css/dashboard.css';
import Router from 'next/router';

export default function Apply() {
    const [profileInformation, setProfileInformation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (hasCookie("authorization")) {
                try {
                    const response = await fetch('/api/profile', {
                        method: 'POST',
                        body: JSON.stringify({
                            token: getCookie('authorization')
                        }),
                    });

                    const data = await response.json();

                    if (data.authenticated) {
                        if (data.profileInformation.verified == false) {
                            console.log("[*] Identity Central. Your application is processing.");
                            setProfileInformation(data.profileInformation);
                        } else {
                            // @ts-ignore
                            Router.push('/dashboard')
                        }
                    } else {
                        deleteCookie('authorization');
                        // @ts-ignore
                        Router.push('/login')
                    }
                } catch (error) {
                    console.log("[*] Identity Central is activating.");
                } finally {
                    setLoading(false)
                }
            }
        };

        fetchData();
    }, []);
    return(        <div>
        {loading ? (
            <div className="loading-screen">
                <h2>Loom.</h2>
                <div className='loader'>
                    <CircularProgress className='loom-load'/>                    
                </div>
            </div>
        ) : profileInformation ? (
            <>
            <div className='confirmation'>
                <h1>Thank you for applying!</h1>
                <p>Your application has been sent to our staff team. Expect an email from the team for a status update or if we may need some additional information.</p>
                <br />
                <a>Loom</a>
            </div>

            </>
        ) : (
            <div className="loading-screen">
                <h2>Loom.</h2>
                <div className='loader-text'>
                    <h1 >Redirecting you.</h1>
                </div>
            </div>
        )}
    </div>
);

}
