import { Document, Types } from 'mongoose';

export class CommonSchema extends Document {
  _id?: Types.ObjectId;
  id?: Types.ObjectId;
  deleted?: boolean;
}
