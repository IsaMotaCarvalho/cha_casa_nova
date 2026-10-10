'use client';

import React from 'react';
import { Gift } from 'lucide-react';

interface GiftListProps {
    gifts: any[];
    onSelectGift: (gift: any) => void;
}

export default function GiftList({ gifts, onSelectGift }: GiftListProps) {
    return (
        <section className="max-w-5xl mx-auto px-6 py-20 pb-32 relative">
            <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
                <h2 className="text-3xl font-serif italic text-stone-900">Lista de Presentes para o Nosso Lar</h2>
                <p className="text-stone-600 text-sm">
                    Escolha um presente para nos ajudar a montar nosso cantinho! 🏠✨
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <span className="text-stone-600 text-sm">Sugestão de cores para o nosso lar:</span>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span
                                className="w-5 h-5 rounded-full shadow ring-1 ring-stone-800"
                                style={{ background: '#1a1a1a' }}
                            />
                            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">Preto</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span
                                className="w-5 h-5 rounded-full shadow ring-1 ring-stone-300"
                                style={{ background: '#ffffff' }}
                            />
                            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">Branco</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span
                                className="w-5 h-5 rounded-full shadow ring-1 ring-stone-400"
                                style={{ background: 'linear-gradient(135deg, #e8e8e8 0%, #b0b0b0 30%, #f5f5f5 50%, #909090 70%, #d0d0d0 100%)' }}
                            />
                            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">Inox</span>
                        </div>
                    </div>
                </div>
                
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {gifts.map((gift) => {
                    const chosen = (gift.reservations || []).length > 0;

                    return (
                        <div
                            key={gift._id}
                            className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all flex flex-col justify-between group ${chosen ? 'border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-50/10' : 'border-stone-200 hover:shadow-md'}`}
                        >
                            {/* FOTO DO PRESENTE */}
                            {gift.imageUrl && (
                                <div className="w-full h-48 bg-stone-100 overflow-hidden relative p-3 flex items-center justify-center">
                                    <img
                                        src={gift.imageUrl}
                                        alt={gift.name}
                                        className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}

                            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                                <h4 className="text-lg font-bold text-stone-900">{gift.name}</h4>

                                {chosen ? (
                                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-xs font-semibold text-center">
                                        🎁 Este presente já foi escolhido!
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => onSelectGift(gift)}
                                        className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                                    >
                                        <Gift size={16} /> Escolher este presente
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}