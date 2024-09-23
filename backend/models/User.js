import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    gender: { type: String, enum: ['male', 'female'], required: false }, // Add gender field
    isOnline: { type: Boolean, default: false },

});

const User = mongoose.model('User', UserSchema);

export default  User;
