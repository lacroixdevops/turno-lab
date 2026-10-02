"use client"
export default function Presentacion() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');`}</style>
      <div className="min-h-screen bg-[#F6F5F2] text-[#0A0A0A]" style={{fontFamily:'Inter'}}>
        <div className="w-full bg-[#0A0A0A] text-white">
          <div className="max-w-[480px] mx-auto px-6 py-6 flex items-center justify-between">
            <p className="text-[10px] tracking-[0.4em] font-black">ATELIER SYSTEM • RÍO CUARTO</p>
            <a href="https://wa.me/5493586021014" className="text-[9px] font-black tracking-widest border border-white/10 rounded-full px-3 py-1.5">WSP</a>
          </div>
        </div>

        <div className="max-w-[480px] mx-auto px-6 py-10">

          <h1 className="text-[44px] leading-[0.85] font-black tracking-[-0.03em]">Tu negocio <br/><span className="font-light">trabaja solo.</span></h1>
          <p className="text-black/40 text-[14px] mt-4 leading-relaxed font-semibold">Dejás de perder turnos por WhatsApp. El cliente reserva, vos solo atendés. Sistema probado en Atelier Barber.</p>

          {/* COMPARACION */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            <div className="bg-white border border-black/5 rounded-[20px] p-4 shadow-sm">
              <p className="text-[10px] text-red-400 font-black tracking-widest">ANTES</p>
              <p className="text-xs text-black/40 mt-2 leading-relaxed font-bold">WhatsApp explotado<br/>Doble turno<br/>No sabés caja<br/>Cliente no viene</p>
            </div>
            <div className="bg-[#0A0A0A] rounded-[20px] p-4 text-white shadow-[0_12px_24px_rgba(0,0,0,0.15)]">
              <p className="text-[10px] opacity-50 font-black tracking-widest">DESPUÉS</p>
              <p className="text-xs mt-2 leading-relaxed font-bold">Reserva automática<br/>Hora bloqueada<br/>Caja calculada<br/>Aviso a tu WhatsApp</p>
            </div>
          </div>

          {/* QUE INCLUYE */}
          <div className="mt-6 bg-white border border-black/5 rounded-[24px] p-6 shadow-sm">
            <p className="text-[10px] tracking-[0.2em] text-black/30 font-black">QUÉ TE ENTREGO (EN 48HS)</p>
            <div className="mt-4 space-y-3">
              {[
                "Página de reservas con tu logo y colores",
                "Panel admin privado + caja diaria con calendario",
                "QR para tu vidriera / Instagram",
                "Link para bio de Instagram",
                "Sin comisiones por turno"
              ].map(t=>(
                <div key={t} className="flex gap-3"><span className="w-5 h-5 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[10px] font-black">✓</span><p className="text-sm text-black/70 font-bold">{t}</p></div>
              ))}
            </div>
          </div>

          {/* PARA QUIEN */}
          <div className="mt-6">
            <p className="text-[10px] tracking-[0.2em] text-black/30 font-black">FUNCIONA PARA</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Barberías","Peluquerías","Uñas","Pestañas","Centros estética","Tatuajes","Gym / Entrenadores"].map(r=>(
                <span key={r} className="bg-white border border-black/5 rounded-full px-4 py-2 text-[11px] text-black/60 font-bold shadow-sm">{r}</span>
              ))}
            </div>
          </div>

          {/* DEMO */}
          <div className="mt-8 bg-white border border-black/5 rounded-[24px] p-6 shadow-sm">
            <p className="text-[#0A0A0A] text-[10px] tracking-[0.2em] font-black">DEMO REAL EN VIVO</p>
            <p className="text-sm mt-2 font-black">Atelier Barber - Caso de éxito</p>
            <p className="text-[12px] text-black/40 font-bold mt-1">Mirá cómo lo usa el cliente y cómo ves la caja vos</p>
            <div className="flex gap-2 mt-4">
              <a href="/" className="flex-1 bg-[#0A0A0A] text-white rounded-full py-3.5 text-xs font-black text-center shadow">VER CLIENTE</a>
              <a href="/admin" className="flex-1 bg-[#F6F5F2] border border-black/5 rounded-full py-3.5 text-xs font-black text-center">VER ADMIN</a>
            </div>
            <p className="text-[10px] text-black/20 mt-3 text-center font-bold">Probalo vos mismo, reservá un turno de prueba</p>
          </div>

          {/* PRECIOS */}
          <div className="mt-8">
            <h2 className="text-[32px] leading-none font-black tracking-[-0.02em]">Inversión <span className="font-light">única.</span></h2>
            <div className="mt-5 bg-[#0A0A0A] text-white rounded-[24px] p-6 shadow-[0_12px_24px_rgba(0,0,0,0.15)]">
              <p className="text-[10px] tracking-widest opacity-40 font-black">PACK COMPLETO</p>
              <p className="text-[36px] font-black mt-1">$150 USD</p>
              <p className="text-xs opacity-50 font-bold">o $180.000 ARS • Pago único</p>
              <div className="h-px bg-white/10 my-4"></div>
              <p className="text-xs leading-relaxed opacity-70">Luego solo $20 USD / mes de mantenimiento (hosting, dominio y soporte). Cancelás cuando querés.</p>
              <p className="text-[11px] mt-4 bg-white text-black rounded-full px-3 py-1.5 w-fit font-black">⚡ Entrega en 48hs</p>
            </div>
          </div>

          <a href="https://wa.me/5493586021014?text=Hola!%20Vi%20la%20presentacion%20del%20sistema,%20quiero%20para%20mi%20local" className="mt-8 w-full bg-[#0A0A0A] text-white rounded-full py-5 font-black tracking-widest text-sm text-center block shadow-[0_12px_24px_rgba(0,0,0,0.15)]">
            QUIERO PARA MI LOCAL →
          </a>

          <div className="mt-6 flex justify-center gap-4 text-[10px] text-black/20 font-black">
            <span>✓ Sin apps</span><span>✓ Sin comisión</span><span>✓ 100% tuyo</span>
          </div>

          <footer className="w-full text-center py-8 mt-8 border-t border-black/5">
            <p className="text-[10px] tracking-[0.3em] text-black/20 font-black">ATELIER SYSTEM • RÍO CUARTO</p>
          </footer>
        </div>
      </div>
    </>
  )
}