import DashboardNavbar from '@/components/dashboard_nav'
import LogHours from '@/components/loghouts'
import '@/css/tutoringcentral.css'
import db from '@/db/prisma'
import { createSecretKey } from 'crypto'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function tutoringCentral() {
    const cookieStore = cookies().get('authorization')?.value
    if (cookieStore == undefined) {
        redirect('/logout')
    }
    // @ts-ignore
    let decision = await jwtVerify(cookieStore, createSecretKey(process.env.JWT_Secret, 'utf-8'))
    let accountLookupService = await db.user.findFirst({
        where: {
            // @ts-ignore
            'username': decision?.payload.id
        }
    })
    if (decision == undefined || accountLookupService == undefined) {
        redirect('/logout')
    }
    let isTutor = accountLookupService['tutor']
    let isVerified = accountLookupService['verified']
    if (isVerified == false) {
        redirect('/application')
    }
    let pr = await db.profile.findFirst({
        where: {
            'relatedUsername': accountLookupService.username,
        }
    })
    return (
        <>
            <DashboardNavbar />
            {
                (isTutor == false) ? (
                    <>
                        <div className='tutor'>
                            <h1>Apply to become a tutor</h1>
                            <p>Become a tutor and get volunteering hours!</p>
                            <p>Email <a href='mailto://tutoring@avnce.org'>tutoring@avnce.org</a> to apply.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='tutor'>
                            <div className='tutor-hub'>
                                <h1>My Tutoring Central.</h1>
                                <p>State of the art processing, literally.</p>
                            </div>
                            <br />
                            <div className='cg'>
                                <div className='crd'>
                                    <div className='crd-cntnt'>
                                        <h1>Your Hours:</h1>
                                        <h2>{pr.hoursEarned} hours</h2>
                                        <h3>{pr.minutesEarned} minutes</h3>
                                    </div>
                                </div>
                                <div className='crd'>
                                    <div className='crd-cntnt'>
                                        <h1>Get your hours signed and even get more certifications</h1>
                                        <p>Contact tutoring@avnce.org to go to the next steps.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}