"use client"
import { useEffect, useState } from 'react';
import '@/css/spaces.css';

export default function SpacesInformation() {
    const [spaces, setSpaces] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const response = await fetch('/api/spaces');
                const data = await response.json();
                setSpaces(data['availableSpaces']);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching spaces:', error);
                setLoading(false);
            }
        };

        fetchSpaces();
    }, []);

    return (
        <>
            {loading ? (
                <h1>Loading</h1>
            ) : (
                <>
                    {spaces && Object.keys(spaces).map((sp) => (
                        <a key={sp} href={spaces[sp].url} className='space'>
                            <div className='la'>
                                {spaces[sp].name}
                            </div>
                        </a>
                    ))}
                </>
            )}
        </>
    );
}
