import { Schema, model, Document } from 'mongoose';

interface IReaction {
  reactor: string;
  reaction: string;
}

interface IShare {
  sharer: string;
}

export interface IPost extends Document {
  userId: string;
  content: string;
  files: Array<string>;
  comments: Array<string>;
  reaction: Array<IReaction>;
  reactionCount: Number;
  sharer: Array<string>;
  shareCount: Number;
  sharedPostId: string; // if post is a shared post new post is created and this field is assigned to the originial posts id
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
    reaction: [
      {
        reactor: {
          type: String,
        },
        reaction: {
          type: String,
          enum: ['clap', 'love', 'wow'],
        },
      },
    ],
    reactionCount: {
      type: Number,
      default: 0,
    },
    sharer: [
      {
        type: String,
      },
    ],
    shareCount: {
      type: Number,
      default: 0,
    },
    sharedPostId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

const PostModel = model<IPost>('Post', schema);

export default PostModel;
