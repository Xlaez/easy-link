import { Schema, model, Document } from 'mongoose';

export interface IMsg extends Document {
  isDeleted: boolean;
  msg: string;
  reaction: string;
  seen: boolean;
  sender: string;
  users: Array<string>;
  file: {
    fileUrl: string;
    fileType: string;
  };
  createdAt: Date;
  conv: string;
}

const schema = new Schema(
  {
    isDeleted: {
      type: Boolean,
      default: false,
    },
    msg: {
      type: String,
      required: false,
      minLength: 1,
    },
    reaction: {
      type: String,
      required: false,
      enum: ['wow', 'smile', 'love'],
    },
    seen: {
      type: Boolean,
      default: false,
    },
    sender: {
      type: String,
      required: true,
    },
    users: [
      {
        type: String,
        required: true,
      },
    ],
    file: {
      fileUrl: {
        type: String,
        required: false,
      },
      fileType: {
        type: String,
        required: false,
        enum: ['photo', 'video', 'audio'],
      },
    },
    conv: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
    }
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

export default model<IMsg>('Message', schema);
