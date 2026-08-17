import mongoose, { Schema, Document } from 'mongoose';

export interface IChatHistory extends Document {
  userId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  topic?: string;
  createdAt: Date;
}

const ChatHistorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    topic: { type: String, default: 'General' },
  },
  { timestamps: true }
);

export default mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);