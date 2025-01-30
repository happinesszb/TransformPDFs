import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('请设置 MONGODB_URI 环境变量');
}

const options: MongoClientOptions = {
    maxPoolSize: 50,
    minPoolSize: 10,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    directConnection: true,
};

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

class Mongo {
    private static instance: Promise<MongoClient> | undefined;

    static async getInstance(): Promise<MongoClient> {
        if (!this.instance) {
            try {
                if (process.env.NODE_ENV === 'development') {
                    if (!global._mongoClientPromise) {
                        const client = new MongoClient(process.env.MONGODB_URI!, options);
                        global._mongoClientPromise = client.connect();
                        
                        // 添加错误处理
                        global._mongoClientPromise.catch(error => {
                            console.error('MongoDB 连接错误:', error);
                            global._mongoClientPromise = undefined;
                            throw error;
                        });
                    }
                    this.instance = global._mongoClientPromise;
                } else {
                    const client = new MongoClient(process.env.MONGODB_URI!, options);
                    this.instance = client.connect();
                }

                // 测试连接
                const mongoClient = await this.instance;
                await mongoClient.db().command({ ping: 1 });
                console.log('MongoDB 连接成功');
                
            } catch (error) {
                console.error('MongoDB 连接失败:', error);
                throw error;
            }
        }
        return this.instance;
    }

    static async closeConnection(): Promise<void> {
        if (this.instance) {
            const client = await this.instance;
            await client.close();
            this.instance = undefined;
            global._mongoClientPromise = undefined;
        }
    }
}

export default Mongo; 