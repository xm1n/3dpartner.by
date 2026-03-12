'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('ru-BY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);

const DELIVERY_OPTIONS = [
  { value: 'pickup', label: 'Самовывоз', cost: 0 },
  { value: 'courier', label: 'Курьер', cost: 10 },
  { value: 'europochta', label: 'Европочта', cost: 7 },
  { value: 'belpochta', label: 'Белпочта', cost: 5 },
] as const;

const PAYMENT_OPTIONS = [
  { value: 'card', label: 'Карта онлайн' },
  { value: 'erip', label: 'ЕРИП' },
  { value: 'invoice', label: 'Безналичный расчёт' },
  { value: 'cash', label: 'Наличные при самовывозе' },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'courier' | 'europochta' | 'belpochta'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'erip' | 'invoice' | 'cash'>('card');
  const [address, setAddress] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 && !success) {
      router.replace('/cart');
    }
  }, [items.length, success, router]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (deliveryMethod !== 'pickup' && paymentMethod === 'cash') {
      setPaymentMethod('card');
    }
  }, [deliveryMethod, paymentMethod]);

  const deliveryCost = DELIVERY_OPTIONS.find((o) => o.value === deliveryMethod)?.cost ?? 0;
  const total = totalPrice + deliveryCost;

  const paymentOptions = deliveryMethod === 'pickup'
    ? PAYMENT_OPTIONS
    : PAYMENT_OPTIONS.filter((o) => o.value !== 'cash');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const orderNumber = '3DP-' + Date.now().toString(36).toUpperCase();
    const orderItems = items.map((item) => ({
      product: Number(item.id),
      variantName: item.variant || undefined,
      quantity: item.quantity,
      unitPrice: item.price,
    }));

    const body = {
      orderNumber,
      status: 'new',
      customer: user?.id ? Number(user.id) : undefined,
      contactInfo: {
        firstName,
        lastName,
        email,
        phone,
      },
      items: orderItems,
      subtotal: totalPrice,
      deliveryCost,
      total,
      delivery: {
        method: deliveryMethod,
        address: deliveryMethod !== 'pickup' ? address : undefined,
      },
      payment: {
        method: paymentMethod,
        paid: false,
      },
      customerNote: customerNote || undefined,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.errors?.[0]?.message || data.message || res.statusText);
      }

      setSuccess(orderNumber);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при создании заказа');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !success) {
    return null;
  }

  if (success) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-[1400px]">
        <div className="max-w-xl mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-black text-emerald-600">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Заказ оформлен</h1>
          <p className="text-slate-600 mb-2">Номер заказа: <strong>{success}</strong></p>
          <p className="text-slate-500 text-sm mb-8">Мы свяжемся с вами для подтверждения</p>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-bold transition text-sm"
          >
            Мои заказы
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-16 max-w-[1400px]">
      <nav className="flex text-xs text-slate-500 mb-6 font-medium">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li><Link href="/" className="hover:text-slate-900 transition">Главная</Link></li>
          <li><span className="mx-1 text-slate-300">/</span></li>
          <li><Link href="/cart" className="hover:text-slate-900 transition">Корзина</Link></li>
          <li><span className="mx-1 text-slate-300">/</span></li>
          <li className="text-slate-900 font-semibold">Оформление</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-black text-slate-900 mb-8">Оформление заказа</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Контактные данные</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Имя</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Фамилия</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Доставка</h2>
            <div className="space-y-3">
              {DELIVERY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition has-[:checked]:border-slate-900 has-[:checked]:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={opt.value}
                    checked={deliveryMethod === opt.value}
                    onChange={() => setDeliveryMethod(opt.value)}
                    className="w-4 h-4 text-slate-900"
                  />
                  <span className="flex-1 font-medium">{opt.label}</span>
                  <span className="text-slate-600">
                    {opt.cost === 0 ? 'Бесплатно' : `${formatPrice(opt.cost)} BYN`}
                  </span>
                </label>
              ))}
            </div>
            {deliveryMethod !== 'pickup' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Адрес доставки</label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Город, улица, дом, квартира"
                />
              </div>
            )}
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Оплата</h2>
            <div className="space-y-3">
              {paymentOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition has-[:checked]:border-slate-900 has-[:checked]:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={paymentMethod === opt.value}
                    onChange={() => setPaymentMethod(opt.value)}
                    className="w-4 h-4 text-slate-900"
                  />
                  <span className="font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Комментарий</h2>
            <textarea
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Пожелания к заказу (необязательно)"
            />
          </section>
        </div>

        <aside className="lg:w-96 shrink-0">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sticky top-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Ваш заказ</h2>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="w-12 h-12 object-contain bg-slate-100 rounded shrink-0" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-200 rounded shrink-0 flex items-center justify-center text-slate-500 text-xs font-bold">
                      3D
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">{item.title}</div>
                    <div className="text-slate-500">
                      {item.quantity} × {formatPrice(item.price)} BYN
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 shrink-0">
                    {formatPrice(item.price * item.quantity)} BYN
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Товары</span>
                <span>{formatPrice(totalPrice)} BYN</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Доставка</span>
                <span>{deliveryCost === 0 ? 'Бесплатно' : `${formatPrice(deliveryCost)} BYN`}</span>
              </div>
            </div>
            <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between text-lg font-bold text-slate-900">
              <span>Итого</span>
              <span>{formatPrice(total)} BYN</span>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-6 py-3.5 rounded-lg font-bold transition text-sm"
            >
              {submitting ? 'Оформление...' : 'Подтвердить заказ'}
            </button>
          </div>
        </aside>
      </form>
    </main>
  );
}
