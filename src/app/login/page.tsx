import '@/css/login.css'
import { getImage } from '@/library/etcetera/images'
export default async function login() {
    return (
        <>
        <div className='gt' style={{backgroundImage: `url("/images/${await getImage()}"`}}>
        </div>
        <div className='login'>
            <div className='logo'>
                    <a href="/"><img src='/loom.png'draggable="false"/></a>
                    <a href="/"><h1>Loom</h1></a>
            </div>
            
        </div>
        </>
    )
}