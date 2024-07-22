import mongoose, { Schema, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email?: string;
  username: string;
  photo?: string;
  firstName: string;
  lastName: string;
  planId: number;
  creditBalance: number;
  friends: string[]
  // friends: Schema.Types.ObjectId[];
}

const UserSchema = new Schema({
  clerkId: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  photo: {type: String, required: true},
  firstName: {type: String},
  lastName: {type: String},
  planId: {type: Number, default: 1},
  creditBalance: {type: Number, default: 10},
  friends:[{type:String, default:[]}]
  // friends: [{type:Schema.Types.ObjectId, ref:'User',default:[]}]
})

const User = models?.User || mongoose.model("User", UserSchema)
export default User;