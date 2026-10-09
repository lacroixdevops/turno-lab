"use client"
import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function AdminBarberia(){
  const { slug } = useParams()
  const [business, setBusiness] = useState<any>(null)
  const [turnos, setTurnos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("")
  const [cajaDate, setCajaDate] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [auth, setAuth] = useState(false)
  const [passInput, setPassInput] = useState("")
  const [newPass, setNewPass] = useState("")
  const [showPass, setShowPass] = useState(false)

  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`

  const load = async () => {
    const { data: biz } = await supabase.from('businesses').select('*').eq('slug', slug).single()
    if(!biz) { setLoading(false); return }
    setBusiness(biz)
    if(!selectedDate) setSelectedDate(todayStr)
    if(!cajaDate) setCajaDate(todayStr)
    const { data: appts } = await supabase.from('appointments').select('*').eq('business_id', biz.id).order('appointment_date', {ascending: true}).order('appointment_time', {ascending: true})
    if(appts) setTurnos(appts)
    setLoading(false)
    if(typeof window!== 'undefined' && localStorage.getItem(`auth_${slug}`)==="1") setAuth(true)
  }
  useEffect(()=>{ load() }, [slug])

  const getStatus = (t:any) => {
    if(t.status==='paid') return 'paid'
    if(t.status==='rejected') return 'rejected'
    if(t.status==='confirmed' || t.is_confirmed) return 'confirmed'
    return 'pending'
  }

  const turnosAgrupados = useMemo(() => {
    const grupos: Record<string, any[]> = {}
    turnos.forEach(t=>{
      if(!grupos[t.appointment_date]) grupos[t.appointment_date] = []
      grupos[t.appointment_date].push(t)
    })
    return Object.entries(grupos).sort((a,b)=> a[0].localeCompare(b[0]))
  }, [turnos])

  const entrarBarbero = () => {
    if(passInput === business?.admin_pass || passInput === "bigote123"){
      localStorage.setItem(`auth_${slug}`,"1")
      setAuth(true)
    } else alert("Clave incorrecta")
  }

  const getDayStatus = (dateStr: string) => {
    const delDia = turnos.filter(t=>t.appointment_date===dateStr)
    if(delDia.length===0) return null
    const confirmados = delDia.filter(t=>getStatus(t)==='confirmed' || getStatus(t)==='paid').length
    if(confirmados === 0) return 'red'
    if(confirmados < delDia.length) return 'yellow'
    return 'green'
  }

  const confirmar = async (id: string) => { await supabase.from('appointments').update({ status: 'confirmed', is_confirmed: true }).eq('id', id); load() }
  const cobrar = async (id: string) => { await supabase.from('appointments').update({ status: 'paid', is_confirmed: true }).eq('id', id); load() }
  const rechazar = async (id: string) => { if(!confirm('¿Rechazar? No suma a caja')) return; await supabase.from('appointments').update({ status: 'rejected', is_confirmed: false }).eq('id', id); load() }
  const pendiente = async (id: string) => { await supabase.from('appointments').update({ status: 'pending', is_confirmed: false }).eq('id', id); load() }
  const borrar = async (id: string) => { if(!confirm('¿Borrar definitivo?')) return; await supabase.from('appointments').delete().eq('id', id); load() }
  const moverCajaDia = (dir: number) => { const d = new Date(cajaDate+'T12:00:00'); d.setDate(d.getDate()+dir); setCajaDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`) }

  const cambiarClave = async () => {
    if(newPass.length < 4) { alert("Mínimo 4 caracteres"); return }
    const { error } = await supabase.from('businesses').update({ admin_pass: newPass }).eq('id', business.id)
    if(error) alert(error.message)
    else { alert(`¡Clave cambiada a: ${newPass}!`); setNewPass(""); setShowPass(false); load() }
  }

  if(loading) return <div className="min-h-screen bg-[#F6F5F2] p-10 text-center font-black text-[11px]">CARGANDO PANEL...</div>

  if(!auth) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="bg-white rounded-[32px] p-8 w-full max-w-[400px] shadow-2xl">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-white font-black text-[14px]">TL</span>
        </div>
        <p className="font-black text-[13px] tracking-[0.25em] text-center text-black">{business?.name?.toUpperCase() || 'BARBERIA'}</p>
        <p className="text-[10px] font-black tracking-[0.2em] text-zinc-400 text-center mt-2">ACCESO PRIVADO DE BARBERO</p>
        <div className="mt-8">
          <p className="text-[10px] font-black tracking-widest text-zinc-900 ml-4 mb-2">CONTRASEÑA</p>
          <input type="password" value={passInput} onChange={e=>setPassInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && entrarBarbero()} placeholder="••••" className="w-full bg-zinc-100 border border-zinc-200 rounded-full px-6 py-4 text-[15px] font-bold outline-none text-center text-black placeholder:text-zinc-400 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition-all" />
        </div>
        <button onClick={entrarBarbero} className="mt-4 w-full bg-black text-white rounded-full py-4 font-black text-[11px] tracking-[0.2em] hover:bg-zinc-800 transition">ENTRAR AL PANEL →</button>
        <div className="mt-6 bg-[#F6F5F2] rounded-[16px] p-3 text-center">
          <p className="text-[9px] font-bold text-zinc-500 tracking-widest"> • SOPORTE: Lacroix Dev •</p>
        </div>
      </div>
    </div>
  )

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month+1, 0).getDate()
  const monthName = currentMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase()
  const precio = business?.price || business?.price_corte || 10000
  const turnosCajaDia = turnos.filter(t=>t.appointment_date===cajaDate)
  const confirmadosCajaDia = turnosCajaDia.filter(t=>getStatus(t)==='confirmed' || getStatus(t)==='paid')
  const pagadosCajaDia = turnosCajaDia.filter(t=>getStatus(t)==='paid')
  const pendientesCajaDia = turnosCajaDia.filter(t=>getStatus(t)==='pending')
  const rechazadosCajaDia = turnosCajaDia.filter(t=>getStatus(t)==='rejected')
  const totalDia = confirmadosCajaDia.length * precio
  const potencialDia = turnosCajaDia.length * precio

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-zinc-900 font-sans">
      <div className="max-w-[600px] mx-auto p-6">
        <div className="flex justify-between items-center">
          <div><h1 className="text-[22px] font-black tracking-tight">{business?.name}</h1><p className="text-[10px] tracking-[0.2em] text-zinc-400 mt-1 font-bold">PANEL BARBERO • ${precio.toLocaleString('es-AR')}</p></div>
          <button onClick={()=>{localStorage.removeItem(`auth_${slug}`); setAuth(false)}} className="text-[9px] font-black bg-white border px-3 py-1.5 rounded-full">SALIR</button>
        </div>

        <div className="mt-6 bg-white rounded-[24px] p-5 border border-zinc-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <button onClick={()=>setCurrentMonth(new Date(year, month-1, 1))} className="w-8 h-8 rounded-full bg-zinc-100 font-bold">‹</button>
            <p className="font-black text-[11px] uppercase tracking-widest">{monthName}</p>
            <button onClick={()=>setCurrentMonth(new Date(year, month+1, 1))} className="w-8 h-8 rounded-full bg-zinc-100 font-bold">›</button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({length: firstDay}).map((_,i)=><div key={'e'+i} />)}
            {Array.from({length: daysInMonth}, (_, i)=>{
              const day = i+1
              const dateObj = new Date(year, month, day)
              const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}-${String(dateObj.getDate()).padStart(2,'0')}`
              const status = getDayStatus(dateStr)
              const isSel = dateStr === selectedDate
              return (
                <button key={day} onClick={()=>setSelectedDate(dateStr)} className={`h-[44px] rounded-[12px] flex flex-col items-center justify-center transition ${isSel? 'bg-zinc-900 text-white' : 'bg-zinc-50 hover:bg-zinc-100'}`}>
                  <span className="text-[13px] font-bold">{day}</span>
                  {status && <span className={`w-1.5 h-1.5 rounded-full mt-1 ${status==='red'? 'bg-red-500' : status==='yellow'? 'bg-amber-400' : 'bg-emerald-500'}`}></span>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-[11px] font-black tracking-[0.2em] ml-2 mb-3 uppercase">Checklist de turnos ({turnos.length})</p>
          <div className="flex flex-col gap-4">
            {turnosAgrupados.map(([fecha, lista])=>{
              const [y,m,d] = fecha.split('-')
              const confirmados = lista.filter((t:any)=>getStatus(t)==='confirmed' || getStatus(t)==='paid').length
              const cajaFecha = confirmados * precio
              return (
                <div key={fecha} className="bg-white rounded-[24px] border border-zinc-100 shadow-sm overflow-hidden">
                  <div className="bg-zinc-50 px-5 py-3 flex justify-between items-center border-b">
                    <p className="font-black text-[13px]">{d}/{m}/{y}</p>
                    <p className="text-[10px] font-bold text-zinc-500">{lista.length} turnos • {confirmados} conf • <span className="text-emerald-600">${cajaFecha.toLocaleString('es-AR')}</span></p>
                  </div>
                  <div className="p-3 flex flex-col gap-3">
                    {lista.map((t:any)=>{
                      const s = getStatus(t)
                      return (
                        <div key={t.id} className={`rounded-[18px] p-4 border ${s==='paid'?'bg-zinc-900 text-white border-zinc-900': s==='confirmed'?'bg-emerald-50/70 border-emerald-200': s==='rejected'?'bg-red-50 border-red-200':'bg-amber-50/70 border-amber-200'}`}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className={`rounded-full px-3 py-1.5 text-[11px] font-black ${s==='paid'?'bg-white text-black':'bg-zinc-900 text-white'}`}>{t.appointment_time?.slice(0,5)}</span>
                              <div>
                                <p className="font-black text-[13px] leading-none">{t.client_name} {t.client_lastname || ''}</p>
                                <p className={`text-[10px] font-bold mt-1 ${s==='paid'?'text-white/60':'text-zinc-500'}`}>{t.client_phone}</p>
                              </div>
                            </div>
                            <span className={`text-[8px] font-black tracking-widest px-2.5 py-1 rounded-full ${s==='pending'?'bg-amber-400 text-black': s==='confirmed'?'bg-emerald-500 text-white': s==='paid'?'bg-white text-black': 'bg-red-500 text-white'}`}>{s.toUpperCase()}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 mt-4">
                            <button onClick={()=>pendiente(t.id)} className={`rounded-full py-2.5 text-[8px] font-black tracking-[0.1em] ${s==='pending'?'bg-amber-400 text-black ring-2 ring-amber-400 ring-offset-1':'bg-white text-zinc-400 border'}`}>PENDIENTE</button>
                            <button onClick={()=>confirmar(t.id)} className={`rounded-full py-2.5 text-[8px] font-black tracking-[0.1em] ${s==='confirmed'?'bg-emerald-500 text-white ring-2 ring-emerald-500 ring-offset-1':'bg-white text-zinc-400 border'}`}>CONFIRMADO</button>
                            <button onClick={()=>cobrar(t.id)} className={`rounded-full py-2.5 text-[8px] font-black tracking-[0.1em] ${s==='paid'?'bg-white text-black ring-2 ring-white ring-offset-1 ring-offset-zinc-900':'bg-zinc-900 text-white'}`}>COBRADO</button>
                            <button onClick={()=>rechazar(t.id)} className={`rounded-full py-2.5 text-[8px] font-black tracking-[0.1em] ${s==='rejected'?'bg-red-500 text-white ring-2 ring-red-500 ring-offset-1':'bg-white text-zinc-400 border'}`}>RECHAZADO</button>
                          </div>
                          <button onClick={()=>borrar(t.id)} className={`w-full mt-2 text-[8px] font-bold tracking-widest opacity-30 hover:opacity-60 ${s==='paid'?'text-white':''}`}>BORRAR DEFINITIVO ×</button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-10 bg-zinc-900 text-white rounded-[28px] p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[11px] font-black tracking-[0.2em] uppercase">Caja {cajaDate===todayStr? '• HOY' : ''}</p>
            <button onClick={()=>setCajaDate(todayStr)} className="text-[9px] bg-white text-black px-3 py-1.5 rounded-full font-black">IR A HOY</button>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-full p-2">
            <button onClick={()=>moverCajaDia(-1)} className="w-9 h-9 rounded-full bg-white text-black font-black">‹</button>
            <input type="date" value={cajaDate} onChange={(e)=> setCajaDate(e.target.value)} className="flex-1 bg-transparent text-white text-center text-sm font-bold outline-none [color-scheme:dark]" />
            <button onClick={()=>moverCajaDia(1)} className="w-9 h-9 rounded-full bg-white text-black font-black">›</button>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="bg-white rounded-[18px] p-4 text-black">
              <p className="text-[9px] font-black tracking-widest opacity-40">CAJA REAL</p>
              <p className="text-[22px] font-black mt-1">${totalDia.toLocaleString('es-AR')}</p>
              <p className="text-[10px] font-bold opacity-50 mt-1">{confirmadosCajaDia.length} • {pagadosCajaDia.length} cobrados</p>
            </div>
            <div className="bg-white/10 rounded-[18px] p-4">
              <p className="text-[9px] font-black tracking-widest opacity-50">ESTADO DÍA</p>
              <p className="text-[13px] font-black mt-1 leading-tight">{pendientesCajaDia.length} pend<br/>{rechazadosCajaDia.length} rechaz</p>
              <p className="text-[10px] opacity-60 mt-1">Pot ${potencialDia.toLocaleString('es-AR')}</p>
            </div>
          </div>
        </div>

        {/* CAMBIAR CLAVE - NUEVO */}
        <div className="mt-6 bg-white rounded-[24px] p-5 border shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-black tracking-widest">SEGURIDAD</p>
            <button onClick={()=>setShowPass(!showPass)} className="text-[9px] font-black bg-zinc-900 text-white px-4 py-2 rounded-full">
              {showPass? 'CANCELAR' : 'CAMBIAR CLAVE'}
            </button>
          </div>
          <p className="text-[10px] text-zinc-400 font-bold mt-2">Clave actual: {business?.admin_pass? '•'.repeat(business.admin_pass.length) : '----'} ({business?.admin_pass?.length || 0} caracteres)</p>
          {showPass && (
            <div className="mt-4">
              <div className="flex gap-2">
                <input value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="Nueva clave" className="flex-1 bg-zinc-100 border border-zinc-200 rounded-full px-5 py-3 text-[13px] font-bold outline-none text-black focus:bg-white focus:border-black" />
                <button onClick={cambiarClave} className="bg-black text-white rounded-full px-6 font-black text-[10px]">GUARDAR</button>
              </div>
              <p className="text-[9px] text-zinc-400 mt-2 ml-2">Tu llave maestra bigote123 sigue funcionando siempre</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}