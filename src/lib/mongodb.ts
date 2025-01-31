import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Please set the MONGODB_URI environment variable');
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
                        
                        //  
                        global._mongoClientPromise.catch(error => {
                            console.error('MongoDB error:', error);
                            global._mongoClientPromise = undefined;
                            throw error;
                        });
                    }
                    this.instance = global._mongoClientPromise;
                } else {
                    const client = new MongoClient(process.env.MONGODB_URI!, options);
                    this.instance = client.connect();
                }

                //  
                const mongoClient = await this.instance;
                await mongoClient.db().command({ ping: 1 });
                console.log('MongoDB connect successfully');
                
            } catch (error) {
                console.error('MongoDB connect failed:', error);
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