'use client';

import React, { useState, useEffect } from 'react';
import { Trash, Save } from 'lucide-react';
import { compressImage } from '@/src/lib/compressImage';

export default function GalleryManagement() {
    const [photos, setPhotos] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    useEffect(() => {
        fetch('/api/gallery')
            .then(res => res.json())
            .then(data => {
                if (data && data.couplePhotos) {
                    setPhotos(data.couplePhotos);
                }
            })
            .catch(err => console.error('Erro ao buscar galeria:', err));
    }, []);

    const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setIsLoading(true);
        try {
            const newCompressedPhotos: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const compressed = await compressImage(files[i], 900, 0.75);
                newCompressedPhotos.push(compressed);
            }
            setPhotos(prev => [...prev, ...newCompressedPhotos]);
        } catch (err) {
            console.error('Erro ao processar imagens:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const handleSaveGallery = async () => {
        setIsLoading(true);
        setSavedSuccess(false);
        try {
            await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ couplePhotos: photos })
            });
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        } catch (err) {
            console.error('Erro ao salvar galeria:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Fotos do Nosso Lar (Galeria)</h1>
                <button
                    onClick={handleSaveGallery}
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm shadow-sm"
                >
                    <Save size={16} /> {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Adicionar Novas Fotos do Nosso Lar</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAddPhotos}
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100 cursor-pointer"
                    />
                    <p className="text-xs text-slate-400 mt-1">As imagens serão compactadas automaticamente para carregar de forma rápida e suave.</p>
                </div>

                {savedSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs font-semibold text-center">
                        Galeria salva com sucesso!
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden aspect-square shadow-sm">
                            <img src={photo} alt={`Nosso Lar ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemovePhoto(index)}
                                className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-lg opacity-90 hover:opacity-100 transition-opacity shadow"
                                title="Remover foto"
                            >
                                <Trash size={14} />
                            </button>
                        </div>
                    ))}
                    {photos.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400 italic text-sm">
                            Nenhuma foto do lar cadastrada ainda.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}