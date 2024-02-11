import { cookies, headers } from "next/headers"
import { redirect } from 'next/navigation';
import 'dotenv/config'
import { createSecretKey } from "crypto";
import db from '@/db/prisma'
import * as jwt from 'jose'
import '@/css/admin.css'
import AdminApprove from '@/components/admin'
export default async function admin() {
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
    let tableData = await db.user.findMany({
        where: {
            'verified': false,
        }
    });

    if (accountLookupService != undefined && accountLookupService.permission >= 3) {
        return (
            <>
                <h1>Super secret admin page</h1>
                {tableData.length > 0 ? (<>
                    <table>
                        <tr>
                            <td>Username</td>
                            <td>Name</td>
                            <td>Age</td>
                            <td>Email</td>
                            <td>ID</td>
                        </tr>
                        {Object.keys(tableData).map((i) => (
                            <>
                                <tr key={i}>
                                    <td>{tableData[i].username}</td>
                                    <td>{tableData[i].name}</td>
                                    <td>{tableData[i].age}</td>
                                    <td>{tableData[i].email}</td>
                                    <td>{tableData[i].id}</td>
                                </tr>
                            </>
                        ))}
                    </table>
                <AdminApprove />
                </>) : (<>
                    <h1>No users to approve! Good work team!</h1>
                </>)}
                <h1>Quick Links: </h1>
                <a href="/dashboard">Dashboard</a>
                <br />
                <a href="/logout">Logout</a>
            </>
        )
    } else {
        redirect('/dashboard')
    }
}