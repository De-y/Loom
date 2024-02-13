import '@/css/sessions/edit.css'
import db from "@/db/prisma"
import Image from 'next/image'
export default async function editSessionInformation({ params }: { params: { id: string } }) {
    return (
        <>
            <div className='navbar'>
                <a className='logo' href="/dashboard">
                    <Image width={50} height={50} alt='Loom Logo' src={'/loom.png'} />
                    <span>Loom</span>
                </a>
            </div>
            <h1></h1>
        </>
    )
};