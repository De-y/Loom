import '@/css/components/dashboard_navbar.css'
import Image from 'next/image'

export default function DashboardNavbar() {
    return (
        <>
            <div className='navbar'>
                <div className='logo'>
                    <a href="/"><Image alt="Loom Logo" width={50} height={50} src={'/loom.png'}/></a>
                    <a href='/' className='loom-lg'>Loom.</a>
                </div>
                <a href="/logout">Logout</a>
            </div>
        </>
    )
}