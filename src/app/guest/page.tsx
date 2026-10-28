'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, CheckSquare, Square, Sparkles, Calendar, Clock, Gift, Package } from 'lucide-react';
import LocationCards from '@/src/components/LocationCards';
import GiftList from '@/src/components/GiftList';

export default function GuestPage() {
    const [gifts, setGifts] = useState<any[]>([]);
    const [guestId, setGuestId] = useState<string | null>(null);
    const [guestOrders, setGuestOrders] = useState<any[]>([]);

    const [giftListKey, setGiftListKey] = useState(0);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [familyName, setFamilyName] = useState('');
    const [familyPhone, setFamilyPhone] = useState('');
    const [familySide, setFamilySide] = useState<'noivo' | 'noiva'>('noivo');
    const [familyMembers, setFamilyMembers] = useState<any[]>([]);
    const [rsvpMessage, setRsvpMessage] = useState('');
    const [rsvpSuccess, setRsvpSuccess] = useState(false);
    const [isLoadingGuest, setIsLoadingGuest] = useState(false);
    const [isSavingRsvp, setIsSavingRsvp] = useState(false);

    const refreshGiftsFromServer = () => {
        fetch(`/api/gifts?t=${Date.now()}`, { cache: 'no-store' })
            .then(res => {
                if (!res.ok) throw new Error('Falha ao buscar presentes');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setGifts(data);
            })
            .catch(err => console.error('Erro ao buscar presentes:', err));
    };

    const refreshGuestOrders = (phone: string) => {
        if (!phone) return;
        // Agora a API já filtra pelo telefone no servidor!
        fetch(`/api/orders?phone=${phone}&t=${Date.now()}`, { cache: 'no-store' })
            .then(res => {
                if (!res.ok) throw new Error('Falha ao buscar pedidos');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setGuestOrders(data);
                }
            })
            .catch(err => console.error('Erro ao buscar pedidos do convidado:', err));
    };

    useEffect(() => {
        refreshGiftsFromServer();

        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (id) {
            setGuestId(id);
            setIsLoadingGuest(true);

            fetch(`/api/guests?id=${id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Falha ao buscar convidado');
                    return res.json();
                })
                .then(async (data) => {
                    if (data && !data.error) {
                        setFamilyName(data.name || '');
                        setFamilyPhone(data.phone || '');
                        setFamilySide(data.side || 'noivo');
                        setFamilyMembers(data.members || []);
                        setRsvpMessage(data.message || '');

                        if (data.phone) {
                            refreshGuestOrders(data.phone);
                        }

                        if (data.members?.length > 0 && data.members.every((m: any) => m.confirmed)) {
                            setRsvpSuccess(true);
                        }
                    }
                })
                .catch(err => console.error('Erro ao buscar dados do convidado:', err))
                .finally(() => setIsLoadingGuest(false));
        }
    }, []);

    const toggleLocalMemberConfirmation = (memberId: string) => {
        setFamilyMembers(prev => prev.map(m =>
            m._id === memberId ? { ...m, confirmed: !m.confirmed } : m
        ));
    };

    const handleFamilyRSVP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingRsvp(true);
        setRsvpSuccess(false);

        try {
            await fetch('/api/guests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: guestId,
                    members: familyMembers,
                    message: rsvpMessage
                })
            });
            setRsvpSuccess(true);
        } catch (err) {
            console.error('Erro ao salvar presença da família:', err);
        } finally {
            setIsSavingRsvp(false);
        }
    };

    const handleSelectGift = async (gift: any) => {
        await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                guestName: familyName || 'Convidado',
                guestPhone: familyPhone || '',
                giftId: gift._id,
                giftName: gift.name,
                message: rsvpMessage || ''
            })
        });

        setSuccessMessage(`Obrigado! Vocês escolheram o presente "${gift.name}". 🏠✨`);
        setTimeout(() => setSuccessMessage(null), 6000);

        setGiftListKey(prev => prev + 1);
        refreshGiftsFromServer();
        refreshGuestOrders(familyPhone);
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-amber-100 relative pt-12">

            {successMessage && (
                <div className="fixed top-16 inset-x-4 max-w-xl mx-auto bg-emerald-600 text-white p-4 rounded-2xl shadow-xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle size={24} className="shrink-0" />
                    <p className="text-sm font-medium">{successMessage}</p>
                </div>
            )}

            {/* HERO SECTION COM IMAGEM COMO <img> ABSOLUTA */}
            <div className="relative min-h-[55vh] md:min-h-[65vh] flex items-center justify-center border-b border-stone-200 overflow-hidden shadow-xl">

                <img
                    src="/cha.jpeg"
                    alt="Chá de Casa Nova"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ zIndex: 0 }}
                />

                <div
                    className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/40 to-stone-950/80"
                    style={{ zIndex: 1 }}
                />

                <div className="relative w-full max-w-4xl mx-auto px-6 py-16 text-center space-y-8" style={{ zIndex: 2 }}>

                    <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-stone-900/90 border border-amber-400/50 backdrop-blur-md shadow-2xl text-amber-200 text-xs md:text-sm font-semibold tracking-widest uppercase">
                        <Sparkles size={15} className="text-amber-400 animate-spin" />
                        <span>
                            {isLoadingGuest
                                ? 'Carregando convite...'
                                : familyName
                                    ? `Olá, ${familyName}! Convidamos você para nosso Chá de Casa Nova`
                                    : 'Convidamos você para nosso Chá de Casa Nova'}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] w-16 md:w-28 bg-gradient-to-r from-transparent via-amber-400/80 to-amber-400" />
                            <span className="text-amber-300/90 text-xs md:text-sm uppercase tracking-[0.35em] font-light">Nosso Novo Lar</span>
                            <div className="h-[1px] w-16 md:w-28 bg-gradient-to-l from-transparent via-amber-400/80 to-amber-400" />
                        </div>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-normal tracking-wide text-white drop-shadow-2xl">
                            Isabella <span className="text-amber-400 font-serif italic font-light">&</span> Jonathan
                        </h1>
                    </div>

                    <blockquote className="max-w-xl mx-auto">
                        <p className="text-stone-200/90 font-serif italic text-base md:text-lg tracking-wide drop-shadow-md">
                            &ldquo;Cada cantinho do nosso lar vai guardar um pedacinho de vocês.&rdquo;
                        </p>
                    </blockquote>

                    <div className="pt-2 flex justify-center">
                        <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-4 rounded-2xl bg-stone-900/90 border border-amber-400/60 backdrop-blur-md shadow-2xl text-stone-100 transition-all hover:border-amber-300">
                            <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-widest font-bold">
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                                <span>Data Oficial do Chá</span>
                            </div>
                            <div className="hidden sm:block h-5 w-[1px] bg-amber-500/40" />
                            <div className="text-xs md:text-sm font-medium tracking-wide text-stone-200 flex items-center gap-3">
                                <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                                    <Calendar size={15} /> 31 de Outubro de 2026
                                </span>
                                <span className="text-amber-500">•</span>
                                <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                                    <Clock size={15} /> 17:00h
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <LocationCards />

            {/* SEÇÃO DE PRESENTES JÁ ESCOLHIDOS PELO CONVIDADO */}
            {guestOrders.length > 0 && (
                <section className="max-w-2xl mx-auto my-12 px-4">
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-100 space-y-4">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                            <Gift size={20} className="text-amber-600" />
                            <h2 className="text-xl font-serif font-bold text-stone-900">Presente(s) que vocês já escolheram</h2>
                        </div>

                        <p className="text-sm text-stone-500">
                            Obrigado por fazer parte do nosso novo lar! Aqui estão os presentes que sua família selecionou:
                        </p>

                        <div className="space-y-2">
                            {guestOrders.map((order: any) => (
                                <div
                                    key={order._id}
                                    className="flex items-center justify-between gap-3 bg-amber-50/60 border border-amber-200 rounded-xl p-3"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <Package size={18} className="text-amber-600 shrink-0" />
                                        <span className="font-semibold text-stone-800 text-sm truncate">
                                            {order.giftName}
                                        </span>
                                    </div>
                                    <span
                                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${order.status === 'recebido'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-amber-100 text-amber-800'
                                            }`}
                                    >
                                        {order.status === 'recebido' ? 'Recebido' : 'Pendente'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs text-stone-400 italic text-center pt-2">
                            Se precisar alterar algo, fale com os noivos. 💛
                        </p>
                    </div>
                </section>
            )}

            <section className="max-w-2xl mx-auto my-12 px-4">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-100 space-y-6">
                    <div className="text-center space-y-3">
                        <h2 className="text-2xl font-serif font-bold text-stone-900">Confirmação de Presença</h2>
                        <p className="text-sm text-stone-500">Selecione individualmente a presença de cada membro abaixo</p>

                        <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-center gap-2.5 text-xs md:text-sm text-amber-900 shadow-sm">
                            <Calendar size={16} className="text-amber-600 shrink-0" />
                            <span>Por favor, confirme sua presença até o dia <strong className="font-bold text-amber-950">24 de Outubro de 2026</strong>.</span>
                        </div>
                    </div>

                    {isLoadingGuest ? (
                        <div className="text-center py-6 text-stone-400 italic">Buscando convite da família...</div>
                    ) : (
                        <form onSubmit={handleFamilyRSVP} className="space-y-6">
                            <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200/60">
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Membros da {familyName}</label>

                                <div className="divide-y divide-stone-200/60">
                                    {familyMembers.map((member) => (
                                        <div
                                            key={member._id}
                                            onClick={() => !isSavingRsvp && toggleLocalMemberConfirmation(member._id)}
                                            className={`py-3 flex items-center justify-between group select-none ${isSavingRsvp ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                                        >
                                            <span className="font-medium text-stone-800 group-hover:text-stone-950 text-sm transition-colors">{member.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-semibold ${member.confirmed ? 'text-emerald-600' : 'text-stone-400'}`}>
                                                    {member.confirmed ? 'Confirmado' : 'Confirmar Presença👉'}
                                                </span>
                                                {member.confirmed ? (
                                                    <CheckSquare size={20} className="text-emerald-600 shrink-0" />
                                                ) : (
                                                    <Square size={20} className="text-stone-300 shrink-0 group-hover:text-stone-400" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Deixe uma mensagem para os Noivos (Opcional)</label>
                                <textarea
                                    value={rsvpMessage}
                                    disabled={isSavingRsvp}
                                    onChange={e => setRsvpMessage(e.target.value)}
                                    rows={3}
                                    placeholder="Escreva aqui seu carinho para o novo lar de vocês..."
                                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 disabled:opacity-60"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSavingRsvp}
                                className={`w-full font-bold py-4 px-6 rounded-2xl shadow-xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-3 relative overflow-hidden group ${isSavingRsvp
                                    ? 'bg-stone-400 text-stone-200 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-500 text-stone-950 shadow-amber-500/40 ring-4 ring-amber-400/30 animate-pulse cursor-pointer'
                                    }`}
                            >
                                {isSavingRsvp ? (
                                    <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-stone-950 border-t-transparent" />
                                        Enviando Confirmação...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} className="text-stone-950 animate-bounce shrink-0" />
                                        <span className="font-extrabold text-xs md:text-sm tracking-wider">Clique Aqui para Enviar sua Confirmação</span>
                                        <span className="animate-bounce shrink-0 text-base">👈</span>
                                    </>
                                )}
                            </button>

                            {rsvpSuccess && (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 flex items-center gap-2 text-sm justify-center animate-in fade-in zoom-in-95 duration-200">
                                    <CheckCircle size={18} className="text-emerald-600" />
                                    <span>Presenças e alterações atualizadas com sucesso! Obrigado!</span>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </section>

            <GiftList
                key={giftListKey}
                gifts={gifts}
                onSelectGift={handleSelectGift}
            />
        </div>
    );
}