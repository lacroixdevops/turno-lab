"use client"
import { useState, useEffect, useMemo } from "react"
import { supabase } from "../../lib/supabase"

type Turno = { id: string; client_name: string; client_lastname: string; client_phone: string; date: string; time: string; status: string }

export default function Admin() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [filter, setFilter] = useState("todos")
  const PRECIO = 18500

  const getHoyLocal = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }
  const hoyLocal = getHoyLocal()

  const fetchTurnos = async () => {
    const { data } = await supabase.from("appointments").select("*").order("date").order("time")
    if (data) setTurnos(data)
  }
  useEffect(() => { fetchTurnos() }, [])

  const changeStatus = async (id: string, newStatus: string) => {
    setTurnos(prev => prev.map(t => t.id === id? {...t, status: newStatus } : t))
    await supabase.from("appointments").update({ status: newStatus }).eq("id", id)
  }

  const deleteTurno = async (id: string) => {
    if (!confirm("¿Borrar turno?")) return
    setTurnos(prev => prev.filter(t => t.id!== id))
    await supabase.from("appointments").delete().eq("id", id)
  }

  const formatPlata = (n: number) => "$" + n.toLocaleString('es-AR')

  const stats = useMemo(() => {
    const atendidos = turnos.filter(t => t.status === "atendido")
    const hoyAtendidos = turnos.filter(t => t.date === hoyLocal && t.status === "atendido")
    const activos = turnos.filter(t => t.status!== "atendido" && t.status!== "cancelado")
    return {
      plataHoy: hoyAtendidos.length * PRECIO,
      plataTotal: atendidos.length * PRECIO,
      atendidosHoy: hoyAtendidos.length,
      atendidosTotal: atendidos.length,
      activosTotal: activos.length
    }
  }, [turnos, hoyLocal])

  const filtered = useMemo(() => {
    if (filter === "realizados") return turnos.filter(t => t.status === "atendido")
    if (filter === "hoy") return turnos.filter(t => t.date === hoyLocal && t.status!== "atendido" && t.status!== "cancelado")
    return turnos.filter(t => t.status!== "atendido" && t.status!== "cancelado")
  }, [turnos, filter, hoyLocal])

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400&family=Inter:wght@400;700&display=swap');`}</style>
      <div className="min-h-screen bg-[#151412] px-5 py-8 flex flex-col" style={{ fontFamily: 'Inter' }}>
        <div className="max-w-[480px] mx-auto w-full flex-1">
          <p className="text-[#E6D5B8]/30 text-[10px] tracking-[0.4em] font-bold">PANEL • {hoyLocal}</p>
          <h1 className="mt-2 text-[36px] leading-none text-[#E8E2D6]" style={{ fontFamily: 'Bodoni Moda' }}>Admin<br /><span className="italic text-[#E6D5B8]">turnos.</span></h1>
          <br />
          <a href="/admin/caja" className="w-full bg-[#E6D5B8] text-black rounded-full py-4 font-bold tracking-widest text-sm text-center block mb-6">
            IR A CAJA →
          </a>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-[#E6D5B8] rounded-[20px] p-5 text-black">
              <p className="text-[10px] font-bold opacity-50 tracking-widest">CAJA HOY</p>
              <p className="text-[22px] font-bold mt-1" style={{ fontFamily: 'Bodoni Moda' }}>{formatPlata(stats.plataHoy)}</p>
              <p className="text-[11px] opacity-60">{stats.atendidosHoy} realizados hoy</p>
            </div>
            <div className="bg-[#1E1C1A] border border-white/10 rounded-[20px] p-5">
              <p className="text-[10px] font-bold text-white/30 tracking-widest">CAJA TOTAL</p>
              <p className="text-[22px] font-bold mt-1 text-white" style={{ fontFamily: 'Bodoni Moda' }}>{formatPlata(stats.plataTotal)}</p>
              <p className="text-[11px] text-white/30">{stats.atendidosTotal} realizados total</p>
            </div>
          </div>

          <div className="flex gap-1 p-1 bg-[#1E1C1A] rounded-full border border-white/5 w-fit mt-6">
            <button onClick={() => setFilter("todos")} className={`px-5 py-2.5 rounded-full text-xs font-bold ${filter === "todos"? 'bg-white text-black' : 'text-white/30'}`}>Activos ({stats.activosTotal})</button>
            <button onClick={() => setFilter("hoy")} className={`px-5 py-2.5 rounded-full text-xs font-bold ${filter === "hoy"? 'bg-white text-black' : 'text-white/30'}`}>Hoy</button>
            <button onClick={() => setFilter("realizados")} className={`px-5 py-2.5 rounded-full text-xs font-bold ${filter === "realizados"? 'bg-[#E6D5B8] text-black' : 'text-white/30'}`}>Realizados ({stats.atendidosTotal})</button>
          </div>

          <div className="space-y-3 mt-5">
            {filtered.map(t => (
              <div key={t.id} className={`bg-[#1E1C1A] border rounded-[24px] p-5 ${t.status === 'atendido'? 'border-[#E6D5B8]/20 bg-[#E6D5B8]/5' : 'border-white/5'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] tracking-widest text-white/20 font-bold">CLIENTE</span>
                    <p className="text-white font-bold text-[17px] mt-1">{t.client_name} {t.client_lastname || ''}</p>
                  </div>
                  <span className={`text-[9px] px-3 py-1.5 rounded-full font-bold tracking-widest ${t.status === 'atendido'? 'bg-[#E6D5B8] text-black' : 'bg-amber-500/15 text-amber-200'}`}>{t.status.toUpperCase()}</span>
                </div>
                <div className="h-px bg-white/5 my-4"></div>
                <div className="space-y-2.5">
                  <div className="flex"><span className="text-[10px] tracking-widest text-white/20 font-bold w-[90px]">NOMBRE:</span><span className="text-white/80 text-[13px]">{t.client_name}</span></div>
                  <div className="flex"><span className="text-[10px] tracking-widest text-white/20 font-bold w-[90px]">APELLIDO:</span><span className="text-white/80 text-[13px]">{t.client_lastname || '-'}</span></div>
                  <div className="flex"><span className="text-[10px] tracking-widest text-white/20 font-bold w-[90px]">NÚMERO:</span><span className="text-white/80 text-[13px]">{t.client_phone}</span></div>
                  <div className="flex"><span className="text-[10px] tracking-widest text-white/20 font-bold w-[90px]">FECHA:</span><span className="text-white/80 text-[13px]">{t.date} • {t.time}hs</span></div>
                  <div className="flex"><span className="text-[10px] tracking-widest text-white/20 font-bold w-[90px]">DETALLE:</span><span className="text-white/80 text-[13px]">Corte Premium • {formatPlata(PRECIO)}</span></div>
                </div>
                <div className="flex gap-2 mt-5 pt-4 border-t border-white/5">
                  <select value={t.status} onChange={e => changeStatus(t.id, e.target.value)} className="flex-1 bg-[#252320] border border-white/10 rounded-full px-4 py-3 text-xs text-white outline-none">
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="atendido">Realizado ✓</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <a href={`https://wa.me/54${t.client_phone}?text=Hola ${t.client_name}!`} target="_blank" className="px-6 bg-[#25D366] text-black rounded-full flex items-center justify-center font-bold text-xs">WSP</a>
                  <button onClick={() => deleteTurno(t.id)} className="w-11 bg-white/5 text-white/20 rounded-full">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full text-center py-8 mt-16 border-t border-white/5">
          <p className="text-[10px] tracking-[0.3em] text-white/20 font-bold">ATELIER BARBER</p>
          <p className="text-[10px] text-white/30 mt-2">© 2026 Atelier Barber. Todos los derechos reservados.</p>
        </footer>
      </div>
    </>
  )
}