// TODO: add mongoose
import mongoose from 'mongoose';

// handle deprecation warning
mongoose.set('strictQuery', false);

export { default as mongoose } from 'mongoose';
