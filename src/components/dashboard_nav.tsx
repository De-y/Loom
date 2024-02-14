import '@/css/components/dashboard_navbar.css'
import Image from 'next/image'
import DashboardNavCli from './nav_dash'
import { useState } from 'react'
import db from '@/db/prisma'
import { getCookie } from 'cookies-next'

export default function DashboardNavbar() {
    return (
        <>
            <DashboardNavCli/>
        </>
    )
}