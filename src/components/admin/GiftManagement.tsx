'use client';

import React, { useState } from 'react';
import { Plus, Trash, Edit2, X, Save, HelpCircle } from 'lucide-react';
import { compressImage } from '@/src/lib/compressImage';

function FieldTooltip({ text }: { text: string }) {
    const [show, setShow] = useState(false);
    return (
        <span className="relative inline-block ml-1.5 align-middle">
            <button
                type="button"
                onClick={(e) => { e.preventDefault(); setShow(!show); }}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className="text-amber-600 hover:text-amber-700 focus:outline-none cursor-pointer"
                title="Ajuda"
            >
                <HelpCircle size={14} />
            </button>
            {show && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl pointer-events-none text-center leading-tight">
                    {text}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
            )}
        </span>
    );
}

interface GiftManagementProps {
    gifts: any[];
    orders: any[];
    onAddGift: (giftForm: { name: string; totalPrice: number; totalQuotas: number; imageUrl?: string }) => Promise<void>;
    onDeleteItem: (route: 'gifts' | 'guests', id: string) => Promise<void>;
    onUpdateGift?: (id: string, updatedForm: { name: string; totalPrice: number; totalQuotas: number; imageUrl?: string }) => Promise<void>;
    onUpdateOrder?: (orderId: string, updatedFields: { quantity?: number; status?: string }) => Promise<void>;
    onDeleteOrder?: (orderId: string) => Promise<void>;
}

