'use client';

import React from 'react';
import { Home, MapPin } from 'lucide-react';

export default function LocationCards() {
    return (
        <section className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col gap-4 text-center items-center hover:shadow-md transition-shadow">
                <div className="p-3 bg-amber-50 rounded-full text-amber-700"><Home size={24} /></div>
                <h3 className="text-xl font-bold font-serif text-stone-900">Local do Chá de Casa Nova</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                    Quiosque do Clube dos Funcionários Públicos Municipais<br />
                    Presidente Epitácio - SP
                </p>
                <a
                    href="https://maps.app.goo.gl/k47nbaiHfHaGJE3G9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-amber-700 underline tracking-wider uppercase flex items-center gap-1 mt-2 hover:text-amber-600 transition-colors"
                >
                    <MapPin size={14} /> Ver no Mapa
                </a>
            </div>
        </section>
    );
}