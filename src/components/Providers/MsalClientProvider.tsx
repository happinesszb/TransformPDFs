'use client'

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/config/authConfig";
import { ReactNode, useEffect, useState } from "react";

export default function MsalClientProvider({ children }: { children: ReactNode }) {
    const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

    useEffect(() => {
        const msalInstance = new PublicClientApplication(msalConfig);
        msalInstance.initialize().then(() => {
            setMsalInstance(msalInstance);
        });
    }, []);

    if (!msalInstance) {
        return null; // 
    }

    return (
        <MsalProvider instance={msalInstance}>
            {children}
        </MsalProvider>
    );
} 