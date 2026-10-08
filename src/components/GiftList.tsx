'use client';

import React, { useState } from 'react';
import { Gift, Plus, Minus, Sparkles } from 'lucide-react';

interface GiftListProps {
    gifts: any[];
    onSelectGiftOption: (gift: any, quantity: number, method: 'physical' | 'pix') => void;
}

export default function GiftList({ gifts, onSelectGiftOption }: GiftListProps) {
    const [cart, setCart] = useState<Record<string, number>>({});

    const updateQuantity = (giftId: string, delta: number, maxAvailable: number) => {
        setCart(prev => {
            const current = prev[giftId] || 0;
            const next = current + delta;

            if (next <= 0) {
                const updated = { ...prev };
                delete updated[giftId];
                return updated;
            }

            if (next > maxAvailable) return prev;

            return { ...prev, [giftId]: next };
        });
    };

    const setMaxQuantity = (giftId: string, maxAvailable: number) => {
        setCart(prev => ({ ...prev, [giftId]: maxAvailable }));
    };

    return (
        <section className="max-w-5xl mx-auto px-6 py-20 pb-32 relative">
            <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
                <h2 className="text-3xl font-serif italic text-stone-900">Lista de Presentes para o Nosso Lar</h2>
                <p className="text-stone-600 text-sm">
                    Escolha um Presente. Cada contribuição ajuda a construir nosso cantinho! 🏠✨
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {gifts.map((gift) => {
                    const quotaValue = gift.totalPrice / gift.totalQuotas;
                    const availableQuotas = gift.totalQuotas - (gift.claimedQuotas || 0);
                    const isSoldOut = availableQuotas <= 0;
                    const currentQty = cart[gift._id] || 0;

                    return (
                        <div key={gift._id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all flex flex-col justify-between group ${currentQty > 0 ? 'border-amber-500 ring-1 ring-amber-500/30 bg-amber-50/10' : 'border-stone-200 hover:shadow-md'}`}>

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

                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-lg font-bold text-stone-900">{gift.name}</h4>
                                    {currentQty > 0 && (
                                        <span className="bg-amber-500 text-stone-950 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                            {currentQty} {currentQty === 1 ? 'presente' : 'presentes'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Valor do Presente:</span>
                                    <span className="text-2xl font-serif font-bold text-amber-800">R$ {quotaValue.toFixed(2)}</span>
                                </div>
                                {!isSoldOut && (
                                    <div className="flex justify-between items-center text-xs text-stone-500 font-medium">
                                        <span>Presentes disponíveis: <strong className="text-stone-700">{availableQuotas}</strong></span>
                                        <span className="font-serif font-bold text-stone-900">Total: R$ {gift.totalPrice.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="px-6 pb-6 pt-2 border-t border-stone-100 bg-stone-50/50 space-y-3">
                                {isSoldOut ? (
                                    <div className="w-full text-center py-2 bg-stone-100 text-stone-500 font-semibold rounded-lg text-sm">
                                        Já foi todo presenteado! ❤️
                                    </div>
                                ) : (
                                    <>
                                        {/* SELETOR DE presenteS */}
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Confirme Qtde:</span>
                                            <div className="flex items-center bg-white border border-stone-200 rounded-lg shadow-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(gift._id, -1, availableQuotas)}
                                                    className="p-2 text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-30 cursor-pointer"
                                                    disabled={currentQty === 0}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-stone-800 text-sm select-none">
                                                    {currentQty}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(gift._id, 1, availableQuotas)}
                                                    className="p-2 text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-30 cursor-pointer"
                                                    disabled={currentQty >= availableQuotas}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* BOTÕES DE ESCOLHA QUANDO HÁ presenteS */}
                                        {currentQty > 0 && (
                                            <div className="pt-2 border-t border-stone-200/60 space-y-2 animate-in fade-in duration-200">
                                                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider text-center">Como deseja presentear?</p>
                                                <button
                                                    type="button"
                                                    onClick={() => onSelectGiftOption(gift, currentQty, 'physical')}
                                                    className="w-full py-2 px-3 bg-white hover:bg-stone-100 text-stone-800 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-stone-300 shadow-sm cursor-pointer"
                                                >
                                                    🎁 Vou entregar o presente pessoalmente
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onSelectGiftOption(gift, currentQty, 'pix')}
                                                    className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                                                >
                                                    💠 Realizar PIX (R$ {(quotaValue * currentQty).toFixed(2)})
                                                </button>
                                            </div>
                                        )}

                                        {/* BOTÃO RÁPIDO: PRESENTEAR O TODO */}
                                        {currentQty === 0 && availableQuotas > 1 && (
                                            <div className="pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setMaxQuantity(gift._id, availableQuotas)}
                                                    className="w-full py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-[11px] transition-colors flex items-center justify-center gap-1.5 border border-stone-200 cursor-pointer"
                                                >
                                                    <Sparkles size={13} className="text-amber-600" /> Presentear o item todo ({availableQuotas} presentes)
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}