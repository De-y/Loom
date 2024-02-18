"use client"
import React, { useEffect, useState } from 'react';
// import Image from 'next/image'
import { hasCookie, getCookie, deleteCookie } from 'cookies-next';
import '@/css/dashboard.css';
import { CircularProgress } from '@mui/material';
import DashboardNavbar from './dashboard_nav';
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

const Dash = () => {
    const [profileInformation, setProfileInformation] = useState(null);
    const [spacesInformation, setSpacesInformation] = useState(null);
    const [loading, setLoading] = useState(true);
    let router = useRouter()

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

    function joinCourse() {
        let c = document.getElementById("join_course")
        // @ts-ignore
        c?.addEventListener('click', () => c?.close());
        document.getElementById('j_course_body')?.addEventListener('click', (event) => event.stopPropagation())
        // @ts-ignore
        c.showModal()
    }
    function createCourse() {
        let c = document.getElementById("create_course")
        // @ts-ignore
        c?.addEventListener('click', () => c?.close());
        document.getElementById('x_course_body')?.addEventListener('click', (event) => event.stopPropagation())
        // @ts-ignore
        c.showModal()
    }
    function joinClass() {
        // @ts-ignore
        const j_code = document.getElementById('join_code').value
        fetch('/api/spaces/join', {
            'method': 'POST',
            'body': JSON.stringify({
                'join_code': j_code
            })
        }).then((r) => {
            r.json().then((res) => {
                if (res.status == 'OK') {
                    router.push("/dashboard")
                } else {
                    // @ts-ignore
                    document.getElementById('err').style.display = 'inline';
                }
            })
        })
    }
    function createClass() {
        // @ts-ignore
        const class_name = document.getElementById('class_name').value
        fetch('/api/spaces/create', {
            'method': 'POST',
            'body': JSON.stringify({
                'class_name': class_name,
            })
        }).then((r) => {
            r.json().then((res) => {
                if (res.status == 'OK') {
                    router.push("/dashboard")
                } else {
                    // @ts-ignore
                    document.getElementById('err').style.display = 'inline';
                }
            })
        })
    }

    return (
        <div>
            <dialog id="join_course">
                <div id='j_course_body'>
                    <div id="middle">
                        <h3 id='err'></h3>
                        <h1>Join a course</h1>
                        <form action={joinClass}>
                            <input placeholder='Join Code' id='join_code'/>
                            <button type='submit'>Join</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <dialog id="create_course">
                <div id='x_course_body'>
                    <div id="middle">
                        <h3 id='err'></h3>
                        <h1>Create a class</h1>
                        <form action={createClass}>
                            <input placeholder='Class Name' id='class_name'/>
                            <button type='submit'>Create</button>
                        </form>
                    </div>
                </div>
            </dialog>
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
                            <div className='join-course'>
                                    <a className='j_course' onClick={joinCourse}><FontAwesomeIcon icon={faPlus} /> <span>Join a class</span></a>
                                    {/* @ts-ignore */}
                                    {(profileInformation.teacher == true) ? (
                                    // @ts-ignore
                                   <a className='c_course' onClick={createCourse}><FontAwesomeIcon icon={faPlus} /> <span>Create a class</span></a>
                                    ) : null}
                            </div>
                            <br />
                            <br />
                            <h1>My Classes.</h1>
                            <div className='class-courses'>
                                {
                                    spacesInformation ? (
                                        <>
                                        {Object.keys(spacesInformation).map((spaces) => (
                                            // @ts-ignore
                                            <a key={spaces} href={spacesInformation[spaces].url} className='card'>
                                            <div className='card-content'>
                                                {/* @ts-ignore */}
                                                <h1>{spacesInformation[spaces].name}</h1>
                                            </div>
                                            </a>                                            
                                        ))}
                                        </>
                                    ) : (<>
                                            <a href='/spaces' className='card'>
                                                <div className='card-content'>
                                                    <h1>Classes could not get found.</h1>
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
