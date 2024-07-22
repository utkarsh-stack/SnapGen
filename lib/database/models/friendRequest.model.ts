import mongoose, { Schema, models, Document } from "mongoose";


export interface IFriendRequest extends Document {
  from: string;
  to: string;
  status: number;
}

const FriendRequestSchema = new Schema({
  from: {type: String},
  to: {type: String},
  status: {type: Number}
})

const FriendRequest = models?.FriendRequest || mongoose.model('FriendRequest', FriendRequestSchema);
export default FriendRequest;