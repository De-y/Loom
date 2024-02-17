import db from "@/db/prisma"
import * as jwt from 'jose'
import { cookies, headers } from "next/headers"
import { createSecretKey } from "crypto";
import 'dotenv/config';
import { redirect } from "next/navigation";
import '@/css/sessions/sessionpage.css'
import JoinSession from '@/components/joinsession'
import DashboardNavbar from "@/components/dashboard_nav";

export default async function sessionInformation({ params }: { params: { id: string } }) {
    try {
        const cookieStore = cookies().get('authorization')?.value
        if (cookieStore == undefined) {
            redirect('/logout')
        }
        // @ts-ignore
        let decision = await jwt.jwtVerify(cookieStore, createSecretKey(process.env.JWT_Secret, 'utf-8'))
        let accountLookupService = await db.user.findFirst({
            where: {
                // @ts-ignore
                'username': decision?.payload.id
            }
        })
        if (decision == undefined || accountLookupService == undefined) {
            redirect('/logout')
        }
        let isVerified = accountLookupService['verified']
        if (isVerified == false) {
            redirect('/application')
        }
        let sessionData = await db.session.findFirst({where: {
            'id': parseInt(params.id)
        }});
        if ((((sessionData.sessionTime + (sessionData.sessionDuration/60)) * 1000) <= new Date().getTime()) == true) {
            await db.session.update({
                'where': {
                    'id': parseInt(params.id)
                },
                'data': {
                    'ended': true,
                }
            })
        }
        let date = new Date(sessionData.sessionTime * 1000)
        var monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dayOfWeek = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        let month = monthsOfYear[date.getMonth()]
        let day = dayOfWeek[date.getDay()]
        let hour = date.getHours()
        let am_or_pm = (hour < 12) ? "AM" : "PM";
        var adjustedTime = new Date(((sessionData.sessionTime / 60) + sessionData.sessionDuration) * 60 * 1000)
        let adj_a_p = (adjustedTime.getHours() < 12) ? "AM" : "PM";
        let l_hr_min = adjustedTime.getHours()
        //@ts-ignore
        let adj_h_m = (am_or_pm == "PM") ? `${(l_hr_min - 12) % 24}:${String(adjustedTime.getMinutes()).padStart(2, "0")} ${adj_a_p}` : `${(l_hr_min) % 24}:${String(adjustedTime.getMinutes()).padStart(2, "0")} ${adj_a_p}`;
        let h_m = (am_or_pm == "PM") ? `${(hour - 12) % 24}:${String(date.getMinutes()).padStart(2, "0")} ${am_or_pm}` : `${(hour) % 24}:${String(date.getMinutes()).padStart(2, "0")} ${am_or_pm}`;        let x = await db.user.findFirst({'where': {
            'username': sessionData.hostUsername,
        }})
        let sessionRegistered = await db.sessionRegistrations.findFirst({'where': {
            'studentID': accountLookupService['id'],
            'sessionID': parseInt(params.id)
        }})
        let endTime = `${(sessionData.sessionDuration > 60) ? `${sessionData.sessionDuration/60} hours` : `${sessionData.sessionDuration} minutes`} long`
        let host = accountLookupService.username == sessionData.hostUsername
        return (
            <>
                <DashboardNavbar />
                <div className="sessionInformation">
                    <div className="si">
                        <h1>{sessionData.sessionName}</h1>
                        <h2>Hosted by {sessionData.hostFirstName}.</h2>
                        <h3>{endTime}</h3>
                        <h4>On {day}, {month} {date.getDate()}</h4>
                        <h5>From {h_m} till {adj_h_m}</h5>
                        <h6>{sessionData.ended ? "Ended" : "Not Ended"}</h6>
                        {
                            (host == true || accountLookupService.permission >= 3) ? (<>
                                {sessionData.ended ? null : (
                                    <>
                                        <br />
                                        <a className="signup" href={`/sessions/edit/${params.id}`}>Edit Session</a>
                                        <br />
                                    </>
                                )}
                            </>) : null
                        }
                        <JoinSession id={params.id} />
                    </div>
                </div>
            </>
        )
        }
    catch (err) {    
        redirect('/dashboard')
    } 
}