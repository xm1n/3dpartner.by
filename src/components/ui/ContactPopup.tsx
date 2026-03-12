'use client'

import { useState } from 'react'
import type { Manager } from '@/lib/globals'
import { ChevronDown } from 'lucide-react'
import { CallbackRequestForm } from '@/components/ui/CallbackRequestForm'

type Props = {
  phone: string
  workingHours?: string
  email?: string
  telegram?: string
  whatsapp?: string
  managers?: Manager[]
}

export function ContactPopup({ phone, workingHours, email, telegram, whatsapp, managers }: Props) {
  const phoneClean = phone.replace(/[^\d+]/g, '')
  const [showCallbackForm, setShowCallbackForm] = useState(false)

  return (
    <div className="text-right hidden lg:block mr-2 relative group z-50">
      <div className="flex items-center gap-1.5 cursor-pointer py-2">
        <div className="font-bold text-sm text-slate-900 leading-none">{phone}</div>
        <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-transform duration-300 group-hover:rotate-180" />
      </div>
      {workingHours && (
        <div className="text-[10px] text-slate-500 font-medium tracking-wide">{workingHours}</div>
      )}

      <div className="absolute right-0 top-[100%] mt-2 w-[340px] bg-white border border-slate-200 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 overflow-hidden flex flex-col text-left">
        {/* Main phone + messengers */}
        <div className="bg-slate-50 p-5 border-b border-slate-100 flex items-start justify-between">
          <div>
            <a href={`tel:${phoneClean}`} className="text-xl font-black text-slate-900 hover:text-blue-600 transition block mb-1 leading-none">
              {phone}
            </a>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Сейчас работаем
            </p>
          </div>

          <div className="flex gap-2">
            {telegram && (
              <a href={telegram} target="_blank" rel="noopener noreferrer" title="Telegram" className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition flex items-center justify-center shadow-sm border border-blue-100">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z" /></svg>
              </a>
            )}
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition flex items-center justify-center shadow-sm border border-green-100">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 .002 5.383.002 12.03c0 2.126.551 4.195 1.6 6.02L.031 24l6.113-1.603c1.748.956 3.738 1.46 5.887 1.46 6.646 0 12.03-5.383 12.03-12.03S18.677 0 12.031 0zm6.185 17.382c-.261.737-1.503 1.425-2.091 1.488-.553.058-1.25.138-3.52-.803-2.73-1.13-4.506-3.92-4.644-4.103-.138-.184-1.11-1.472-1.11-2.81 0-1.337.691-1.99.94-2.266.248-.276.543-.346.728-.346s.368.005.53.013c.19.009.444-.075.696.533.264.639.873 2.128.95 2.285.076.157.126.342.033.526-.093.184-.139.3-.276.46-.139.16-.29.351-.415.475-.138.138-.282.29-.126.565.157.276.697 1.15 1.492 1.802.946.776 1.79 1.042 2.065 1.166.276.124.437.106.602-.083.166-.188.718-.834.912-1.12.194-.286.387-.238.636-.145.249.092 1.576.745 1.844.87.268.124.447.184.512.286.065.101.065.594-.196 1.33z" /></svg>
              </a>
            )}
          </div>
        </div>

        {/* Managers */}
        {managers && managers.length > 0 && (
          <div className="p-5">
            <p className="text-[11px] text-slate-400 font-bold mb-3 uppercase tracking-wider">Ваши персональные менеджеры:</p>
            <div className="flex flex-col gap-4">
              {managers.map((m, i) => (
                <div key={i} className="flex items-center gap-3 group/spec">
                  <div className="relative">
                    {m.photo?.url ? (
                      <img src={m.photo.url} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" alt={m.name} />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 text-xs font-bold">
                        {m.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                    )}
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${m.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-800 group-hover/spec:text-blue-600 transition">{m.name}</div>
                    <div className="text-[10px] text-slate-500">{m.department}</div>
                  </div>
                  {m.phone && (
                    <a href={`tel:${m.phone.replace(/[^\d+]/g, '')}`} className="text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition shrink-0">
                      {m.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer: email + callback */}
        <div className="bg-white px-5 pb-5 pt-1">
          {email && (
            <div className="flex items-center justify-between mb-4 border-t border-slate-100 pt-4">
              <p className="text-[11px] text-slate-400 font-medium">Электронная почта:</p>
              <a href={`mailto:${email}`} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">{email}</a>
            </div>
          )}
          <a href={`tel:${phoneClean}`} className="w-full mb-2 bg-white border border-slate-300 text-slate-800 font-bold py-2 rounded-lg text-xs transition shadow-sm block text-center hover:bg-slate-50">
            Позвонить
          </a>
          <button
            type="button"
            onClick={() => setShowCallbackForm(true)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs transition shadow-sm"
          >
            Заказать звонок
          </button>
        </div>
      </div>

      {/* Модальное окно заявки на звонок */}
      {showCallbackForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCallbackForm(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <CallbackRequestForm
              title="Заказать звонок"
              onSuccess={() => setShowCallbackForm(false)}
              onCancel={() => setShowCallbackForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
