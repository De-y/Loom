"use client"
import React, { useEffect, useState } from 'react';
// import Image from 'next/image'
import { hasCookie, getCookie, deleteCookie } from 'cookies-next';
import '@/css/dashboard.css';
import { CircularProgress } from '@mui/material';
import DashboardNavbar from './dashboard_nav';

const Dash = () => {
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
                        if (data.profileInformation.verified) {
                            console.log("[*] Identity Central. You are verified as a user.");
                            setProfileInformation(data.profileInformation);
                        } else {
                            // @ts-ignore
                            window.location = '/application';
                        }
                    } else {
                        deleteCookie('authorization');
                        // @ts-ignore
                        window.location = '/login';
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
    return (
        <div>
            {loading ? (
                <div className="loading-screen">
                    <h2>Loom.</h2>
                    <div className='loader'>
                        <CircularProgress className='loom-load'/>                    
                    </div>
                </div>
            ) : profileInformation ? (
                <>
                    <DashboardNavbar />
                    <div>
                        <div className='profile'>
                            {/* <Image src={'/default_profile.svg'} alt="default_profile_image" width={100} height={100} className='image'/> */}
                            {/* @ts-ignore */}
                            <h1>Hello, {profileInformation.full_name.split(" ")[0]}!</h1>
                            {profileInformation.is_tutor ? <h2>What would you like to tutor or learn today?</h2>: <h2>What would you like to get tutored on today?</h2>}
                        </div>
                        <div className='classes-to-learn'>
                            <h1>Get learning.</h1>
                            <div className='class-courses'>
                                <div className='card'>
                                    <h2>HJ</h2>
                                </div>
                            </div>
                        </div>

                        {/* @ts-ignore */}
                    </div>
                </>
            ) : (
                <h1>You are offline.</h1>
            )}
        </div>
    );
};

export default Dash;
