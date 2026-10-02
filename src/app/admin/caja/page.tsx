"use client"
import { useState, useEffect, useMemo } from "react"
import { supabase } from "../../../lib/supabase"

const PRECIO_CORTE = 18500

export default function CajaDiaria() {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [turnos, setTurnos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [turnosMes, setTurnosMes] = useState<any[]>([])

  useEffect(() => { cargarCaja() }, [fecha])
  useEffect(() => { cargarMes() }, [currentMonth])

  async function cargarCaja() {
    setLoading(true)
    const { data } = await supabase.from("appointments").select("*").eq("date", fecha).order("time", { ascending: true })
    setTurnos(data || [])
    setLoading(false)
  }

  async function cargarMes() {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const first = `${year}-${String(month+1).padStart(2,'0')}-01`
    const last = `${year}-${String(month+1).padStart(2,'0')}-${String(new Date(year, month+1, 0).getDate()).padStart(2,'0')}`
    const { data } = await supabase.from("appointments").select("date,status").gte("date", first).lte("date", last)
    setTurnosMes(data || [])
  }

  const total = turnos.length * PRECIO_CORTE
  const cobrados = turnos.filter(t => t.status === 'cobrado' || t.status === 'atendido').length
  const totalCobrado = cobrados * PRECIO_CORTE

  async function marcarCobrado(id: string) {
    await supabase.from("appointments").update({ status: 'cobrado' }).eq("id", id)
    cargarCaja(); cargarMes()
  }

  async function borrarCaja() {
    if(!confirm(`¿Borrar toda la caja del ${fecha.split('-').reverse().join('/')}?`)) return
    if(prompt(`Escribí BORRAR para confirmar`)!== 'BORRAR') return
    await supabase.from("appointments").delete().eq("date", fecha)
    setTurnos([]); cargarMes()
  }

  async function borrarUno(id: string) {
    if(!confirm("¿Borrar este turno?")) return
    await supabase.from("appointments").delete().eq("id", id)
    cargarCaja(); cargarMes()
  }

  const ocupadosPorDia = useMemo(() => {
    const map: Record<string, number> = {}
    turnosMes.forEach(t => { if(t.status!=='cancelado') map[t.date] = (map[t.date] || 0) + 1 })
    return map
  }, [turnosMes])

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
          <h3 className="font-black text-sm capitalize">{currentMonth.toLocaleDateString('es-AR',{month:'long', year:'numeric'})}</h3>
          <div className="flex gap-2">
            <button onClick={()=>setCurrentMonth(new Date(year, month-1, 1))} className="w-8 h-8 rounded-full bg-[#F6F5F2] border border-black/5 font-bold">‹</button>
            <button onClick={()=>setCurrentMonth(new Date(year, month+1, 1))} className="w-8 h-8 rounded-full bg-[#F6F5F2] border border-black/5 font-bold">›</button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center text-[10px] font-black text-black/20 mb-2">
          <div>L</div><div>M</div><div>X</div><div>J</div><div>V</div><div>S</div><div>D</div>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d, idx) => {
            if(d===null) return <div key={idx} />
            const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
            const count = ocupadosPorDia[iso] || 0
            const cerrado = new Date(year, month, d).getDay()===0 || new Date(year, month, d).getDay()===1
            const isSelected = fecha===iso
            let bg = 'bg-[#F6F5F2]'
            if(count>0 &&!cerrado &&!isSelected){
              if(count >= 12) bg = 'bg-red-50 border-red-200'
              else if(count >= 6) bg = 'bg-amber-50 border-amber-200'
              else bg = 'bg-emerald-50 border-emerald-200'
            }
            return (
              <button key={idx} disabled={cerrado} onClick={()=>setFecha(iso)} className={`h-[52px] rounded-2xl border flex flex-col items-center justify-center text-xs font-black transition-all ${cerrado? 'opacity-20 border-transparent bg-transparent' : ''} ${isSelected? 'bg-[#0A0A0A]! text-white! border-[#0A0A0A]! shadow-lg' : `${bg} border-black/5 text-black/60`}`}>
                {d}
                {!cerrado && count>0 &&!isSelected && <span className="text-[8px] mt-1 font-bold">${(count*PRECIO_CORTE/1000).toFixed(0)}k</span>}
                {cerrado && <span className="text-[7px] mt-1">CERR</span>}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');`}</style>
      <div className="min-h-screen bg-[#F6F5F2] text-[#0A0A0A] flex flex-col" style={{fontFamily:'Inter'}}>
        <div className="w-full bg-[#0A0A0A] text-white">
          <div className="max-w-[500px] mx-auto px-5 py-6 flex items-center justify-between">
            <p className="text-[10px] tracking-[0.4em] font-black">ATELIER • CAJA</p>
            <a href="/admin" className="text-white/50 text-[10px] font-black tracking-widest border border-white/10 rounded-full px-3 py-1">← ADMIN</a>
          </div>
        </div>

        <div className="max-w-[500px] mx-auto w-full flex-1 px-5 py-8">
          <h1 className="text-[36px] leading-[0.9] font-black">Caja<br/>Diaria.</h1>

          <div className="mt-6">
            {renderCalendario()}
          </div>

          <div className="mt-4 flex items-center justify-between bg-[#0A0A0A] text-white rounded-full px-5 py-3">
            <p className="text-[10px] font-black tracking-widest opacity-50">FECHA SELECCIONADA</p>
            <p className="text-sm font-black">{fecha.split('-').reverse().join('/')}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-[#0A0A0A] text-white rounded-[24px] p-5 shadow-[0_12px_24px_rgba(0,0,0,0.15)]">
              <p className="text-[10px] tracking-widest font-black opacity-50">TOTAL DÍA</p>
              <p className="text-3xl font-black mt-2">${total.toLocaleString('es-AR')}</p>
              <p className="text-xs mt-1 opacity-60">{turnos.length} turnos</p>
            </div>
            <div className="bg-white border border-black/5 rounded-[24px] p-5 shadow-sm">
              <p className="text-[10px] tracking-widest font-black text-black/30">COBRADO</p>
              <p className="text-3xl font-black mt-2">${totalCobrado.toLocaleString('es-AR')}</p>
              <p className="text-xs mt-1 text-black/40">{cobrados} cobrados</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] tracking-widest text-black/30 font-black">TURNOS {fecha.split('-').reverse().join('/')}</h2>
              {turnos.length > 0 && <button onClick={borrarCaja} className="text-red-500 text-[10px] border border-red-200 bg-red-50 px-3 py-1 rounded-full font-black">BORRAR DÍA</button>}
            </div>
            {loading? <p className="text-black/20 mt-4 font-bold">Cargando...</p> :
              turnos.length === 0? <div className="mt-4 bg-white border border-black/5 rounded-[20px] p-8 text-center text-black/20 text-sm font-bold">No hay turnos</div> :
              <div className="space-y-2 mt-3">
                {turnos.map(t => (
                  <div key={t.id} className={`bg-white border rounded-full px-5 py-4 flex justify-between items-center shadow-sm ${t.status==='cobrado' || t.status==='atendido'? 'border-emerald-200' : 'border-black/5'}`}>
                    <div><p className="text-sm font-black">{t.time.slice(0,5)} - {t.client_name}</p><p className="text-[10px] text-black/30 font-bold">{t.client_phone}</p></div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black">${PRECIO_CORTE.toLocaleString('es-AR')}</span>
                      {t.status==='cobrado' || t.status==='atendido'? <span className="bg-[#0A0A0A] text-white text-[10px] px-3 py-1 rounded-full font-black">COBRADO</span> : <button onClick={()=>marcarCobrado(t.id)} className="bg-[#0A0A0A] text-white text-[10px] px-4 py-2 rounded-full font-black">COBRAR</button>}
                      <button onClick={()=>borrarUno(t.id)} className="w-7 h-7 bg-black/5 rounded-full text-black/20 font-black">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}