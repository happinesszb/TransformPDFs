'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ToolsDropdown from '@/components/Navigation/ToolsDropdown';
import { Squares2X2Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useLocale } from '@/hooks/useLocale';
import ConvertDropdown from '@/components/Navigation/ConvertDropdown';

export default function Navbar() {
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isConvertOpen, setIsConvertOpen] = useState(false);
    const { t, locale } = useLocale();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('userEmail'));
    }, []);

    const getLocalizedHref = (path: string) => {
        const langPrefix = locale === 'zh' ? '/cn' :
            locale === 'en' ? '/en' :
                `/${locale}`;
        return `${langPrefix}${path}`;
    };

    return (
        <>
            {(isToolsOpen || isConvertOpen) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" 
                    onClick={() => {
                        setIsToolsOpen(false);
                        setIsConvertOpen(false);
                    }} 
                />
            )}
            <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b bg-white">
                <div className="flex items-center gap-8">
                    <Link href={getLocalizedHref('/')} className="text-xl font-bold">
                        TransformPDFs
                    </Link>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsToolsOpen(!isToolsOpen)}
                            className={`
                                flex items-center gap-2 text-gray-600 hover:text-gray-900 relative
                                py-2 px-1 transition-all duration-200
                                ${isToolsOpen ? 'border-b-2 border-blue-600 text-gray-900' : ''}
                            `}
                        >
                            <Squares2X2Icon className="w-5 h-5" />
                            <span>{t.nav.tools}</span>
                            <ChevronDownIcon
                                className={`w-4 h-4 transition-transform duration-200 ${isToolsOpen ? 'transform rotate-180' : ''}`}
                            />
                            {isToolsOpen && <ToolsDropdown onClose={() => setIsToolsOpen(false)} />}
                        </button>
                        <Link 
                            href={getLocalizedHref('/tools/compress-pdf')} 
                            className="text-gray-600 hover:text-gray-900"
                        >
                            {t.nav.compress}
                        </Link>
                        <Link
                            href={getLocalizedHref('/tools/merge-pdf')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            {t.nav.merge}
                        </Link>
                        <Link
                            href={getLocalizedHref('/tools/split-pdf')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            {t.toolsbar.splitPdf.title}
                        </Link>
                        <button
                            onClick={() => setIsConvertOpen(!isConvertOpen)}
                            className={`
                                flex items-center gap-2 text-gray-600 hover:text-gray-900 relative
                                py-2 px-1 transition-all duration-200
                                ${isConvertOpen ? 'border-b-2 border-blue-600 text-gray-900' : ''}
                            `}
                        >
                            <span>{t.nav.convert}</span>
                            <ChevronDownIcon
                                className={`w-4 h-4 transition-transform duration-200 ${isConvertOpen ? 'transform rotate-180' : ''}`}
                            />
                            {isConvertOpen && <ConvertDropdown onClose={() => setIsConvertOpen(false)} />}
                        </button>
                        
                    </div>
                </div>
               
            </nav>
            
        </>
    );
} 