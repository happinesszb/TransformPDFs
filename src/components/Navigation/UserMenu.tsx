'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useLocale } from '@/hooks/useLocale';
import { useMsal } from "@azure/msal-react";
import Link from 'next/link';

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { t, locale } = useLocale();
    const menuRef = useRef<HTMLDivElement>(null);
    const { instance } = useMsal();
    
    const userEmail = localStorage.getItem('userEmail') || '';
    const authProvider = localStorage.getItem('authProvider');

    // 格式化过期时间
    const formatExpiryDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    };

    // 处理点击外部关闭菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        if (authProvider === 'microsoft') {
            try {
                await instance.logoutRedirect({
                    onRedirectNavigate: () => false,  // 阻止重定向
                    postLogoutRedirectUri: window.location.origin
                });
                console.log('Microsoft logout success');
            } catch (error) {
                console.error('Microsoft logout error:', error);
            }
        } else if (authProvider === 'google') {
            const auth2 = window.google?.accounts?.id;
            if (auth2) {
                (auth2 as any).disableAutoSelect();
                console.log('Google logout success');
            }
        }

        // 清除本地存储
        localStorage.removeItem('userEmail');
        localStorage.removeItem('authToken');
        localStorage.removeItem('authProvider');

        setIsOpen(false);
        // 重定向到首页
        window.location.href = '/';
    };

    // 添加获取本地化链接的函数
    const getLocalizedHref = (path: string) => {
        const langPrefix = locale === 'zh' ? '/cn' :
                         locale === 'en' ? '/en' :
                         `/${locale}`;
        return `${langPrefix}${path}`;
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
                <UserCircleIcon className="w-6 h-6" />
                <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                    {/* 用户邮箱 */}
                    <div className="px-4 py-2 border-b">
                        <p className="text-sm text-gray-600 truncate">{userEmail}</p>
                    </div>
                 

                    {/* 设置链接 */}
                    <div className="px-4 py-2 border-b">
                        <Link 
                            href={getLocalizedHref('/settings')}
                            className="text-sm text-gray-600 hover:text-gray-900"
                            onClick={() => setIsOpen(false)}
                        >
                            {t.settings.title}
                        </Link>
                    </div>

                    {/* 注销按钮 */}
                    <div 
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <p className="text-sm text-red-600">{t.auth.logout}</p>
                    </div>
                </div>
            )}
        </div>
    );
} 