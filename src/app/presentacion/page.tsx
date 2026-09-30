"use client"
export default function Presentacion() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400&family=Inter:wght@400;700;900&display=swap');`}</style>
      <div className="min-h-screen bg-[#151412] text-white" style={{fontFamily:'Inter'}}>
        <div className="max-w-[480px] mx-auto px-6 py-10">

          <p className="text-[#E6D5B8] text-[10px] tracking-[0.4em] font-bold">SISTEMA PARA NEGOCIOS • RÍO CUARTO</p>
          <h1 className="text-[44px] leading-[0.9] mt-4" style={{fontFamily:'Bodoni Moda'}}>Tu negocio <br/><span className="italic text-[#E6D5B8]">trabaja solo.</span></h1>
          <p className="text-white/40 text-[14px] mt-4 leading-relaxed">Dejás de perder turnos por WhatsApp. El cliente reserva, vos solo atendés. Sistema probado en Atelier Barber.</p>

          {/* COMPARACION */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            <div className="bg-[#1E1C1A] border border-red-400/10 rounded-[20px] p-4">
              <p className="text-[10px] text-red-300/50 font-bold tracking-widest">ANTES</p>
              <p className="text-xs text-white/30 mt-2 leading-relaxed">WhatsApp explotado<br/>Doble turno<br/>No sabés caja<br/>Cliente no viene</p>
            </div>
            <div className="bg-[#E6D5B8] rounded-[20px] p-4 text-black">
              <p className="text-[10px] opacity-50 font-bold tracking-widest">DESPUÉS</p>
              <p className="text-xs mt-2 leading-relaxed font-bold">Reserva automática<br/>Hora bloqueada<br/>Caja calculada<br/>Aviso a tu WhatsApp</p>
            </div>
          </div>

          {/* QUE INCLUYE */}
          <div className="mt-6 bg-[#1E1C1A] border border-white/5 rounded-[24px] p-6">
            <p className="text-[10px] tracking-widest text-white/30 font-bold">QUÉ TE ENTREGO (EN 48HS)</p>
            <div className="mt-4 space-y-3">
              <div className="flex gap-3"><span className="text-[#E6D5B8]">✓</span><p className="text-sm text-white/70">Página de reservas con tu logo y colores</p></div>
              <div className="flex gap-3"><span className="text-[#E6D5B8]">✓</span><p className="text-sm text-white/70">Panel admin privado + caja diaria</p></div>
              <div className="flex gap-3"><span className="text-[#E6D5B8]">✓</span><p className="text-sm text-white/70">QR para tu vidriera / Instagram</p></div>
              <div className="flex gap-3"><span className="text-[#E6D5B8]">✓</span><p className="text-sm text-white/70">Link para bio de Instagram</p></div>
              <div className="flex gap-3"><span className="text-[#E6D5B8]">✓</span><p className="text-sm text-white/70">Sin comisiones por turno</p></div>
            </div>
          </div>

          {/* PARA QUIEN */}
          <div className="mt-6">
            <p className="text-[10px] tracking-widest text-white/20 font-bold">FUNCIONA PARA</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Barberías","Peluquerías","Uñas","Pestañas","Centros estética","Tatuajes","Gym / Entrenadores"].map(r=>(
                <span key={r} className="bg-[#1E1C1A] border border-white/5 rounded-full px-4 py-2 text-[11px] text-white/50">{r}</span>
              ))}
            </div>
          </div>

          {/* DEMO */}
          <div className="mt-8 border border-[#E6D5B8]/20 rounded-[24px] p-6">
            <p className="text-[#E6D5B8] text-[10px] tracking-widest font-bold">DEMO REAL EN VIVO</p>
            <p className="text-sm mt-2 font-bold">Atelier Barber - Caso de éxito</p>
            <div className="flex gap-2 mt-4">
              <a href="/" className="flex-1 bg-white text-black rounded-full py-3.5 text-xs font-black text-center">VER CLIENTE</a>
              <a href="/admin/caja" className="flex-1 bg-[#1E1C1A] border border-white/10 rounded-full py-3.5 text-xs font-bold text-center">VER CAJA</a>
            </div>
            <p className="text-[10px] text-white/20 mt-3 text-center">Probalo vos mismo, reservá un turno de prueba</p>
          </div>

          {/* PRECIOS */}
          <div className="mt-8">
            <h2 className="text-[30px] leading-none" style={{fontFamily:'Bodoni Moda'}}>Inversión <span className="text-[#E6D5B8]">única.</span></h2>
            <div className="mt-5 bg-white text-black rounded-[24px] p-6">
              <p className="text-[10px] tracking-widest opacity-40 font-bold">PACK COMPLETO</p>
              <p className="text-[36px] font-black mt-1" style={{fontFamily:'Bodoni Moda'}}>$150 USD</p>
              <p className="text-xs opacity-50">o $180.000 ARS • Pago único</p>
              <div className="h-px bg-black/10 my-4"></div>
              <p className="text-xs">Luego solo $20 USD / mes de mantenimiento (hosting, dominio y soporte). Cancelás cuando querés.</p>
              <p className="text-[11px] mt-3 bg-black text-white rounded-full px-3 py-1 w-fit">⚡ Entrega en 48hs</p>
            </div>
          </div>

          <a href="https://wa.me/5493586021014?text=Hola!%20Vi%20la%20presentacion%20del%20sistema,%20quiero%20para%20mi%20local" className="mt-8 w-full bg-[#E6D5B8] text-black rounded-full py-5 font-black tracking-widest text-sm text-center block">
            QUIERO PARA MI LOCAL →
          </a>

          <div className="mt-6 flex justify-center gap-4 text-[10px] text-white/20">
            <span>✓ Sin apps</span><span>✓ Sin comisión</span><span>✓ 100% tuyo</span>
          </div>

          <footer className="w-full text-center py-8 mt-8 border-t border-white/5">
            <p className="text-[10px] tracking-[0.3em] text-white/20 font-bold">ATELIER SYSTEM</p>
            <p className="text-[10px] text-white/20 mt-2">© 2026 • Río Cuarto • Córdoba</p>
          </footer>
        </div>
      </div>
    </>
  )
}