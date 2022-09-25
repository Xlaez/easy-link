import { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
  userId: string;
  content: string;
  files: Array<string>;
  comments: Array<string>;
}

const schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      minLength: 1,
    },
    files: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Upload',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

const PostModel = model<IPost>('Post', schema);

export default PostModel;
