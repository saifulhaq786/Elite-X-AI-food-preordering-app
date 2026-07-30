import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  // Validate MONGODB_URI format
  const isValidUri =
    MONGODB_URI &&
    (MONGODB_URI.startsWith('mongodb://') || MONGODB_URI.startsWith('mongodb+srv://')) &&
    !MONGODB_URI.includes('<username>') &&
    !MONGODB_URI.includes('user:password@cluster');

  if (!isValidUri) {
    throw new Error(
      'MONGODB_URI in .env.local is empty or contains placeholder credentials.\n' +
      'Please update MONGODB_URI with a valid connection string from MongoDB Atlas.'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('[MongoDB] Connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
