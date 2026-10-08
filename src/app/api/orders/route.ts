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

        // Verifica se já existe um pedido deste convidado para este mesmo presente
        const existingOrder = await Order.findOne({
            guestPhone: data.guestPhone,
            giftId: data.giftId
        });

        if (existingOrder) {
            // Se já existe, atualiza somando as presentes para evitar duplicidade e manter fidelidade
            const diff = Number(data.quantity) - existingOrder.quantity;
            const newQty = Number(data.quantity);
            const newTotalValue = newQty * existingOrder.quotaValue;

            existingOrder.quantity = newQty;
            existingOrder.totalValue = newTotalValue;
            await existingOrder.save();

            // Atualiza o Gift globalmente
            await Gift.findByIdAndUpdate(data.giftId, {
                $inc: { claimedQuotas: diff }
            });

            return NextResponse.json(existingOrder, { status: 200 });
        }

        const order = await Order.create(data);

        // Incrementa as presentes ocupadas no presente correspondente
        await Gift.findByIdAndUpdate(data.giftId, {
            $inc: { claimedQuotas: Number(data.quantity) }
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
        const { id, status, quantity } = data;

        const oldOrder = await Order.findById(id);
        if (!oldOrder) {
            return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
        }

        const updateFields: any = {};
        if (status !== undefined) updateFields.status = status;

        if (quantity !== undefined) {
            const newQty = Number(quantity);
            if (newQty !== oldOrder.quantity) {
                const diff = newQty - oldOrder.quantity;
                updateFields.quantity = newQty;
                updateFields.totalValue = newQty * oldOrder.quotaValue;

                // Atualiza o contador absoluto de presentes compradas do presente de forma real
                await Gift.findByIdAndUpdate(oldOrder.giftId, {
                    $inc: { claimedQuotas: diff }
                });
            }
        }

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
            // Estorna exatamente a quantidade de presentes que haviam sido ocupadas
            await Gift.findByIdAndUpdate(order.giftId, {
                $inc: { claimedQuotas: -Number(order.quantity) }
            });
            await Order.findByIdAndDelete(id);
        }

        return NextResponse.json({ message: 'Pedido removido com sucesso e presentes estornadas com fidelidade.' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}