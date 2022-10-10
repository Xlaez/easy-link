import { connect } from 'mongoose';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.resolve(process.cwd(), '.env') });

const MONGO_URL = process.env.DATABASE_URL;

const connectDb = () =>
  connect(MONGO_URL, {
    appName: 'connect',
  });

export default connectDb;
