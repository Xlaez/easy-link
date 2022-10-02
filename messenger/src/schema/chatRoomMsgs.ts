import { Schema, model, Document } from 'mongoose';

const ReadByRecipientSchema = new Schema(
  {
    // _id:false,
    readByUserId: {
      type: String,
    },
  },
  { timestamps: true },
);

export interface IChatmsg extends Document {
  chatRoomId: string;
  message: any;
  sendBy: string;
  readByRecipients: any;
  isDeleted: boolean;
}

const MsgSchema = new Schema(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatRoom',
    },
    message: {
      type: Schema.Types.Mixed,
    },
    sendBy: {
      type: String,
    },
    readByRecipients: [ReadByRecipientSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IChatmsg>('ChatMsgs', MsgSchema);
