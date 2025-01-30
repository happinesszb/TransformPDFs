interface Subscription {
    type: 'free' | 'basic_monthly' | 'basic_yearly' | 'pro_monthly' | 'pro_yearly' | 'enterprise_monthly' | 'enterprise_yearly';
    expiryDate?: Date;
    monthlyFileLimit: number;
    paymentId?: string;
}

interface User {
    _id: ObjectId;
    email: string;
    lastLoginTime: Date;
    token: string;
    subscription: Subscription;
    createdAt: Date;
    updatedAt: Date;
}

interface FileRecord {
    _id: ObjectId;
    email: string;
    originalName: string;
    uploadTime: Date;
    fileSize: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    operation: 'convert' | 'compress' | 'merge' | 'split';
    operationResult: string;
} 