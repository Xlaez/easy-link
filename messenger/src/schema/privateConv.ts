import { Schema, model, Document } from 'mongoose';

export interface IConv extends Document {
  members: Array<string>;
  blocked: {
    is: boolean;
    by: string;
  };
  createdAt: Date;
}

// In the future transactions can be made between members in conversation

const schema = new Schema(
  {
    members: [
      {
        type: String,
        required: true,
      },
    ],
    blocked: {
      is: {
        type: Boolean,
        default: false,
      },
      by: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

export default model<IConv>('Conversation', schema);
