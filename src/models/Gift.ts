import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation {
    _id?: string;
    guestName: string;
    guestPhone: string;
    status: 'pendente' | 'recebido';
    message?: string;
    createdAt?: Date;
}

export interface IGift extends Document {
    name: string;
    imageUrl?: string;
    reservations: IReservation[];
}

const ReservationSchema = new Schema({
    guestName: { type: String, required: true },
    guestPhone: { type: String, required: true },
    status: { type: String, enum: ['pendente', 'recebido'], default: 'pendente' },
    message: { type: String, default: '' }
}, { timestamps: true });

const GiftSchema: Schema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    reservations: [ReservationSchema]
}, { timestamps: true });

if (mongoose.models.Gift) {
    delete mongoose.models.Gift;
}

export default mongoose.model<IGift>('Gift', GiftSchema);