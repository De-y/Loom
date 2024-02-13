import db from "@/db/prisma"
import * as jwt from 'jose'
import { cookies, headers } from "next/headers"
import { createSecretKey } from "crypto";
import 'dotenv/config';
import { redirect } from "next/navigation";
import '@/css/sessions/sessionpage.css'
import JoinSession from '@/components/joinsession'

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
        if (am_or_pm == 'PM') {
            hour = hour - 12;
            l_hr_min = l_hr_min - 12;
        }
        let adj_h_m = `${l_hr_min}:${adjustedTime.getMinutes()} ${adj_a_p}`
        let h_m = `${hour}:${date.getMinutes()} ${am_or_pm}`
        let x = await db.user.findFirst({'where': {
            'username': sessionData.hostUsername,
        }})
        let sessionRegistered = await db.sessionRegistrations.findFirst({'where': {
            'studentID': accountLookupService['id'],
            'sessionID': parseInt(params.id)
        }})
        let host = accountLookupService.username == sessionData.hostUsername
        return (
            <>
                <div className="sessionInformation">
                    <div className="si">
                        <h1>{sessionData.sessionName}</h1>
                        <h2>Hosted by {sessionData.hostFirstName}.</h2>
                        <h3>{sessionData.sessionDuration} minutes long</h3>
                        <h4>On {day}, {month} {date.getDate()}</h4>
                        <h5>From {h_m} till {adj_h_m}</h5>
                        <h6>{sessionData.ended ? "Ended" : "Not Ended"}</h6>
                        {
                            (host == true || accountLookupService.permission >= 3) ? (<><h1>Yes</h1></>) : null
                        }
                        <JoinSession id={params.id} url={`http://${headers().get("referer")?.split('/')[2]}`}/>
                    </div>
                </div>
            </>
        )
        }
    catch (err) {    
        redirect('/dashboard')
    } 
}