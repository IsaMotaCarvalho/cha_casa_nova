'use client';

import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import HeroHeader from '../components/HeroHeader';
import LocationCards from '../components/LocationCards';
import RSVPForm from '../components/RSVPForm';
import GiftList from '../components/GiftList';

export default function HomePage() {
    const [gifts, setGifts] = useState<any[]>([]);
    const [guestId, setGuestId] = useState<string | null>(null);

    const [giftListResetKey, setGiftListResetKey] = useState<number>(0);
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

    const handleSelectGift = async (gift: any) => {
        await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                guestName: rsvpName || 'Convidado',
                guestPhone: rsvpPhone || '',
                giftId: gift._id,
                giftName: gift.name,
                message: rsvpMessage || ''
            })
        });

        setSuccessMessage(`Obrigado! Você escolheu o presente "${gift.name}". 🏠✨`);
        setTimeout(() => setSuccessMessage(null), 6000);

        setGiftListResetKey(prev => prev + 1);
        refreshGiftsFromServer();
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-amber-100 relative pt-12">

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
                onSelectGift={handleSelectGift}
            />
        </div>
    );
}