import '@/css/signup.css'
import { getImage } from '@/library/etcetera/images'
import SignupIt from '@/components/signup'

export default async function login() {
    return (
        <>
        <div className='gt' style={{backgroundImage: `url("/images/${await getImage()}"`}}>
        </div>
        <SignupIt />
        </>
    )
}