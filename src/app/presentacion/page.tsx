"use client"
import { useState } from "react"

export default function Presentacion() {
  const wsp = "5493586021014" // <-- CAMBIA ESTE POR TU NUMERO
  const precio = 15000

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');`}</style>
      <div className="min-h-screen bg-[#F6F5F2] text-[#0A0A0A]" style={{fontFamily:'Inter'}}>
        {/* HEADER */}
        <div className="w-full bg-[#0A0A0A] text-white">
          <div className="max-w-[760px] mx-auto px-5 py-6 flex justify-between items-center">
            <p className="text-[11px] tracking-[0.4em] font-black">TURNO LAB</p>
            <a href={`https://wa.me/${wsp}?text=Hola! Quiero mi barberia online`} className="text-[10px] tracking-widest font-black bg-white text-black px-4 py-2 rounded-full">HABLAR POR WSP</a>
          </div>
        </div>

        <div className="max-w-[760px] mx-auto px-5 py-10">
          {/* HERO */}
          <h1 className="text-[52px] leading-[0.85] font-black tracking-[-0.04em]">Dejá de perder<br/>turnos por<br/>WhatsApp<span className="font-light">.</span></h1>
          <p className="mt-4 text-[15px] text-black/50 font-bold leading-relaxed max-w-[420px]">Tus clientes reservan solos 24/7. Vos solo cortás el pelo. Sin cuaderno, sin llamadas, sin líos. Como Atelier y Lacroix ya lo usan en Río Cuarto.</p>

          <div className="mt-6 flex gap-3">
            <a href={`https://wa.me/${wsp}?text=Hola! Quiero mi barberia en TurnoLab por $${precio}/mes`} className="bg-[#0A0A0A] text-white rounded-full px-7 py-4 font-black text-sm tracking-widest shadow-[0_12px_24px_rgba(0,0,0,0.15)]">QUIERO MI BARBERIA →</a>
            <a href="/b/atelier" target="_blank" className="bg-white border border-black/5 rounded-full px-7 py-4 font-black text-sm shadow-sm text-[#0A0A0A]">Ver demo</a>
          </div>

          {/* COMO FUNCIONA */}
          <div className="mt-14">
            <p className="text-[10px] tracking-[0.2em] text-black/30 font-black">COMO FUNCIONA</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="bg-white border border-black/5 rounded-[24px] p-6 shadow-sm">
                <p className="text-[40px] font-black leading-none">01</p>
                <p className="font-black mt-3 text-[#0A0A0A]">Link propio</p>
                <p className="text-[13px] text-black/40 font-bold mt-1">Te creamos /b/tu-barberia en 5 minutos. Lo mandás a tus clientes.</p>
              </div>
              <div className="bg-white border border-black/5 rounded-[24px] p-6 shadow-sm">
                <p className="text-[40px] font-black leading-none">02</p>
                <p className="font-black mt-3 text-[#0A0A0A]">Reservan solos</p>
                <p className="text-[13px] text-black/40 font-bold mt-1">Eligen día y hora. No te pueden reservar 2 a la misma hora. Te llega WSP.</p>
              </div>
              <div className="bg-[#0A0A0A] rounded-[24px] p-6 text-white shadow-[0_12px_24px_rgba(0,0,0,0.15)]">
                <p className="text-[40px] font-black leading-none">03</p>
                <p className="font-black mt-3">Vos solo cobrás</p>
                <p className="text-[13px] text-white/50 font-bold mt-1">Ves tu caja diaria, calendario con días llenos y agenda filtrada.</p>
              </div>
            </div>
          </div>

          {/* DEMO VIVO */}
          <div className="mt-12 bg-white border border-black/5 rounded-[32px] p-7 shadow-sm">
            <p className="text-[10px] tracking-[0.2em] text-black/30 font-black">DEMO REAL EN USO HOY</p>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center bg-[#F6F5F2] rounded-full px-5 py-4 border border-black/5">
                <div>
                  <p className="font-black text-sm text-[#0A0A0A]">Atelier Barber</p>
                  <p className="text-[11px] text-black/40 font-bold">/b/atelier • 59 días restantes</p>
                </div>
                <a href="/b/atelier" target="_blank" className="bg-[#0A0A0A] text-white rounded-full px-4 py-2 text-xs font-black">Ver Barbería</a>
              </div>
              <div className="flex justify-between items-center bg-[#F6F5F2] rounded-full px-5 py-4 border border-black/5">
                <div>
                  <p className="font-black text-sm text-[#0A0A0A]">Barbería Lacroix</p>
                  <p className="text-[11px] text-black/40 font-bold">/b/barberia-lacroix • 59 días restantes</p>
                </div>
                <a href="/b/barberia-lacroix" target="_blank" className="bg-[#0A0A0A] text-white rounded-full px-4 py-2 text-xs font-black">Ver Barbería</a>
              </div>
            </div>
          </div>

          {/* PRECIO */}
          <div className="mt-12 bg-[#0A0A0A] rounded-[32px] p-8 text-white text-center shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
            <p className="text-[10px] tracking-[0.4em] font-black opacity-50">PRECIO LANZAMIENTO RIO CUARTO</p>
            <p className="text-[56px] font-black leading-none mt-3">${precio.toLocaleString('es-AR')}<span className="text-[18px] font-bold opacity-60">/mes</span></p>
            <p className="text-[13px] opacity-60 font-bold mt-2">Sin comisión por turno • Sin contrato • Cancelás cuando querés</p>
            <p className="text-[11px] opacity-40 font-bold mt-1">Te lo dejo activo en 5 minutos</p>
            <a href={`https://wa.me/${wsp}?text=Hola! Quiero activar mi barberia por $${precio}/mes. Mi barberia se llama:`} className="inline-block mt-6 bg-white text-black rounded-full px-8 py-4 font-black text-sm tracking-widest">ACTIVAR MI BARBERIA POR WSP →</a>
          </div>

          <p className="text-center text-[10px] tracking-[0.3em] text-black/20 font-black mt-10">TURNO LAB • HECHO EN RIO CUARTO • 2026</p>
        </div>
      </div>
    </>
  )
}