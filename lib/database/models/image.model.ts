import mongoose, { Schema, models, Types, Document } from "mongoose";


export interface IImage extends Document {
  title: string;
  transformationType: string;
  publicId: string;
  secureURL: string;
  width?: number;
  height?: number;
  config?: object;
  transformationUrl?: string;
  aspectRatio?: string;
  color?: string;
  prompt?: string;
  author?: {
    _id: String;
    firstName: String;
    lastName: String;
  };
  public?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ImageSchema = new Schema({
  title: {type: String, required: true},
  transformationType: {type: String, required: true},
  publicId: {type: String, required: true},
  secureURL: {type: String, required: true},
  width: {type: Number},
  height: {type: Number},
  config: {type: Object},
  transformationUrl: {type: String},
  aspectRatio: {type: String},
  color: {type: String},
  prompt: {type: String},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  public: {type:Boolean, default:true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
})

const Image = models?.Image || mongoose.model('Image', ImageSchema);
export default Image;