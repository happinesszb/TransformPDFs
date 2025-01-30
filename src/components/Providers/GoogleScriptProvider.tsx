'use client'

import Script from 'next/script'

export default function GoogleScriptProvider() {
    return (
        <Script 
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
            onLoad={() => {
                console.log('Google Identity Services loaded');
            }}
            onError={(e) => {
                console.log('Error loading Google Identity Services:', e);
            }}
        />
    )
} 