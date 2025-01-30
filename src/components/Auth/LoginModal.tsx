'use client';
import { useEffect, useState, useRef } from 'react';
import { useLocale } from '@/hooks/useLocale';
import Image from 'next/image';
import { PublicClientApplication, AuthenticationResult } from "@azure/msal-browser";
import { msalConfig, loginRequest } from '@/config/authConfig';
import { useMsal } from "@azure/msal-react";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    renderButton: (element: HTMLElement, config: any) => void;
                }
            }
        }
    }
}

interface SubscriptionResponse {
    message: string;
    subscription: {
        type: string;
        expiryDate?: string;
    };
}

/**
 * LoginModal component renders a modal for user authentication using Google and Microsoft sign-in options.
 * It manages the loading state of the Google client, initializes the Google Sign-In button,
 * and handles sign-in success for both providers by storing user information and sending it to the backend.
 * The component uses React hooks such as useState, useEffect, and useRef for state management and side effects.
 * It also utilizes the MSAL library for Microsoft authentication and environment variables for configuration.
 * 
 * Props:
 * - isOpen: boolean indicating whether the modal is open or not.
 * - onClose: function to close the modal.
 * 
 * @returns {JSX.Element} The rendered LoginModal component.
 */
export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { t } = useLocale();
    const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
    const { instance } = useMsal();
    const googleButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        console.log('Checking for Google client...');
        const checkGoogleLoaded = setInterval(() => {
            if (window.google?.accounts) {
                console.log('Google client found!');
                setIsGoogleLoaded(true);
                clearInterval(checkGoogleLoaded);
            }
        }, 100);

        return () => clearInterval(checkGoogleLoaded);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !isGoogleLoaded || !googleButtonRef.current) return;

        console.log('Initializing Google Sign-In...');
        
        try {
            window.google?.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: handleGoogleSignIn,
                auto_select: false,
                cancel_on_tap_outside: true,
                itp_support: true,
            });

            window.google?.accounts.id.renderButton(
                googleButtonRef.current,
                {
                    type: 'standard',
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    shape: 'rectangular',
                    width: 320,
                    use_fedcm_for_prompt: true
                }
            );
            console.log('Google Sign-In initialized successfully');
        } catch (error) {
            console.log('Error initializing Google Sign-In:', error);
        }
    }, [isOpen, isGoogleLoaded]);

    const handleLoginSuccess = async (
        email: string, 
        token: string, 
        provider: 'google' | 'microsoft'
    ) => {
        try {
            // 存储基本认证信息
            localStorage.setItem('userEmail', email);
            localStorage.setItem('authToken', token);
            localStorage.setItem('authProvider', provider);

            // 发送到后端验证
            const result = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    token,
                    provider
                })
            });

            if (result.ok) {          
                onClose();
                // 添加页面刷新
                window.location.reload();
            }
        } catch (error) {
            console.error(`Error processing ${provider} sign-in:`, error);
            throw error;
        }
    };

    const handleGoogleSignIn = async (response: any) => {
        try {
            const decoded = JSON.parse(atob(response.credential.split('.')[1]));
            await handleLoginSuccess(
                decoded.email,
                response.credential,
                'google'
            );
        } catch (error) {
            console.error('Google sign-in failed:', error);
        }
    };

    const handleMicrosoftSignIn = async () => {
        try {
            const response = await instance.loginPopup(loginRequest);
            if (response.account) {
                await handleLoginSuccess(
                    response.account.username,
                    response.accessToken,
                    'microsoft'
                );
            }
        } catch (error) {
            console.error('Microsoft sign-in failed:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 z-50 w-[400px]">
                <h2 className="text-2xl font-bold text-center mb-8">{t.auth.loginToAccount}</h2>
                
                <div className="flex flex-col items-center gap-4">
                    <div 
                        ref={googleButtonRef} 
                        className="h-[40px] w-[320px]"
                    ></div>

                    <button
                        onClick={handleMicrosoftSignIn}
                        className="w-[320px] h-[40px] flex items-center justify-center gap-2 border rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        {t.auth.loginWithMicrosoft}
                    </button>

                    <div className="mt-6 w-[320px]">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">{t.auth.memberBenefits}</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>{t.auth.unlimitedAccess}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>{t.auth.officeConversion}</span>
                            </li>
                           
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>{t.auth.prioritySupport}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}