import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    guestName: string;
    guestPhone: string;
    giftId: mongoose.Types.ObjectId;
    giftName: string;
    status: 'pendente' | 'recebido';
    message?: string;
}

const OrderSchema: Schema = new Schema({
    guestName: { type: String, required: true },
    guestPhone: { type: String, required: true },
    giftId: { type: Schema.Types.ObjectId, ref: 'Gift', required: true },
    giftName: { type: String, required: true },
    status: { type: String, enum: ['pendente', 'recebido'], default: 'pendente' },
    message: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);