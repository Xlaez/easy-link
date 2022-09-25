import { Schema, model, Document } from 'mongoose';

export interface IComment extends Document {
  postId: string;
  parentId: string;
  content: string;
  authorId: string;
  replies: Array<string>;
  repliesCount: number;
}

const schema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post',
  },
  parentId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Comment',
  },
  content: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  repliesCount: {
    type: Number,
    default: 0,
  },
});

export default model<IComment>('Comment', schema);
