import { Schema, model, Document } from 'mongoose';

export interface IInfo extends Document {
  title: string;
  content: string;
  views: {
    count: number;
    viewers: Array<string>;
  };
  author: string;
  orgId: string;
  file: {
    url: Array<string>;
    type: string;
  };
}

const schema = new Schema(
  {
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
      minLength: [10, 'an organization info cannot be less than 10 characters'],
    },
    views: {
      count: {
        type: Number,
        default: 0,
      },
      viewers: [
        {
          type: String,
        },
      ],
    },
    author: {
      type: String,
      required: true,
    },
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
    },
    file: {
      url: [
        {
          type: String,
          required: false,
        },
      ],
      type: {
        type: String,
        required: false,
      },
    },
  },
  { timestamps: true },
);

export default model<IInfo>('OrgInfo', schema);
