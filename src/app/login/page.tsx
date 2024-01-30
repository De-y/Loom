import '@/css/login.css'
import { getImage } from '@/library/etcetera/images'
import LoginIt from '@/components/login'
export default async function login() {
    return (
        <>
        <div className='gt' style={{backgroundImage: `url("/images/${await getImage()}"`}}>
        </div>
        <LoginIt/>
       </>
    )
}