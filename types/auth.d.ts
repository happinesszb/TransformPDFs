export interface Subscription {
    type: 'free' | 'basic_monthly' | 'basic_yearly' | 'pro_monthly' | 'pro_yearly' | 'enterprise_monthly' | 'enterprise_yearly';
    expiryDate?: string;
    monthlyFileLimit: number;
}

export interface LoginResponse {
    message: string;
    subscription: {
        type: Subscription['type'];
        expiryDate?: string;
    };
} 