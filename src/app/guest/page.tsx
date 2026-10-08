'use client';

import { useState, useEffect } from 'react';
import { Gift, QrCode, AlertCircle, CheckCircle, X, CheckSquare, Square, Sparkles, Calendar, Clock } from 'lucide-react';
import LocationCards from '@/src/components/LocationCards';
import GiftList from '@/src/components/GiftList';
import PixModal from '@/src/components/PixModal';

export default function GuestPage() {
    const [gifts, setGifts] = useState<any[]>([]);
    const [isPixModalOpen, setIsPixModalOpen] = useState(false);
    const [guestId, setGuestId] = useState<string | null>(null);

    const [giftListKey, setGiftListKey] = useState(0);
    const [pendingSelection, setPendingSelection] = useState<{ gift: any; quantity: number; method: 'physical' | 'pix' } | null>(null);
    const [activeCartSummary, setActiveCartSummary] = useState<{ items: any[]; totalValue: number } | null>(null);
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
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setGifts(data);
            })
            .catch(err => console.error('Erro ao buscar presentes:', err));
    };

    useEffect(() => {
        refreshGiftsFromServer();

        const savedCart = localStorage.getItem('cha_casa_nova_cart');
        if (savedCart) {
            try {
                setActiveCartSummary(JSON.parse(savedCart));
            } catch (e) {
                console.error('Erro ao ler carrinho local:', e);
            }
        }

        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (id) {
            setGuestId(id);
            setIsLoadingGuest(true);

            fetch(`/api/guests?id=${id}`)
                .then(res => res.json())
                .then(async (data) => {
                    if (data && !data.error) {
                        setFamilyName(data.name || '');
                        setFamilyPhone(data.phone || '');
                        setFamilySide(data.side || 'noivo');
                        setFamilyMembers(data.members || []);
                        setRsvpMessage(data.message || '');

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

    const handleSelectGiftOption = (gift: any, quantity: number, method: 'physical' | 'pix') => {
        setPendingSelection({ gift, quantity, method });
    };

    const handleConfirmSelection = async () => {
        if (!pendingSelection) return;

        const { gift, quantity, method } = pendingSelection;
        const quotaValue = gift.totalPrice / gift.totalQuotas;
        const totalItemPrice = quotaValue * quantity;

        await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                guestName: familyName || 'Convidado',
                guestPhone: familyPhone || '',
                giftId: gift._id,
                giftName: gift.name,
                quantity: quantity,
                quotaValue: quotaValue,
                totalValue: totalItemPrice,
                method: method
            })
        });

        if (method === 'pix') {
            const structureSummary = {
                items: [{
                    giftId: gift._id,
                    name: gift.name,
                    quantity: quantity,
                    quotaValue: quotaValue,
                    totalItemPrice: totalItemPrice
                }],
                totalValue: totalItemPrice
            };
            setActiveCartSummary(structureSummary);
            localStorage.setItem('cha_casa_nova_cart', JSON.stringify(structureSummary));
            setPendingSelection(null);
            setIsPixModalOpen(true);
        } else {
            setPendingSelection(null);
            setSuccessMessage(`Obrigado! Sua intenção de presentear com "${gift.name}" foi registrada com sucesso! 🏠✨`);
            setTimeout(() => setSuccessMessage(null), 6000);
        }

        setGiftListKey(prev => prev + 1);
        refreshGiftsFromServer();
    };

    const handleClearCart = () => {
        localStorage.removeItem('cha_casa_nova_cart');
        setActiveCartSummary(null);
        setGiftListKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-amber-100 relative pt-12">

            {activeCartSummary && (
                <div className="fixed top-0 inset-x-0 bg-stone-900 text-stone-100 px-4 py-2.5 text-xs md:text-sm z-50 shadow-md border-b border-amber-500/20 flex items-center justify-between animate-in slide-in-from-top duration-300">
                    <div className="flex items-center gap-2 max-w-[70%]">
                        <Gift className="text-amber-400 shrink-0" size={16} />
                        <p className="truncate">
                            Você escolheu presentear com PIX no valor total de <span className="font-bold text-amber-400">R$ {activeCartSummary.totalValue.toFixed(2)}</span>.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsPixModalOpen(true)}
                            className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                        >
                            <QrCode size={12} /> Ver PIX
                        </button>
                        <button onClick={handleClearCart} className="text-stone-400 hover:text-stone-200 text-[11px] underline cursor-pointer">
                            Remover
                        </button>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="fixed top-16 inset-x-4 max-w-xl mx-auto bg-emerald-600 text-white p-4 rounded-2xl shadow-xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle size={24} className="shrink-0" />
                    <p className="text-sm font-medium">{successMessage}</p>
                </div>
            )}

            {/* HERO SECTION COM IMAGEM COMO <img> ABSOLUTA */}
            <div className="relative min-h-[55vh] md:min-h-[65vh] flex items-center justify-center border-b border-stone-200 overflow-hidden shadow-xl">

                {/* Imagem de fundo como <img> real — não depende de CSS background */}
                <img
                    src="/cha.jpeg"
                    alt="Chá de Casa Nova"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ zIndex: 0 }}
                />

                {/* Overlay escuro para legibilidade do texto */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/40 to-stone-950/80"
                    style={{ zIndex: 1 }}
                />

                {/* Conteúdo por cima */}
                <div className="relative w-full max-w-4xl mx-auto px-6 py-16 text-center space-y-8" style={{ zIndex: 2 }}>

                    {/* Badge de Saudação */}
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

                    {/* Nomes dos Anfitriões */}
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

                    {/* Frase Inspiradora */}
                    <blockquote className="max-w-xl mx-auto">
                        <p className="text-stone-200/90 font-serif italic text-base md:text-lg tracking-wide drop-shadow-md">
                            &ldquo;Cada cantinho do nosso lar vai guardar um pedacinho de vocês.&rdquo;
                        </p>
                    </blockquote>

                    {/* Data Oficial do Chá */}
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

            <section className="max-w-2xl mx-auto my-12 px-4">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-stone-100 space-y-6">
                    <div className="text-center space-y-3">
                        <h2 className="text-2xl font-serif font-bold text-stone-900">Confirmação de Presença</h2>
                        <p className="text-sm text-stone-500">Selecione individualmente a presença de cada membro abaixo</p>

                        {/* Alerta de Prazo Limite */}
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
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Deixe uma mensagem para os anfitriões (Opcional)</label>
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
                onSelectGiftOption={handleSelectGiftOption}
            />

            {pendingSelection && (
                <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-6 border border-stone-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                            <div className="flex items-center gap-2 text-stone-800 font-serif font-bold text-lg">
                                <AlertCircle size={20} className="text-amber-600" />
                                <h3>Confirmar Presente?</h3>
                            </div>
                            <button onClick={() => setPendingSelection(null)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-stone-600">
                                {pendingSelection.method === 'physical'
                                    ? `Você confirmou que irá presentear com "${pendingSelection.gift.name}" (${pendingSelection.quantity} presente(s)). Os anfitriões serão avisados!`
                                    : `Você escolheu contribuir via PIX para "${pendingSelection.gift.name}" (${pendingSelection.quantity} presente(s)).`}
                            </p>

                            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/60 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500">Presente:</span>
                                    <span className="font-semibold text-stone-900">{pendingSelection.gift.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500">Quantidade:</span>
                                    <span className="font-semibold text-stone-800">{pendingSelection.quantity} presente(s)</span>
                                </div>
                                <div className="flex justify-between text-sm border-t border-stone-200 pt-2 font-bold">
                                    <span className="text-stone-800">Valor Total:</span>
                                    <span className="text-amber-900">
                                        R$ {((pendingSelection.gift.totalPrice / pendingSelection.gift.totalQuotas) * pendingSelection.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPendingSelection(null)}
                                className="w-full py-3 border border-stone-200 text-stone-600 font-medium rounded-xl text-xs hover:bg-stone-50 transition-colors uppercase tracking-wider cursor-pointer"
                            >
                                Voltar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSelection}
                                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition-colors shadow-md uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <CheckCircle size={16} /> Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <PixModal
                isOpen={isPixModalOpen}
                onClose={() => setIsPixModalOpen(false)}
                cartData={activeCartSummary}
                pixKey={process.env.NEXT_PUBLIC_PIX_KEY}
            />
        </div>
    );
}