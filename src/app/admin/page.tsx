"use client"
import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

const CLAVE_MAESTRA = "bigote123"

export default function AdminMaestro() {
  const [isAuth, setIsAuth] = useState(false)
  const [passInput, setPassInput] = useState("")
  const [businesses, setBusinesses] = useState<any[]>([])
  const [form, setForm] = useState({name:'', phone:'', price:'18500', monthly:'15000'})

  useEffect(()=>{ if(localStorage.getItem('maestro_auth')==='ok') setIsAuth(true) },[])

  const login = (e:any) => {
    e.preventDefault()
    if(passInput === CLAVE_MAESTRA){ localStorage.setItem('maestro_auth','ok'); setIsAuth(true) }
    else alert('Clave incorrecta')
  }

  const load = async () => {
    const { data } = await supabase.from('businesses').select('*').order('next_due',{ascending:true})
    if(data) setBusinesses(data)
  }
  useEffect(()=>{ if(isAuth) load() },[isAuth])

  const makeSlug = (n:string) => n.toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').replace(/--+/g,'-')
  const create = async (e:any) => {
    e.preventDefault()
    const slug = makeSlug(form.name)
    const today = new Date().toISOString().split('T')[0]
    const due = new Date(); due.setDate(due.getDate()+30)
    const { error } = await supabase.from('businesses').insert([{slug, name:form.name, owner_phone:form.phone, price:parseInt(form.price), monthly_price:parseInt(form.monthly), start_date:today, next_due:due.toISOString().split('T')[0], status:'active'}])
    if(error) alert(error.message)
    else { setForm({name:'',phone:'',price:'18500',monthly:'15000'}); load() }
  }

  const cobrar = async (b:any) => {
    const newDue = new Date(b.next_due); newDue.setDate(newDue.getDate()+30)
    await supabase.from('businesses').update({next_due: newDue.toISOString().split('T')[0]}).eq('id', b.id)
    load()
  }

  const toggleStatus = async (id:string, cur:string) => {
    await supabase.from('businesses').update({status: cur==='active'?'paused':'active'}).eq('id', id)
    load()
  }

  const eliminar = async (id:string, name:string) => {
    if(!confirm(`¿ELIMINAR ${name}?`)) return
    await supabase.from('appointments').delete().eq('business_id', id)
    await supabase.from('businesses').delete().eq('id', id)
    load()
  }

  const copiarLink = (slug:string) => {
    navigator.clipboard.writeText(`${window.location.origin}/b/${slug}`)
    alert('Link copiado')
  }

  const diasRestantes = (d:string) => {
    const hoy = new Date(); hoy.setHours(0,0,0,0)
    const vence = new Date(d); vence.setHours(0,0,0,0)
    return Math.ceil((vence.getTime()-hoy.getTime())/(1000*60*60*24))
  }

  const fmt = (n:number) => "$"+n.toLocaleString('es-AR')
  const activos = businesses.filter(b=>b.status==='active').length
  const mrr = businesses.filter(b=>b.status==='active').reduce((s,b)=>s+(b.monthly_price||15000),0)
  const vencidos = businesses.filter(b=> diasRestantes(b.next_due) < 0 && b.status==='active').length

  if(!isAuth){
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6" style={{fontFamily:'Inter, sans-serif'}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;900&display=swap');`}</style>
        <form onSubmit={login} className="bg-white rounded-[28px] p-8 w-full max-w-[380px] text-center">
          <p className="text-[10px] font-black tracking-[0.3em] text-black">TURNO LAB • MAESTRO</p>
          <h1 className="text-[28px] font-black mt-4 text-black tracking-tight">Acceso privado</h1>
          <input
            type="password"
            value={passInput}
            onChange={e=>setPassInput(e.target.value)}
            placeholder="Contraseña maestra"
            className="w-full mt-6 bg-[#EDEDED] border-2 border-black rounded-full px-5 py-4 text-[15px] font-black text-black placeholder:text-black/70 text-center outline-none"
            autoFocus
          />
          <button className="w-full mt-4 bg-black text-white rounded-full py-4 font-black text-[12px] tracking-[0.2em]">ENTRAR</button>
          <p className="text-[10px] font-black text-black mt-4">Solo dueño de TurnoLab •</p>
        </form>
      </div>
    )
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');`}</style>
      <div className="min-h-screen bg-[#F6F5F2] text-black" style={{fontFamily:'Inter'}}>
        <div className="w-full bg-black text-white">
          <div className="max-w-[760px] mx-auto px-5 py-6 flex justify-between items-center">
            <p className="text-[10px] tracking-[0.4em] font-black">TURNO LAB • MAESTRO</p>
            <button onClick={()=>{localStorage.removeItem('maestro_auth'); setIsAuth(false)}} className="text-[9px] bg-white/10 px-3 py-1 rounded-full font-black">SALIR</button>
          </div>
        </div>

        <div className="max-w-[760px] mx-auto px-5 py-8">
          <h1 className="text-[40px] font-black tracking-[-0.03em] leading-[0.9]">Cobros<span className="font-light">.</span></h1>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-black rounded-[20px] p-5 text-white"><p className="text-[10px] opacity-50 font-black tracking-widest">MRR</p><p className="text-[22px] font-black mt-1">{fmt(mrr)}</p><p className="text-[11px] opacity-60">{activos} activos</p></div>
            <div className={`rounded-[20px] p-5 border-2 ${vencidos>0?'bg-red-500 text-white border-red-500':'bg-white border-black/10 text-black'}`}><p className="text-[10px] font-black opacity-60">VENCIDOS</p><p className="text-[22px] font-black mt-1">{vencidos}</p></div>
            <div className="bg-white rounded-[20px] p-5 border-2 border-black/10 text-black"><p className="text-[10px] font-black text-black/40 tracking-widest">TOTAL</p><p className="text-[22px] font-black mt-1">{businesses.length}</p></div>
          </div>

          <div className="mt-8 bg-white border-2 border-black/10 rounded-[24px] p-5 shadow-sm">
            <p className="text-[10px] tracking-[0.2em] text-black/50 font-black mb-3">CREAR BARBERIA</p>
            <form onSubmit={create} className="grid gap-3">
              <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Nombre de la barbería" className="bg-[#EDEDED] border-2 border-black/10 rounded-full px-5 py-3.5 text-[14px] font-black text-black placeholder:text-black/50 outline-none" required />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="WhatsApp" className="bg-[#EDEDED] border-2 border-black/10 rounded-full px-5 py-3.5 text-[14px] font-black text-black placeholder:text-black/50 outline-none" required />
                <input value={form.price} onChange={e=>setForm({...form, price:e.target.value})} placeholder="18500" className="bg-[#EDEDED] border-2 border-black/10 rounded-full px-5 py-3.5 text-[14px] font-black text-black placeholder:text-black/50 outline-none" />
              </div>
              <div className="flex gap-3 items-center">
                <input value={form.monthly} onChange={e=>setForm({...form, monthly:e.target.value})} placeholder="15000" className="bg-[#EDEDED] border-2 border-black/10 rounded-full px-5 py-3.5 text-[14px] font-black text-black w-[140px] outline-none" />
                <span className="text-[11px] text-black/60 font-black">/mes</span>
              </div>
              <button className="bg-black text-white rounded-full py-4 font-black text-sm tracking-widest">+ CREAR Y ACTIVAR 30 DIAS</button>
            </form>
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-[10px] tracking-[0.2em] text-black/40 font-black ml-1">CLIENTES • SIN ACCESO A AGENDAS</p>
            {businesses.map(b=>{
              const dias = diasRestantes(b.next_due)
              let color = "bg-black text-white"
              if(dias < 0) color = "bg-red-500 text-white"
              if(dias >=0 && dias <=3) color = "bg-amber-400 text-black"
              return (
                <div key={b.id} className="bg-white border-2 border-black/10 rounded-[24px] p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-[16px] text-black">{b.name} <span className={`ml-2 text-[9px] px-2.5 py-1 rounded-full font-black ${color}`}>{dias<0? `VENCIDO ${Math.abs(dias)}d` : `${dias} DIAS`}</span></p>
                      <p className="text-[11px] text-black/60 font-bold mt-1">Vence: {b.next_due?.split('-').reverse().join('/')} • {fmt(b.monthly_price||15000)}/mes • Corte {fmt(b.price||18500)}</p>
                    </div>
                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-black ${b.status==='active'?'bg-black text-white':'bg-black/10 text-black/50'}`}>{b.status==='active'?'ACTIVO':'PAUSADO'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <a href={`/b/${b.slug}`} target="_blank" className="bg-[#EDEDED] border-2 border-black/10 rounded-full py-2.5 text-center text-xs font-black text-black">Ver Página</a>
                    <button onClick={()=>copiarLink(b.slug)} className="bg-white border-2 border-black/10 rounded-full py-2.5 text-center text-xs font-black text-black">Copiar Link</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <button onClick={()=>cobrar(b)} className="bg-emerald-500 text-white rounded-full py-2.5 text-xs font-black col-span-2">Cobrado +30 días</button>
                    <button onClick={()=>toggleStatus(b.id, b.status)} className="bg-black text-white rounded-full py-2.5 text-xs font-black">{b.status==='active'?'PAUSAR':'ACTIVAR'}</button>
                  </div>
                  <button onClick={()=>eliminar(b.id, b.name)} className="w-full mt-2 text-red-400 text-[10px] font-black tracking-widest">ELIMINAR</button>
                </div>
              )
            })}
          </div>
          <p className="text-center text-[9px] text-black/30 mt-8 font-black tracking-widest">MAESTRO NO VE AGENDAS • PROFESIONAL</p>
        </div>
      </div>
    </>
  )
}