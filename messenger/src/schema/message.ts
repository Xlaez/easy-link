import { Schema, model, Document } from 'mongoose';

export interface IReadByRecipient extends Document {
  readByUserId: string;
  updatedAt: Date;
  createdAt: Date;
  _id: string;
}

export interface IMsg extends Document {
  isDeleted: boolean;
  msg: string;
  reaction: string;
  sender: string;
  users: Array<string>;
  createdAt: Date;
  conv: string;
  readByRecipients: Array<IReadByRecipient>;
  file: {
    fileUrl: string;
    fileType: string;
  };
}

const ReadByRecipientSchema = new Schema(
  {
    readByUserId: { type: String },
  },
  {
    timestamps: true,
  },
);

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
    },
    readByRecipients: [ReadByRecipientSchema],
  },
  { timestamps: true },
);

export default model<IMsg>('Message', schema);
