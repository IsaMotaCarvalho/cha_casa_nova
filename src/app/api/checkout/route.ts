import dbConnect from '@/src/lib/mongodb';
import Gift from '@/src/models/Gift';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { guestName, guestPhone, message, cart } = await request.json();

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return NextResponse.json({ error: 'O carrinho está vazio ou é inválido.' }, { status: 400 });
        }

        const updatePromises = cart.map((item: any) => {
            const { giftId } = item;

            return Gift.findByIdAndUpdate(
                giftId,
                {
                    $push: {
                        reservations: {
                            guestName,
                            guestPhone,
                            status: 'pendente',
                            message: message || ''
                        }
                    }
                },
                { new: true }
            );
        });

        await Promise.all(updatePromises);

        return NextResponse.json({ success: true, message: 'Presentes reservados com sucesso!' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}