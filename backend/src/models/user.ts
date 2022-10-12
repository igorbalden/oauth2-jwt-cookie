import { model, Schema, Document, Model, Mongoose } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  google_id: string;
  google_access_token: string;
  comparePassword: (password: string) => Promise<Boolean>
};

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: false,
    default: '',
  },
  google_id: {
    type: String,
    required: false,
    default: '',
    trim: true,
  },
  google_access_token: {
    type: String,
    required: false,
    default: '',
    trim: true,
  }
});

userSchema.pre<IUser>("save", async function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;

  next();
});

userSchema.methods.comparePassword = async function(
    passwordIn: string
): Promise<Boolean> {
  return await bcrypt.compare(passwordIn, this.get('password'));
};

export default model<IUser>("User", userSchema);

