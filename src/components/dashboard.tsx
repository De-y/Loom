"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import { hasCookie, getCookie, deleteCookie } from 'cookies-next';
import '@/css/dashboard.css';

const Dash = () => {
    const [profileInformation, setProfileInformation] = useState(null);
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
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {profileInformation ? (
                <div>
                    <div className='profile'>
                        <Image src={'/default_profile.svg'} alt="default_profile_image" width={200} height={200} className='image'/>
                        {/* @ts-ignore */}
                        <h1>{profileInformation.full_name}</h1>
                    </div>
                    {/* @ts-ignore */}
                </div>
            ) : null}
        </div>
    );
};

export default Dash;
