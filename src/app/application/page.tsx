import Apply from '@/components/application'
import '@/css/components/application.css'

export default function Application() {
    return (
        <>
            <Apply />
            <div className='confirmation'>
                <h1>Thank you for applying!</h1>
                <p>Your application has been sent to our staff team. Expect an email from the team for a status update or if we may need some additional information.</p>
                <br />
                <a>Loom</a>
            </div>
        </>
    )
}