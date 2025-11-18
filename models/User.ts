import mongoose, { Schema, models } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  isGoogleRegistrationComplete?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser, {}, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: false,
      validate: {
        validator: function(v: string) {
          // Chỉ validate nếu password được cung cấp
          if (!v || v.length === 0) return true;
          return v.length >= 6;
        },
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      },
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isGoogleRegistrationComplete: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = models.User || mongoose.model<IUser, {}, IUserMethods>('User', UserSchema);

export default User;
