"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function BarberiaPage() {
  const params = useParams()
  const slug = params.slug as string
  const [business, setBusiness] = useState<any>(null)
  const [loadingBiz, setLoadingBiz] = useState(true)
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ocupados, setOcupados] = useState<string[]>([])

  const horas = ["09:00","09:30","10:00","10:30","11:00","11:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30"]

  useEffect(() => {
    async function getBiz() {
      const { data } = await supabase.from("businesses").select("*").eq("slug", slug).single()
      setBusiness(data)
      setLoadingBiz(false)
    }
    if(slug) getBiz()
  }, [slug])

  const getDates = () => {
    const dates:any[] = []
    let d = new Date()
    while(dates.length < 10){
      const dayOfWeek = d.getDay()
      if(dayOfWeek >= 2 && dayOfWeek <= 6){
        const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
        dates.push({
          iso,
          diaNumero: d.getDate(),
          mesCorto: d.toLocaleDateString('es-AR',{month:'short'}).toUpperCase().replace('.',''),
          anio: d.getFullYear(),
          diaSemana: d.toLocaleDateString('es-AR',{weekday:'short'}).toUpperCase().replace('.','')
        })
      }
      d.setDate(d.getDate()+1)
    }
    return dates
  }

  useEffect(() => {
    if(!selectedDate ||!business) return
    async function fetchOcupados() {
      const { data } = await supabase.from("appointments").select("appointment_time").eq("appointment_date", selectedDate).eq("business_id", business.id)
      if(data) setOcupados(data.map((r:any) => r.appointment_time?.slice(0,5)))
    }
    fetchOcupados()
  }, [selectedDate, business])

  const handleReserva = async () => {
    if(!name.trim() ||!lastName.trim() ||!phone.trim() ||!selectedDate ||!selectedTime) { alert("Completá todo"); return }
    setOcupados(prev => [...prev, selectedTime])
    setLoading(true)
    const { error } = await supabase.from("appointments").insert([{
      business_id: business.id,
      client_name: name.trim(),
      client_lastname: lastName.trim(),
      client_phone: phone.trim(),
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      status: 'pending',
      is_confirmed: false,
      service: 'Corte Premium'
    }])
    setLoading(false)
    if(error){
      setOcupados(prev => prev.filter(h => h!== selectedTime))
      if(error.message.includes('unique') || error.code === '23505'){
        alert("Ese horario se acaba de ocupar, elegí otro")
      } else {
        alert(error.message)
      }
      return
    }
    const [y,m,d] = selectedDate.split('-')
    window.open(`https://wa.me/${business.owner_phone}?text=${encodeURIComponent(`Hola! Soy ${name} ${lastName}. Reservé turno en ${business.name} para el ${d}/${m}/${y} a las ${selectedTime}. Mi tel: ${phone}`)}`, '_blank')
    setSuccess(true); setName(""); setLastName(""); setPhone(""); setSelectedDate(""); setSelectedTime("")
    setTimeout(()=>setSuccess(false),4000)
  }

  const horasDisponibles = horas.filter(h => {
    if (ocupados.includes(h)) return false
    const today = new Date()
    const todayISO = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    if (selectedDate === todayISO) {
      const [hh, mm] = h.split(":").map(Number)
      if (hh * 60 + mm <= today.getHours() * 60 + today.getMinutes()) return false
    }
    return true
  })

  if(loadingBiz) return <div className="p-10 text-center font-black">Cargando...</div>
  if(!business) return <div className="p-10 text-center font-black">No existe /b/{slug}</div>
  if(business.status === 'paused') return <div className="p-10 text-center font-black">Cuenta suspendida - Contactá a TurnoLab</div>

  const precio = business.price || business.price_corte || 4500

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,700&family=Inter:wght@400;600;700;900&display=swap');`}</style>
      <div className="min-h-screen bg-[#F6F5F2] text-[#0A0A0A] flex flex-col" style={{fontFamily:'Inter'}}>
        <div className="w-full bg-[#0A0A0A] text-white">
          <div className="max-w-[480px] mx-auto px-5 py-6 flex items-center justify-between">
            <p className="text-[10px] tracking-[0.4em] font-black">{business.name} • RÍO CUARTO</p>
            <p className="text-[10px] tracking-widest opacity-50">MAR A SAB • 9-12 / 16-20</p>
          </div>
        </div>
        <div className="px-5 py-8 flex-1">
          <div className="max-w-[480px] mx-auto">
            <h1 className="text-[48px] leading-[0.85] font-black tracking-[-0.03em] text-[#0A0A0A]">RESERVÁ<br/>TU TURNO<span className="font-light">.</span></h1>
            <p className="mt-3 text-[13px] text-black/40 font-semibold tracking-wide">Corte Premium • 30 min • ${precio}</p>
            {success && <div className="mt-6 bg-[#0A0A0A] text-white rounded-full px-5 py-3 text-sm font-bold text-center">✓ Turno reservado! Te esperamos.</div>}
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] tracking-[0.2em] text-black/30 font-black ml-1">NOMBRE</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Juan" className="mt-2 w-full bg-white border border-black/5 rounded-full px-6 py-4 text-sm text-black outline-none focus:border-black/20 shadow-sm" /></div>
                <div><label className="text-[10px] tracking-[0.2em] text-black/30 font-black ml-1">APELLIDO</label><input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Perez" className="mt-2 w-full bg-white border border-black/5 rounded-full px-6 py-4 text-sm text-black outline-none focus:border-black/20 shadow-sm" /></div>
              </div>
              <div><label className="text-[10px] tracking-[0.2em] text-black/30 font-black ml-1">WHATSAPP</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="358 4123456" className="mt-2 w-full bg-white border border-black/5 rounded-full px-6 py-4 text-sm text-black outline-none focus:border-black/20 shadow-sm" /></div>
              <div>
                <label className="text-[10px] tracking-[0.2em] text-black/30 font-black ml-1">FECHA</label>
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {getDates().map((d:any)=>(
                    <button key={d.iso} onClick={()=>{setSelectedDate(d.iso); setSelectedTime("")}} className={`min-w-[84px] py-3.5 rounded-[20px] text-xs font-bold border flex flex-col items-center justify-center leading-tight transition-all ${selectedDate===d.iso? 'bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-lg scale-105' : 'bg-white border-black/5 text-black/50 hover:border-black/10 shadow-sm'}`}>
                      <span className={`text-[9px] tracking-widest font-black ${selectedDate===d.iso? 'text-white/50' : 'text-black/20'}`}>{d.diaSemana}</span>
                      <span className="text-[20px] font-black mt-0.5 text-[#0A0A0A]">{selectedDate===d.iso? <span className="text-white">{d.diaNumero}</span> : d.diaNumero}</span>
                      <span className={`text-[10px] font-bold ${selectedDate===d.iso? 'text-white/60' : 'text-black/30'}`}>{d.mesCorto} {d.anio}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] text-black/30 font-black ml-1">HORA • 30 MIN</label>
                {!selectedDate? <p className="text-black/20 text-xs mt-3 ml-1">Primero elegí una fecha</p> : (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {horasDisponibles.length === 0? <p className="col-span-4 text-black/30 text-xs text-center py-4">No quedan turnos</p> :
                    horasDisponibles.map(h=>(
                      <button key={h} onClick={()=>setSelectedTime(h)} className={`py-3.5 rounded-full text-xs font-black border transition-all ${selectedTime===h? 'bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-lg' : 'bg-white border-black/5 text-black/40 hover:border-black/10 shadow-sm'}`}>{h}</button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={handleReserva} disabled={loading} className="w-full mt-2 bg-[#0A0A0A] text-white rounded-full py-5 font-black tracking-widest text-sm shadow-[0_12px_24px_rgba(0,0,0,0.15)] hover:bg-black transition-all active:scale-[0.98]">
                {loading? 'RESERVANDO...' : `RESERVAR TURNO • $${precio}`}
              </button>
              <p className="text-center text-[10px] tracking-widest text-black/20 font-bold">PAGO EN EL LOCAL • EFECTIVO / TRANSFERENCIA</p>
            </div>
          </div>
        </div>
        <footer className="w-full text-center py-8 border-t border-black/5 bg-white">
          <p className="text-[10px] tracking-[0.3em] text-black/20 font-black">{business.name} • RÍO CUARTO</p>
        </footer>
      </div>
    </>
  )
}