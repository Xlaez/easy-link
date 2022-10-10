import { Schema, model, Document } from 'mongoose';

export interface IOrg extends Document {
  name: string;
  type: string;
  executives: Array<string>;
  members: Array<string>;
  logo: string;
}

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free',
  },
  executives: [
    {
      type: String,
    },
  ],
  members: [
    {
      type: String,
    },
  ],
  logo: {
    type: String,
    required: false,
  },
});

export default model<IOrg>('Org', schema);
