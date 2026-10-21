"use client"
import Link from "next/link"

export default function DemoPage(){
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-900 font-sans">
      <div className="max-w-[600px] mx-auto p-6">
        
        <div className="text-center mt-8">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow">
            <span className="text-black font-black text-[14px]">TL</span>
          </div>
          <h1 className="mt-5 text-[28px] font-black tracking-tight text-white">TURNO LAB</h1>
          <p className="text-[10px] font-black tracking-[0.25em] text-zinc-500 mt-1">POR LACROIX DEV</p>
          <p className="mt-6 text-[13px] font-black tracking-tight leading-snug text-white max-w-[320px] mx-auto">EL SISTEMA QUE USAN LAS BARBERÍAS QUE NO QUIEREN PERDER MÁS TURNOS POR WHATSAPP.</p>
        </div>

        <div className="mt-10 bg-white rounded-[32px] p-3 shadow-2xl border border-zinc-100">
          <div className="bg-[#F6F5F2] rounded-[24px] p-7 text-center">
            <p className="text-[9px] font-black tracking-[0.2em] text-zinc-400">DEMO EN VIVO</p>
            <p className="text-[20px] font-black tracking-tight mt-2 text-black">MOJARRA STYLE</p>
            <div className="mt-6 flex flex-col gap-2">
              <Link href="/b/mojarra-style" className="bg-black text-white rounded-full py-4 font-black text-[11px] tracking-[0.2em] text-center hover:bg-zinc-800 transition">VER TURNERO DE CLIENTE →</Link>
              <Link href="/b/mojarra-style/admin" className="bg-white border border-black text-black rounded-full py-4 font-black text-[11px] tracking-[0.2em] text-center hover:bg-zinc-50 transition">VER PANEL DE BARBERO →</Link>
            </div>
            <p className="text-[9px] font-bold tracking-widest text-zinc-400 mt-4">CLAVE DEMO: mojarra123 o bigote123</p>
            <Link href="/b/mojarra-style" className="mt-3 inline-block text-[9px] font-black tracking-[0.2em] bg-white border px-3 py-1.5 rounded-full">← VOLVER AL TURNERO</Link>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-[11px] font-black tracking-[0.2em] ml-2 text-zinc-400 uppercase">Cómo funciona</p>
          <div className="mt-3 grid gap-3">
            {[
              { n: "01", t: "CLIENTE RESERVA SOLO", d: "Entra a tu link, elige día y hora, deja su WhatsApp. Sin llamarte." },
              { n: "02", t: "TE LLEGA EL TURNO", d: "Lo ves en tu panel con calendario y puntitos de colores." },
              { n: "03", t: "CONFIRMÁS Y COBRÁS", d: "1 click: Pendiente → Confirmado → Cobrado. Caja automática." },
            ].map(i=>(
              <div key={i.n} className="bg-white rounded-[24px] p-5 border border-zinc-100 shadow-sm flex gap-4">
                <span className="text-[10px] font-black tracking-widest text-zinc-400">{i.n}</span>
                <div><p className="font-black text-[12px] tracking-tight">{i.t}</p><p className="text-[11px] font-bold text-zinc-500 mt-1 leading-snug">{i.d}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-[28px] p-6 border border-zinc-100 shadow-sm">
          <p className="text-[11px] font-black tracking-[0.2em] uppercase">Qué te llevás</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {["LINK PERSONALIZADO","TURNOS ILIMITADOS","SIN COMISIONES","CAJA DIARIA","100% CELULAR","SOPORTE LACROIX"].map(x=>(
              <div key={x} className="bg-[#F6F5F2] rounded-full px-3 py-2.5 text-center"><p className="text-[9px] font-black tracking-[0.15em]">{x}</p></div>
            ))}
          </div>
          
          <div className="mt-6">
            <p className="text-[10px] font-black tracking-[0.2em] text-zinc-400">LINKS DEL SISTEMA</p>
            <div className="mt-3 bg-[#F6F5F2] rounded-[18px] p-4">
              <p className="text-[10px] font-black tracking-tight"><span className="text-zinc-400 tracking-[0.2em] text-[9px]">ADMIN MAESTRO:</span> /admin</p>
              <p className="text-[10px] font-black tracking-tight mt-2"><span className="text-zinc-400 tracking-[0.2em] text-[9px]">TURNERO CLIENTE:</span> /b/tu-barberia</p>
              <p className="text-[10px] font-black tracking-tight mt-2"><span className="text-zinc-400 tracking-[0.2em] text-[9px]">PANEL BARBERO:</span> /b/tu-barberia/admin</p>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-zinc-900 text-white rounded-[28px] p-7 shadow-xl text-center">
          <p className="text-[11px] font-black tracking-[0.2em] uppercase">¿Listo para activar tu barbería?</p>
          <p className="text-[11px] font-bold text-white/50 mt-2 leading-snug">Te lo dejo andando hoy con tu nombre, tu precio y tu logo.</p>
          <a href="https://wa.me/543584123456?text=Hola%20quiero%20Turno%20Lab%20para%20mi%20barberia" className="mt-5 w-full bg-white text-black rounded-full py-4 font-black text-[11px] tracking-[0.2em] inline-block text-center">HABLAR POR WHATSAPP →</a>
          <Link href="/b/mojarra-style" className="mt-4 inline-block text-[9px] font-black tracking-[0.2em] text-white/40">← VOLVER A LOS TURNOS</Link>
        </div>

        <p className="text-[9px] font-bold tracking-[0.2em] text-zinc-600 text-center mt-8 pb-10">• SOPORTE: LACROIX DEV • RÍO CUARTO •</p>

      </div>
    </div>
  )
}