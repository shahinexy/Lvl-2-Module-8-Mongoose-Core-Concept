import { model, Schema } from 'mongoose';
import { ModelOfUser, TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
import { UserStatus } from './user.constant';

const UserSchema = new Schema<TUser, ModelOfUser>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Midleware

// Pre save middleware / Hook
UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// Post save middleware / Hook
UserSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

UserSchema.static(
  'isJwtIssuedBeforePasswordChanged',
  function (passwordChangedTimestamp: Date, jwtIssuedTimestamp: number) {
    const passwordChangedTime =
      new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
  },
);

export const UserModel = model<TUser, ModelOfUser>('User', UserSchema);
