'use client'
import '@/css/spaces.css'
import { useEffect, useState } from 'react'

export default function SpacesInformation() {
    const [spaces, setSpaces] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async () => {
            let l = await fetch('/api/spaces')
            l = await l.json()
            // @ts-ignore
            setSpaces(l)
        }
    })
    return (
        <>
            <div className='space'>
                {spaces}
            </div>        
            <div className='space'>
                Client
            </div>        
            <div className='space'>
                Client
            </div>        
            <div className='space'>
                Client
            </div>        

        </>
    )
}