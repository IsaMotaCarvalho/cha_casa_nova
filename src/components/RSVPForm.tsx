'use client';

import React, { useState } from 'react';
import { CheckCircle2, HelpCircle } from 'lucide-react';

function FieldTooltip({ text }: { text: string }) {
    const [show, setShow] = useState(false);
    return (
        <span className="relative inline-block ml-1.5 align-middle">
            <button
                type="button"
                onClick={(e) => { e.preventDefault(); setShow(!show); }}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className="text-amber-400 hover:text-amber-300 focus:outline-none cursor-pointer"
                title="Ajuda"
            >
                <HelpCircle size={14} />
            </button>
            {show && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-stone-950 text-white text-[11px] rounded-lg shadow-xl pointer-events-none text-center leading-tight border border-amber-500/30">
                    {text}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-950" />
                </div>
            )}
        </span>
    );
}

interface RSVPFormProps {
    rsvpName: string;
    setRsvpName: (v: string) => void;
    rsvpPhone: string;
    setRsvpPhone: (v: string) => void;
    rsvpSide: 'noivo' | 'noiva';
    setRsvpSide: (v: 'noivo' | 'noiva') => void;
    rsvpMessage: string;
    setRsvpMessage: (v: string) => void;
    rsvpSuccess: boolean;
    isLoadingGuest: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export default function RSVPForm({
    rsvpName, setRsvpName,
    rsvpPhone, setRsvpPhone,
    rsvpSide, setRsvpSide,
    rsvpMessage, setRsvpMessage,
    rsvpSuccess, isLoadingGuest,
    onSubmit
}: RSVPFormProps) {
    return (
        <section className="bg-stone-900 text-white py-16 px-6">
            <div className="max-w-md mx-auto">
                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-serif italic text-amber-400">Confirmar Presença</h2>
                    <p className="text-stone-400 text-sm">Por favor, confirme sua presença até o dia 24/10/2026.</p>
                </div>

                {rsvpSuccess ? (
                    <div className="bg-stone-800 p-6 rounded-xl text-center space-y-3 border border-amber-500/30">
                        <CheckCircle2 className="text-amber-400 mx-auto" size={40} />
                        <p className="text-lg font-medium">Sua presença foi confirmada!</p>
                        <p className="text-sm text-stone-400">Obrigado por fazer parte do nosso novo lar. 🏠✨</p>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-stone-300 mb-1">
                                Nome Completo
                                <FieldTooltip text="Digite seu nome e sobrenome completo para identificação na lista." />
                            </label>
                            <input
                                type="text"
                                placeholder="Seu Nome Completo"
                                required
                                value={rsvpName}
                                onChange={e => setRsvpName(e.target.value)}
                                className="w-full p-3 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-sm disabled:opacity-60"
                                disabled={isLoadingGuest}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-stone-300 mb-1">
                                Telefone / WhatsApp
                                <FieldTooltip text="Informe seu número com DDD para contato, caso necessário." />
                            </label>
                            <input
                                type="text"
                                placeholder="Seu Telefone / WhatsApp"
                                required
                                value={rsvpPhone}
                                onChange={e => setRsvpPhone(e.target.value)}
                                className="w-full p-3 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-stone-300 mb-1">
                                Vínculo com os Anfitriões
                                <FieldTooltip text="Selecione se você é convidado(a) do noivo ou da noiva." />
                            </label>
                            <select
                                value={rsvpSide}
                                onChange={e => setRsvpSide(e.target.value as any)}
                                className="w-full p-3 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-sm"
                            >
                                <option value="noivo">Convidado do Noivo</option>
                                <option value="noiva">Convidado da Noiva</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-stone-300 mb-1">
                                Mensagem (Opcional)
                                <FieldTooltip text="Escreva uma mensagem especial que aparecerá no mural de recados dos anfitriões." />
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Deixe uma mensagem carinhosa para os anfitriões (opcional)"
                                value={rsvpMessage}
                                onChange={e => setRsvpMessage(e.target.value)}
                                className="w-full p-3 bg-stone-800 border border-stone-700 rounded-lg text-white focus:outline-none focus:border-amber-400 text-sm"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-amber-500 text-stone-950 font-bold rounded-lg hover:bg-amber-400 transition-colors text-sm tracking-wider uppercase shadow-md disabled:opacity-50"
                            disabled={isLoadingGuest}
                        >
                            {isLoadingGuest ? 'Carregando Dados...' : 'Confirmar Presença no Chá'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}