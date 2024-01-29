import '@/css/components/navbar.css'
export default function Navbar() {
    return (
        <div className='navbar'>
            <div  className='logo'>
                <a href="/"><img src='/loom.png'draggable="false"/></a>
                <a href="/"><h1>Loom</h1></a>
            </div>
        </div>
    )
}