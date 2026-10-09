"use client"
import { useState } from "react"

export default function TurnoLabLanding(){
  const [slugDemo, setSlugDemo] = useState("mojarra-style")

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');`}</style>
      <div className="min-h-screen bg-[#F6F5F2] text-[#0A0A0A]" style={{fontFamily:'Inter'}}>

        <nav className="max-w-[1100px] mx-auto px-6 py-6 flex justify-between items-center">
          <p className="font-black text-[14px] tracking-[0.3em]">TURNOLAB • RÍO CUARTO</p>
          <a href={`/b/${slugDemo}`} className="bg-black text-white rounded-full px-5 py-2.5 text-[10px] font-black tracking-widest hover:bg-zinc-800">VER DEMO EN VIVO →</a>
        </nav>

        {/* HERO */}
        <div className="max-w-[1100px] mx-auto px-6 pt-12 pb-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-[9px] font-black tracking-widest">● 100% AUTOMATIZADO • SIN WHATSAPP</div>
            <h1 className="mt-5 text-[58px] leading-[0.85] font-black tracking-[-0.05em]">TU BARBERÍA<br/>TRABAJA<br/>SOLA.</h1>
            <p className="mt-6 text-[15px] text-zinc-500 font-semibold leading-snug max-w-[420px]">El cliente reserva a las 3AM, el sistema bloquea el horario, te avisa por WhatsApp y te suma a la caja. Vos solo cortás.</p>
            <div className="mt-8 flex gap-3">
              <input value={slugDemo} onChange={e=>setSlugDemo(e.target.value.toLowerCase().replace(/\s/g,'-'))} placeholder="tu-barberia" className="bg-white border border-black/10 rounded-full px-6 py-4 text-sm font-bold w-[200px] outline-none shadow-sm" />
              <a href={`https://wa.me/5493584123456?text=Hola! Quiero TurnoLab para ${slugDemo}`} className="bg-black text-white rounded-full px-8 py-4 font-black text-[11px] tracking-widest">QUIERO MI LINK</a>
            </div>
          </div>
          <div className="bg-white rounded-[36px] p-3 shadow-[0_32px_64px_rgba(0,0,0,0.12)] border">
            <div className="bg-[#0A0A0A] rounded-[28px] p-7 text-white">
              <div className="flex justify-between"><p className="text-[10px] tracking-[0.3em] opacity-50 font-black">AUTOMATIZACIÓN ACTIVA</p><p className="text-[10px] bg-emerald-500 text-black px-2 py-1 rounded-full font-black">ON</p></div>
              <p className="text-[44px] font-black mt-4">$127.500</p>
              <p className="text-[11px] opacity-60 font-bold">CAJA DE HOY • 8 CONFIRMADOS</p>
              <div className="grid grid-cols-3 gap-2.5 mt-6">
                <div className="bg-white/10 rounded-[16px] p-3.5"><p className="text-[9px] opacity-50 font-black">BLOQUEO</p><p className="font-black text-[13px] mt-1">AUTO ✓</p></div>
                <div className="bg-white text-black rounded-[16px] p-3.5"><p className="text-[9px] opacity-50 font-black">AVISO WP</p><p className="font-black text-[13px] mt-1">AUTO ✓</p></div>
                <div className="bg-amber-400 text-black rounded-[16px] p-3.5"><p className="text-[9px] opacity-80 font-black">CAJA</p><p className="font-black text-[13px] mt-1">AUTO ✓</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* COMO FUNCIONA */}
        <div className="max-w-[1100px] mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-[28px] p-7 border">
              <p className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">1</p>
              <p className="font-black mt-4 text-[14px] tracking-wide">CLIENTE RESERVA SOLO</p>
              <p className="text-[13px] text-zinc-500 font-semibold mt-2 leading-snug">Entra a tu link, elige fecha y hora. El sistema bloquea el turno para que nadie más lo tome. Sin que vos hagas nada.</p>
            </div>
            <div className="bg-white rounded-[28px] p-7 border">
              <p className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">2</p>
              <p className="font-black mt-4 text-[14px] tracking-wide">TE LLEGA TODO AL PANEL</p>
              <p className="text-[13px] text-zinc-500 font-semibold mt-2 leading-snug">Checklist pro: Pendiente, Confirmado, Cobrado, Rechazado. Calendario con semáforo rojo/amarillo/verde.</p>
            </div>
            <div className="bg-black text-white rounded-[28px] p-7">
              <p className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-black text-[12px]">3</p>
              <p className="font-black mt-4 text-[14px] tracking-wide">COBRÁS Y VES TU CAJA</p>
              <p className="text-[13px] text-white/60 font-semibold mt-2 leading-snug">Marcás como COBRADO y se suma automático a tu caja diaria, mensual e histórica. Cero planilla.</p>
            </div>
          </div>
        </div>

        {/* BENEFICIOS */}
        <div className="bg-white border-y py-16">
          <div className="max-w-[1100px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[36px] font-black leading-[0.9] tracking-tight">DEJÁ DE PERDER<br/>PLATA Y TIEMPO.</h2>
              <div className="mt-8 space-y-4">
                {[
                  ["CERO CHAT BOT Y MENSAJES","Se acabó el 'tenés a las 17?' a las 11 de la noche. Tu link responde por vos."],
                  ["SIN DOBLE RESERVA NUNCA MÁS","Si un horario se ocupa, desaparece para los demás. Protección anti-pisada en tiempo real."],
                  ["CAJA AUTOMÁTICA REAL","No más cuaderno. Sabés cuánto hiciste hoy, este mes y en total con un click."],
                  ["PANEL PRIVADO CON CLAVE","Cada barbero tiene su clave. Tu competencia no ve tu caja. Vos entrás con tu llave maestra."],
                  ["100% TUYO, SIN COMISIONES","No es Fresha ni Treatwell. No te cobramos por turno. Pagás $15k fijo y listo."],
                ].map(([t,d])=>(
                  <div key={t} className="flex gap-3">
                    <span className="mt-1 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-black">✓</span>
                    <div><p className="font-black text-[12px] tracking-wide">{t}</p><p className="text-[12px] text-zinc-500 font-semibold mt-0.5">{d}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#F6F5F2] rounded-[32px] p-8 border">
              <p className="font-black text-[11px] tracking-[0.2em]">LO QUE DICEN EN RÍO CUARTO</p>
              <p className="mt-6 text-[18px] font-black leading-snug">"Antes perdía 2 horas por día contestando. Ahora me llegan los turnos solos y a la noche veo mi caja en 5 seg. Es otro negocio."</p>
              <p className="mt-4 text-[11px] font-black tracking-widest text-zinc-400">MOJARRA STYLE • RÍO CUARTO • CLIENTE #1</p>
              <a href={`/b/${slugDemo}`} className="mt-6 block w-full bg-black text-white rounded-full py-4 text-center font-black text-[11px] tracking-widest">VER SU PÁGINA REAL →</a>
            </div>
          </div>
        </div>

        {/* PRECIO */}
        <div className="bg-black text-white py-16">
          <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-[42px] font-black leading-none"> $65.000</h2>
              <p className="mt-2 text-white/50 font-bold text-[13px]">Tu link + Panel + Caja + Soporte Río Cuarto. Sin permanencia.</p>
            </div>
            <a href="https://wa.me/5493584123456?text=Hola%20Lacroix!%20Quiero%20TurnoLab%20Pro%20para%20mi%20barberia" className="bg-white text-black rounded-full px-10 py-5 font-black text-[12px] tracking-widest">QUIERO EMPEZAR HOY →</a>
          </div>
        </div>

        <footer className="py-10 text-center"><p className="text-[10px] tracking-[0.3em] font-black opacity-20">TURNOLAB • HECHO EN RÍO CUARTO • LACROIX DEV</p></footer>
      </div>
    </>
  )
}