export default function GiftManagement({
    gifts,
    orders,
    onAddGift,
    onDeleteItem,
    onUpdateGift,
    onUpdateOrder,
    onDeleteOrder
}: GiftManagementProps) {
    const [form, setForm] = useState({ name: '', totalPrice: 0, totalQuotas: 1, imageUrl: '' });
    const [editingGift, setEditingGift] = useState<any | null>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressed = await compressImage(file, 600, 0.7);
                if (isEdit) {
                    setEditingGift({ ...editingGift, imageUrl: compressed });
                } else {
                    setForm({ ...form, imageUrl: compressed });
                }
            } catch (err) {
                console.error('Erro ao compactar imagem do presente:', err);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onAddGift(form);
        setForm({ name: '', totalPrice: 0, totalQuotas: 1, imageUrl: '' });
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onUpdateGift && editingGift) {
            await onUpdateGift(editingGift._id, {
                name: editingGift.name,
                totalPrice: editingGift.totalPrice,
                totalQuotas: editingGift.totalQuotas,
                imageUrl: editingGift.imageUrl || ''
            });
            setEditingGift(null);
        }
    };

    const editingGiftOrders = editingGift ? (orders || []).filter(o => o.giftId === editingGift._id) : [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Lista de Presentes para o Lar (presentes)</h1>

            {/* Form de Criação */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Nome do Item
                            <FieldTooltip text="Digite o nome do item para o lar (ex: Jogo de Panelas, Air Fryer, Jogo de Toalhas, etc.)." />
                        </label>
                        <input type="text" required placeholder="Ex: Air Fryer" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Valor Total (R$)
                            <FieldTooltip text="Informe o valor total do item. Se houver presentes, o valor de cada presente será calculado automaticamente." />
                        </label>
                        <input type="number" required value={form.totalPrice || ''} onChange={e => setForm({ ...form, totalPrice: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                            Quantidade de presentes
                            <FieldTooltip text="Número de partes em que o item será dividido para que os convidados possam contribuir." />
                        </label>
                        <input type="number" required min="1" value={form.totalQuotas} onChange={e => setForm({ ...form, totalQuotas: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                        Foto do Item (Opcional)
                        <FieldTooltip text="Envie uma imagem ilustrativa. Ela será compactada automaticamente para otimizar o carregamento." />
                    </label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, false)} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    {form.imageUrl && <p className="text-xs text-emerald-600 mt-1">✓ Foto carregada e compactada com sucesso!</p>}
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                        <Plus size={18} /> Adicionar Item
                    </button>
                </div>
            </form>

            {/* Grid de Presentes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gifts.map((gift) => {
                    const quotaValue = gift.totalPrice / gift.totalQuotas;
                    return (
                        <div key={gift._id} className="bg-white rounded-xl shadow-sm border border-slate-200 relative flex flex-col justify-between overflow-hidden">
                            {gift.imageUrl && (
                                <div className="w-full h-48 bg-slate-50 overflow-hidden relative p-3 flex items-center justify-center border-b border-slate-100">
                                    <img src={gift.imageUrl} alt={gift.name} className="w-full h-full object-contain object-center" />
                                </div>
                            )}
                            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-2 pr-10">{gift.name}</h4>
                                    <p className="text-sm text-slate-500">Valor Total: <span className="font-semibold text-slate-800">R$ {gift.totalPrice.toFixed(2)}</span></p>
                                    <p className="text-sm text-slate-500">Valor da presente: <span className="font-semibold text-indigo-600">R$ {quotaValue.toFixed(2)}</span></p>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                                        <span>Progresso das presentes</span>
                                        <span>{gift.claimedQuotas} / {gift.totalQuotas}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full transition-all" style={{ width: `${(gift.claimedQuotas / gift.totalQuotas) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-sm">
                                <button onClick={() => setEditingGift({ ...gift })} className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors" title="Editar">
                                    <Edit2 size={15} />
                                </button>
                                <button onClick={() => onDeleteItem('gifts', gift._id)} className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors" title="Excluir">
                                    <Trash size={15} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* MODAL SERVIÇO DE EDIÇÃO DE PRESENTE */}
            {editingGift && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h3 className="text-lg font-bold text-slate-800">Editar Item / presentes</h3>
                            <button onClick={() => setEditingGift(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Nome do Item
                                    <FieldTooltip text="Altere o nome do item conforme necessário." />
                                </label>
                                <input type="text" required value={editingGift.name} onChange={e => setEditingGift({ ...editingGift, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        Preço Total (R$)
                                        <FieldTooltip text="Atualize o valor total do item." />
                                    </label>
                                    <input type="number" required value={editingGift.totalPrice} onChange={e => setEditingGift({ ...editingGift, totalPrice: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                        presentes Totais
                                        <FieldTooltip text="Número total de presentes disponíveis para este item." />
                                    </label>
                                    <input type="number" required min={editingGift.claimedQuotas || 1} value={editingGift.totalQuotas} onChange={e => setEditingGift({ ...editingGift, totalQuotas: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Alterar Foto do Item
                                    <FieldTooltip text="Envie uma nova imagem para substituir a foto atual." />
                                </label>
                                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, true)} className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                {editingGift.imageUrl && (
                                    <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                                        <img src={editingGift.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            {/* SEÇÃO DINÂMICA: LISTAR E EDITAR SELEÇÕES DE CONVIDADOS NESSA presente */}
                            <div className="border-t border-slate-100 pt-3 mt-3">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Reservas Ativas deste Item</label>
                                {editingGiftOrders.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">Nenhum convidado reservou este item ainda.</p>
                                ) : (
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                        {editingGiftOrders.map((order) => (
                                            <div key={order._id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <p className="font-semibold text-slate-800 truncate">{order.guestName}</p>
                                                    <p className="text-slate-500">{order.guestPhone} • {order.quantity}x</p>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={order.quantity}
                                                        onChange={(e) => onUpdateOrder && onUpdateOrder(order._id, { quantity: Number(e.target.value) })}
                                                        className="w-12 px-1 py-0.5 border border-slate-300 rounded text-center font-bold text-slate-800 bg-white"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => onDeleteOrder && onDeleteOrder(order._id)}
                                                        className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                                        title="Remover reserva"
                                                    >
                                                        <Trash size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                <button type="button" onClick={() => setEditingGift(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg flex items-center gap-1.5"><Save size={16} /> Salvar Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}