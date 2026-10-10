import dbConnect from '@/src/lib/mongodb';
import Order from '@/src/models/Order';
import Gift from '@/src/models/Gift';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        return NextResponse.json(orders, {
            headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const data = await request.json();

        // Evita que o mesmo convidado escolha o mesmo presente mais de uma vez
        const existingOrder = await Order.findOne({
            guestPhone: data.guestPhone,
            giftId: data.giftId
        });

        if (existingOrder) {
            return NextResponse.json(existingOrder, { status: 200 });
        }

        const order = await Order.create(data);

        // Registra a escolha também no próprio Gift (para o admin visualizar rapidamente)
        await Gift.findByIdAndUpdate(data.giftId, {
            $push: {
                reservations: {
                    guestName: data.guestName,
                    guestPhone: data.guestPhone,
                    status: 'pendente',
                    message: data.message || ''
                }
            }
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    await dbConnect();
    try {
        const data = await request.json();
        const { id, status } = data;

        const updateFields: any = {};
        if (status !== undefined) updateFields.status = status;

        const order = await Order.findByIdAndUpdate(id, updateFields, { new: true });
        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        const order = await Order.findById(id);
        if (order) {
            // Remove a reserva dentro do Gift
            await Gift.findByIdAndUpdate(order.giftId, {
                $pull: { reservations: { guestPhone: order.guestPhone } }
            });
            await Order.findByIdAndDelete(id);
        }

        return NextResponse.json({ message: 'Escolha removida com sucesso.' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}