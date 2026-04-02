"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  whatsappUrl: string;
  doctorName: string;
  heroImageUrl?: string;
}

export default function WhatsAppButton({ whatsappUrl, doctorName, heroImageUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [notif, setNotif] = useState(false);

  // Auto-show notification after 2s, auto-hide after 8s
  useEffect(() => {
    const show = setTimeout(() => setNotif(true), 2000);
    const hide = setTimeout(() => setNotif(false), 8000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  const openChat = () => { setOpen(true); setNotif(false); };
  const closeChat = () => setOpen(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">

      {/* Full chat card */}
      {open && (
        <div className="w-72 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.45)] border border-white/[0.08]">

          {/* Header */}
          <div className="relative bg-gradient-to-br from-[#075e54] to-[#054d44] px-4 py-3 flex items-center gap-3">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,211,102,0.15),transparent_60%)] pointer-events-none" />
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/25 shadow-md">
                {heroImageUrl ? (
                  <Image src={heroImageUrl} alt={doctorName} width={44} height={44} className="object-cover object-top w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] font-bold text-lg">
                    {doctorName.charAt(0)}
                  </div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] rounded-full border-2 border-[#075e54]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">{doctorName}</p>
              <p className="text-green-200/80 text-[11px] mt-0.5">Typically replies instantly</p>
            </div>
            <button
              onClick={closeChat}
              className="text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat bubble */}
          <div className="bg-[#111a14] px-4 pt-4 pb-3">
            <div className="flex items-end gap-2 mb-3">
              <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                {heroImageUrl ? (
                  <Image src={heroImageUrl} alt={doctorName} width={28} height={28} className="object-cover object-top w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] text-xs font-bold">
                    {doctorName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="bg-[#1a2e1a] border border-[#25d366]/10 rounded-2xl rounded-bl-sm px-3.5 py-2.5 max-w-[80%] shadow-sm">
                <p className="text-white/85 text-[13px] leading-relaxed">
                  👋 Hi there! I&apos;m {doctorName}.<br />
                  How can I help with your smile today?
                </p>
                <p className="text-white/25 text-[10px] mt-1 text-right">Now</p>
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-gtm-whatsapp="true"
              onClick={() => { (window as any).dataLayer = (window as any).dataLayer || []; (window as any).dataLayer.push({ event: 'whatsapp_click', click_location: 'floating_widget' }); }}
              className="flex items-center justify-center gap-2.5 w-full bg-[#25d366] hover:bg-[#1ebe5d] active:scale-95 text-white font-semibold text-[13px] py-3 rounded-xl transition-all duration-200 shadow-[0_4px_14px_rgba(37,211,102,0.35)] hover:shadow-[0_4px_20px_rgba(37,211,102,0.5)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.004 2C6.477 2 2 6.477 2 12.004c0 1.771.461 3.432 1.268 4.876L2 22l5.272-1.237A9.947 9.947 0 0012.004 22C17.53 22 22 17.523 22 12.004 22 6.477 17.53 2 12.004 2zm0 18.18a8.154 8.154 0 01-4.158-1.14l-.298-.177-3.129.734.772-3.038-.194-.312A8.154 8.154 0 013.82 12.004c0-4.512 3.672-8.184 8.184-8.184 4.512 0 8.184 3.672 8.184 8.184 0 4.511-3.672 8.176-8.184 8.176z" />
              </svg>
              Chat with Dr. Firas
            </a>
          </div>
        </div>
      )}

      {/* Notification bubble — auto-appears when chat is closed */}
      {notif && !open && (
        <div className="flex items-center gap-2 bg-white text-gray-800 text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={openChat}
        >
          <span className="w-2 h-2 rounded-full bg-[#25d366] flex-shrink-0 animate-pulse" />
          Chat with Dr. Firas
          <button
            onClick={(e) => { e.stopPropagation(); setNotif(false); }}
            className="ml-1 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Floating avatar button — always visible */}
      <button
        onClick={open ? closeChat : openChat}
        aria-label="Chat with Dr. Firas on WhatsApp"
        className="relative w-16 h-16 rounded-full shadow-[0_6px_30px_rgba(37,211,102,0.4)] border-[3px] border-[#25d366] overflow-hidden hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none"
      >
        {heroImageUrl ? (
          <Image src={heroImageUrl} alt={doctorName} fill className="object-cover object-top" />
        ) : (
          <div className="w-full h-full bg-[#0d0d0d] flex items-center justify-center text-[#c9a84c] font-bold text-xl">
            {doctorName.charAt(0)}
          </div>
        )}
        <span className="absolute bottom-0.5 right-0.5 w-5 h-5 bg-[#25d366] rounded-full flex items-center justify-center border-2 border-[#0d0d0d]">
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12.004 2C6.477 2 2 6.477 2 12.004c0 1.771.461 3.432 1.268 4.876L2 22l5.272-1.237A9.947 9.947 0 0012.004 22C17.53 22 22 17.523 22 12.004 22 6.477 17.53 2 12.004 2zm0 18.18a8.154 8.154 0 01-4.158-1.14l-.298-.177-3.129.734.772-3.038-.194-.312A8.154 8.154 0 013.82 12.004c0-4.512 3.672-8.184 8.184-8.184 4.512 0 8.184 3.672 8.184 8.184 0 4.511-3.672 8.176-8.184 8.176z" />
          </svg>
        </span>
        {!open && <span className="absolute inset-0 rounded-full animate-ping border border-[#25d366]/40 pointer-events-none" />}
      </button>
    </div>
  );
}
