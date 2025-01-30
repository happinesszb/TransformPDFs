interface SubscriptionResponse {
   message: string;
   subscription: {
       type: string;
       expiryDate?: string;
   };
}

// 检查用户状态并存储订阅信息到本地存储
export async function retrieveUserState(): Promise<boolean> {
    try {
        // 从本地存储获取认证信息
        const userEmail = localStorage.getItem('userEmail');
        const authToken = localStorage.getItem('authToken');

        // 如果没有必要的认证信息，返回false
        if (!userEmail || !authToken) {
            return false;
        }

        // 验证用户状态
        const result = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userEmail,
                token: authToken,
                provider: 'database'
            })
        });

        if (result.ok) {
            const data: SubscriptionResponse = await result.json();
            
            
            if (data.subscription.type !== 'free' && data.subscription.expiryDate) {
                localStorage.setItem('subscriptionExpiryDate', data.subscription.expiryDate);
            }

            return true;
        }

        return false;
    } catch (error) {
        console.log('Error checking user state:', error);
        return false;
    }
}

export async function retrieveUserStatePerDay(): Promise<void> {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        return;
    }

    const buyButtonState = localStorage.getItem('buyButtonClicked');
    //说明购买按钮被点击过
    if(buyButtonState == 'clicked') {
        localStorage.setItem('buyButtonClicked', 'unclicked');
        await retrieveUserState();
        return;
    }

    const lastCheckDate = localStorage.getItem('lastCheckUserDate');
    const today = new Date().toISOString().split('T')[0]; // 格式: YYYY-MM-DD

    if (lastCheckDate) {
        if (lastCheckDate !== today) {
            // 日期不同，更新日期并检查状态
            localStorage.setItem('lastCheckUserDate', today);
            await retrieveUserState();
        }
        // 如果日期相同，直接返回
        return;
    }

    // 没有上次检查记录，设置日期并检查状态
    localStorage.setItem('lastCheckUserDate', today);
    await retrieveUserState();
} 