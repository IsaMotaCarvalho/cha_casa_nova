import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
    couplePhotos: string[];
}

const GallerySchema = new Schema({
    couplePhotos: { type: [String], default: [] }
}, { timestamps: true });

if (mongoose.models.Gallery) {
    delete mongoose.models.Gallery;
}

export default mongoose.model<IGallery>('Gallery', GallerySchema);