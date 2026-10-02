"use client"
import { useState, useEffect, useMemo } from "react"
import { supabase } from "../../lib/supabase"

type Turno = { id: string; client_name: string; client_lastname: string; client_phone: string; date: string; time: string; status: string }

export default function Admin() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [filter, setFilter] = useState("todos")
  const [selectedCalendarDate, setSelectedCalendarDate] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
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
    if (selectedCalendarDate) return turnos.filter(t => t.date === selectedCalendarDate && t.status!== "cancelado")
    if (filter === "realizados") return turnos.filter(t => t.status === "atendido")
    if (filter === "hoy") return turnos.filter(t => t.date === hoyLocal && t.status!== "atendido" && t.status!== "cancelado")
    return turnos.filter(t => t.status!== "atendido" && t.status!== "cancelado")
  }, [turnos, filter, hoyLocal, selectedCalendarDate])

  // CALENDARIO
  const ocupadosPorDia = useMemo(() => {
    const map: Record<string, number> = {}
    turnos.forEach(t => { if(t.status!=='cancelado') map[t.date] = (map[t.date] || 0) + 1 })
    return map
  }, [turnos])

  const renderCalendario = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDayWeek = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month+1, 0).getDate()
    const startOffset = firstDayWeek === 0? 6 : firstDayWeek - 1
    const days: (number|null)[] = []
    for(let i=0;i<startOffset;i++) days.push(null)
    for(let d=1; d<=daysInMonth; d++) days.push(d)

    return (
      <div className="bg-white border border-black/5 rounded-[24px] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-sm capitalize tracking-tight">{currentMonth.toLocaleDateString('es-AR',{month:'long', year:'numeric'})}</h3>
          <div className="flex gap-2">
            <button onClick={()=>setCurrentMonth(new Date(year, month-1, 1))} className="w-8 h-8 rounded-full bg-[#F6F5F2] border border-black/5 font-bold">‹</button>
            <button onClick={()=>setCurrentMonth(new Date(year, month+1, 1))} className="w-8 h-8 rounded-full bg-[#F6F5F2] border border-black/5 font-bold">›</button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center text-[10px] tracking-widest font-black text-black/20 mb-2">
          <div>L</div><div>M</div><div>X</div><div>J</div><div>V</div><div>S</div><div>D</div>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d, idx) => {
            if(d===null) return <div key={idx} />
            const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
            const count = ocupadosPorDia[iso] || 0
            const diaSemana = new Date(year, month, d).getDay()
            const cerrado = diaSemana===0 || diaSemana===1
            let dot = null
            if(!cerrado && count>0){
              if(count >= 14) dot = <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              else if(count >= 10) dot = <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              else dot = <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            }
            const isSelected = selectedCalendarDate===iso
            return (
              <button key={idx} disabled={cerrado} onClick={()=>setSelectedCalendarDate(iso)} className={`h-[52px] rounded-2xl border flex flex-col items-center justify-center text-xs font-black transition-all ${cerrado? 'opacity-20 bg-transparent border-transparent' : ''} ${isSelected? 'bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-lg' : 'bg-[#F6F5F2] border-black/5 text-black/60 hover:border-black/10'} ${iso===hoyLocal &&!isSelected? 'border-black' : ''}`}>
                {d}
                <span className="mt-1 h-1.5 flex items-center">{cerrado? <span className="text-[7px]">CERR</span> : dot}</span>
              </button>
            )
          })}
        </div>
        {selectedCalendarDate && (
          <button onClick={()=>setSelectedCalendarDate("")} className="w-full mt-4 bg-[#0A0A0A] text-white rounded-full py-2.5 text-xs font-black">VER TODOS • {turnos.length}</button>
        )}
        <div className="flex gap-3 mt-3 text-[9px] font-bold text-black/30">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Libre</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"/> Casi</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"/> Lleno</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');`}</style>
      <div className="min-h-screen bg-[#F6F5F2] text-[#0A0A0A] flex flex-col" style={{ fontFamily: 'Inter' }}>
        <div className="w-full bg-[#0A0A0A] text-white">
          <div className="max-w-[480px] mx-auto px-5 py-6 flex items-center justify-between">
            <p className="text-[10px] tracking-[0.4em] font-black">ATELIER • ADMIN</p>
            <p className="text-[10px] tracking-widest opacity-50">{hoyLocal.split('-').reverse().join('/')}</p>
          </div>
        </div>

        <div className="max-w-[480px] mx-auto w-full flex-1 px-5 py-8">
          <h1 className="text-[36px] leading-[0.9] font-black tracking-[-0.02em]">Panel de<br/>turnos<span className="font-light">.</span></h1>

          <a href="/admin/caja" className="w-full bg-[#0A0A0A] text-white rounded-full py-4 font-black tracking-widest text-sm text-center block mt-6 shadow-[0_12px_24px_rgba(0,0,0,0.15)]">IR A CAJA →</a>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-[#0A0A0A] rounded-[20px] p-5 text-white">
              <p className="text-[10px] font-black opacity-50 tracking-widest">CAJA HOY</p>
              <p className="text-[22px] font-black mt-1">{formatPlata(stats.plataHoy)}</p>
              <p className="text-[11px] opacity-60">{stats.atendidosHoy} realizados hoy</p>
            </div>
            <div className="bg-white border border-black/5 rounded-[20px] p-5 shadow-sm">
              <p className="text-[10px] font-black text-black/30 tracking-widest">CAJA TOTAL</p>
              <p className="text-[22px] font-black mt-1">{formatPlata(stats.plataTotal)}</p>
              <p className="text-[11px] text-black/30">{stats.atendidosTotal} realizados total</p>
            </div>
          </div>

          {/* CALENDARIO NUEVO */}
          <div className="mt-6">
            <p className="text-[10px] tracking-[0.2em] text-black/30 font-black ml-1 mb-3">CALENDARIO DE TURNOS</p>
            {renderCalendario()}
          </div>

          <div className="flex gap-1 p-1 bg-white rounded-full border border-black/5 w-fit mt-6 shadow-sm">
            <button onClick={() => {setFilter("todos"); setSelectedCalendarDate("")}} className={`px-5 py-2.5 rounded-full text-xs font-black ${filter === "todos" &&!selectedCalendarDate? 'bg-[#0A0A0A] text-white shadow' : 'text-black/30'}`}>Activos ({stats.activosTotal})</button>
            <button onClick={() => {setFilter("hoy"); setSelectedCalendarDate("")}} className={`px-5 py-2.5 rounded-full text-xs font-black ${filter === "hoy" &&!selectedCalendarDate? 'bg-[#0A0A0A] text-white shadow' : 'text-black/30'}`}>Hoy</button>
            <button onClick={() => {setFilter("realizados"); setSelectedCalendarDate("")}} className={`px-5 py-2.5 rounded-full text-xs font-black ${filter === "realizados" &&!selectedCalendarDate? 'bg-[#0A0A0A] text-white shadow' : 'text-black/30'}`}>Realizados ({stats.atendidosTotal})</button>
          </div>

          <div className="mt-3">
            <p className="text-[10px] tracking-[0.2em] text-black/30 font-black ml-1 mb-3">
              {selectedCalendarDate? `TURNOS DEL ${selectedCalendarDate.split('-').reverse().join('/')} • ${filtered.length}` : `LISTA ${filter.toUpperCase()} • ${filtered.length}`}
            </p>
            <div className="space-y-3">
              {filtered.map(t => (
                <div key={t.id} className={`bg-white border rounded-[24px] p-5 shadow-sm ${t.status === 'atendido'? 'border-emerald-200 bg-emerald-50/30' : 'border-black/5'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] tracking-widest text-black/20 font-black">CLIENTE</span>
                      <p className="text-black font-black text-[17px] mt-1">{t.client_name} {t.client_lastname || ''}</p>
                    </div>
                    <span className={`text-[9px] px-3 py-1.5 rounded-full font-black tracking-widest ${t.status === 'atendido'? 'bg-[#0A0A0A] text-white' : 'bg-amber-100 text-amber-800'}`}>{t.status.toUpperCase()}</span>
                  </div>
                  <div className="h-px bg-black/5 my-4"></div>
                  <div className="space-y-2.5">
                    <div className="flex"><span className="text-[10px] tracking-widest text-black/20 font-black w-[90px]">TEL:</span><span className="text-black/70 text-[13px] font-bold">{t.client_phone}</span></div>
                    <div className="flex"><span className="text-[10px] tracking-widest text-black/20 font-black w-[90px]">FECHA:</span><span className="text-black/70 text-[13px] font-bold">{t.date.split('-').reverse().join('/')} • {t.time}hs</span></div>
                    <div className="flex"><span className="text-[10px] tracking-widest text-black/20 font-black w-[90px]">SERVICIO:</span><span className="text-black/70 text-[13px]">Corte Premium • {formatPlata(PRECIO)}</span></div>
                  </div>
                  <div className="flex gap-2 mt-5 pt-4 border-t border-black/5">
                    <select value={t.status} onChange={e => changeStatus(t.id, e.target.value)} className="flex-1 bg-[#F6F5F2] border border-black/5 rounded-full px-4 py-3 text-xs text-black outline-none font-bold">
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="atendido">Realizado ✓</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                    <a href={`https://wa.me/54${t.client_phone}?text=Hola ${t.client_name}! Te confirmo tu turno del ${t.date.split('-').reverse().join('/')} a las ${t.time} en Atelier Barber`} target="_blank" className="px-6 bg-[#0A0A0A] text-white rounded-full flex items-center justify-center font-black text-xs">WSP</a>
                    <button onClick={() => deleteTurno(t.id)} className="w-11 bg-black/5 text-black/20 rounded-full font-black">✕</button>
                  </div>
                </div>
              ))}
              {filtered.length===0 && <div className="bg-white border border-black/5 rounded-[24px] p-10 text-center text-black/20 text-sm font-bold">No hay turnos {selectedCalendarDate? `para el ${selectedCalendarDate.split('-').reverse().join('/')}` : 'en este filtro'}</div>}
            </div>
          </div>
        </div>

        <footer className="w-full text-center py-8 mt-16 border-t border-black/5 bg-white">
          <p className="text-[10px] tracking-[0.3em] text-black/20 font-black">ATELIER BARBER • MAR A SAB 9-12 / 16-20</p>
        </footer>
      </div>
    </>
  )
}