import dbConnect from '@/src/lib/mongodb';
import Gallery from '@/src/models/Gallery';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    let gallery = await Gallery.findOne({});
    if (!gallery) {
        gallery = await Gallery.create({ couplePhotos: [] });
    }
    return NextResponse.json(gallery, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { couplePhotos } = await request.json();
        let gallery = await Gallery.findOne({});
        if (!gallery) {
            gallery = await Gallery.create({ couplePhotos });
        } else {
            gallery.couplePhotos = couplePhotos;
            await gallery.save();
        }
        return NextResponse.json(gallery, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}