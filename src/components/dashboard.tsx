"use client"
import React, { useEffect, useState } from 'react';
// import Image from 'next/image'
import { hasCookie, getCookie, deleteCookie } from 'cookies-next';
import '@/css/dashboard.css';
import { CircularProgress } from '@mui/material';
import DashboardNavbar from './dashboard_nav';
import Router from 'next/router';

const Dash = () => {
    const [profileInformation, setProfileInformation] = useState(null);
    const [spacesInformation, setSpacesInformation] = useState(null);
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
                            Router.push('/application')
                        }
                    } else {
                        deleteCookie('authorization');
                        // @ts-ignore
                        Router.push('/login')
                    }
                } catch (error) {
                    console.log("[*] Identity Central is activating.");
                } finally {
                    console.log("Continuing with PLI")
                    try {
                        const spacesInfo = await fetch("/api/spaces")
                        const spacesData = await spacesInfo.json()
                        setSpacesInformation(spacesData.availableSpaces)
                    } finally {
                        setLoading(false)
                    }
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
                            {/* @ts-ignore */}
                            {profileInformation.is_tutor ? <h2>What would you like to tutor or learn today?</h2>: <h2>What would you like to get tutored on today?</h2>}
                        </div>
                        <div className='classes-to-learn'>
                            {/* @ts-ignore */}
                            <h1>Spaces.</h1>
                            <div className='class-courses'>
                                {
                                    spacesInformation ? (
                                        <>
                                        {Object.keys(spacesInformation).map((spaces) => (
                                            <a key={spaces} href={spacesInformation[spaces].url} className='card'>
                                            <div className='card-content'>
                                                <h1>{spacesInformation[spaces].name}</h1>
                                            </div>
                                            </a>                                            
                                        ))}
                                        </>
                                    ) : (<>
                                            <a href='/spaces' className='card'>
                                                <div className='card-content'>
                                                    <h1>Spaces could not get found.</h1>
                                                </div>
                                            </a>
                                        </>)
                                }
                                {/* <a className='card' href="/space/">
                                    <div className='card-content'>
                                        <h1>English</h1>
                                    </div>
                                </a> */}
                            </div>
                        </div>

                        {/* @ts-ignore */}
                    </div>
                </>
            ) : (
                <div className="loading-screen">
                    <h2>Loom.</h2>
                    <div className='loader-text'>
                        <h1>Redirecting you.</h1>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dash;
