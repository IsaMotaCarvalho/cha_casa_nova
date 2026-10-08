'use client';

import { useState, useEffect } from 'react';
import { Gift, QrCode, AlertCircle, CheckCircle, X } from 'lucide-react';
import HeroHeader from '../components/HeroHeader';
import LocationCards from '../components/LocationCards';
import RSVPForm from '../components/RSVPForm';
import GiftList from '../components/GiftList';
import PixModal from '../components/PixModal';

export default function HomePage() {
    const [gifts, setGifts] = useState<any[]>([]);
    const [isPixModalOpen, setIsPixModalOpen] = useState(false);
    const [guestId, setGuestId] = useState<string | null>(null);

    const [giftListResetKey, setGiftListResetKey] = useState<number>(0);
    const [pendingSelection, setPendingSelection] = useState<{ gift: any; quantity: number; method: 'physical' | 'pix' } | null>(null);
    const [activeCartSummary, setActiveCartSummary] = useState<{ items: any[]; totalValue: number } | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [rsvpName, setRsvpName] = useState('');
    const [rsvpPhone, setRsvpPhone] = useState('');
    const [rsvpSide, setRsvpSide] = useState<'noivo' | 'noiva'>('noivo');
    const [rsvpMessage, setRsvpMessage] = useState('');
    const [rsvpSuccess, setRsvpSuccess] = useState(false);
    const [isLoadingGuest, setIsLoadingGuest] = useState(false);

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
                .then(data => {
                    if (data && !data.error) {
                        setRsvpName(data.name || '');
                        setRsvpPhone(data.phone || '');
                        setRsvpSide(data.side || 'noivo');
                        setRsvpMessage(data.message || '');
                        if (data.confirmed) setRsvpSuccess(true);
                    }
                })
                .catch(err => console.error('Erro ao buscar dados do convidado:', err))
                .finally(() => setIsLoadingGuest(false));
        }
    }, []);

    const handleRSVP = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/guests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: guestId,
                name: rsvpName,
                phone: rsvpPhone,
                side: rsvpSide,
                message: rsvpMessage,
                confirmed: true
            })
        });
        setRsvpSuccess(true);
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
                guestName: rsvpName || 'Convidado',
                guestPhone: rsvpPhone || '',
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

        setGiftListResetKey(prev => prev + 1);
        refreshGiftsFromServer();
    };

    const handleClearCart = () => {
        localStorage.removeItem('cha_casa_nova_cart');
        setActiveCartSummary(null);
        setGiftListResetKey(prev => prev + 1);
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

            <HeroHeader rsvpName={rsvpName} isLoadingGuest={isLoadingGuest} />
            <LocationCards />

            <RSVPForm
                rsvpName={rsvpName} setRsvpName={setRsvpName}
                rsvpPhone={rsvpPhone} setRsvpPhone={setRsvpPhone}
                rsvpSide={rsvpSide} setRsvpSide={setRsvpSide}
                rsvpMessage={rsvpMessage} setRsvpMessage={setRsvpMessage}
                rsvpSuccess={rsvpSuccess} isLoadingGuest={isLoadingGuest}
                onSubmit={handleRSVP}
            />

            <GiftList
                key={giftListResetKey}
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