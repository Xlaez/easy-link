import { Schema, model, Document } from 'mongoose';

export interface IUpload extends Document {
  url: string;
  postId: string;
}

const schema = new Schema({
  url: {
    type: String,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});

const UploadModel = model<IUpload>('Upload', schema);

export default UploadModel;
