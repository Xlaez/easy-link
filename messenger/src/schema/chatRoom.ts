import { Schema, model, Document } from 'mongoose';

export interface IChatroom extends Document {
  members: Array<string>;
  muteBy: string;
  initiator: string;
  brand: string;
  name: string;
  type: string;
  noFoulWords: boolean;
}

const schema = new Schema(
  {
    members: [
      {
        type: String,
      },
    ],
    muteBy: [
      {
        type: String,
      },
    ],
    initiator: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['temporary', 'permanent', 'organization'],
    },
    noFoulWords: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default model<IChatroom>('ChatRoom', schema);
