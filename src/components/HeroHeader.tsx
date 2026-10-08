'use client';

interface HeroHeaderProps {
    rsvpName?: string;
    isLoadingGuest?: boolean;
}

export default function HeroHeader({ rsvpName, isLoadingGuest }: HeroHeaderProps) {
    return (
        <div className="relative min-h-[55vh] md:min-h-[65vh] flex items-center justify-center border-b border-stone-200 overflow-hidden shadow-xl">

            {/* Imagem de fundo como <img> absoluta — não depende de CSS background */}
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
                    <SparklesIcon />
                    <span>
                        {isLoadingGuest
                            ? 'Carregando convite...'
                            : rsvpName
                                ? `Olá, ${rsvpName}! Convidamos você para nosso Chá de Casa Nova`
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
                                <CalendarIcon /> 31 de Outubro de 2026
                            </span>
                            <span className="text-amber-500">•</span>
                            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                                <ClockIcon /> 17:00h
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Ícones SVG inline (evita depender de lucide-react importado por fora)
function SparklesIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 animate-spin">
            <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    );
}