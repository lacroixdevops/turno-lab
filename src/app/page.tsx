"use client"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export default function Home() {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ocupados, setOcupados] = useState<string[]>([])

  const horas = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30"]

  const getDates = () => {
    const dates = []
    for(let i=0;i<7;i++){
      const d = new Date()
      d.setDate(d.getDate()+i)
      const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      const label = d.toLocaleDateString('es-AR',{weekday:'short', day:'2-digit'})
      dates.push({iso, label})
    }
    return dates
  }

  // NORMALIZA 09:00:00 -> 09:00
  const normalizarHora = (h: string) => h.slice(0,5)

  useEffect(() => {
    if(!selectedDate) return
    async function fetchOcupados() {
      const { data } = await supabase.from("appointments").select("time").eq("date", selectedDate)
      if(data){
        setOcupados(data.map((r:any) => normalizarHora(r.time)))
      }
    }
    fetchOcupados()
  }, [selectedDate])

  const handleReserva = async () => {
    if(!name.trim() ||!lastName.trim() ||!phone.trim() ||!selectedDate ||!selectedTime) {
      alert("Completá todo")
      return
    }

    // LO OCULTA AL INSTANTE, antes de guardar
    setOcupados(prev => [...prev, selectedTime])

    setLoading(true)
    const { error } = await supabase.from("appointments").insert([{
      client_name: name.trim(),
      client_lastname: lastName.trim(),
      client_phone: phone.trim(),
      date: selectedDate,
      time: selectedTime,
      status: 'pendiente',
      service: 'Corte Premium'
    }])
    setLoading(false)

    if(error){
      // si falla, lo vuelve a mostrar
      setOcupados(prev => prev.filter(h => h!== selectedTime))
      alert("Error: " + error.message)
    } else {
      setSuccess(true)
      setName(""); setLastName(""); setPhone(""); setSelectedDate(""); setSelectedTime("")
      setTimeout(()=>setSuccess(false),4000)
    }
  }

  const horasDisponibles = horas.filter(h =>!ocupados.includes(h))

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400&family=Inter:wght@400;600;700&display=swap');`}</style>
      <div className="min-h-screen bg-[#151412] text-[#E8E2D6] px-5 py-8" style={{fontFamily:'Inter'}}>
        <div className="max-w-[480px] mx-auto">
          <p className="text-[#E6D5B8]/30 text-[10px] tracking-[0.4em] font-bold">RÍO CUARTO • ATELIER</p>
          <h1 className="mt-3 text-[52px] leading-[0.9]" style={{fontFamily:'Bodoni Moda'}}>Tu turno,<br/><span className="italic text-[#E6D5B8] font-light">tu estilo.</span></h1>
          {success && <div className="mt-6 bg-[#E6D5B8] text-black rounded-full px-5 py-3 text-sm font-bold text-center">✓ Turno reservado! Te esperamos.</div>}
          <div className="mt-8 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] tracking-widest text-white/30 font-bold ml-2">NOMBRE</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Juan" className="mt-2 w-full bg-[#1E1C1A] border border-white/5 rounded-full px-6 py-4 text-sm text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-white/30 font-bold ml-2">APELLIDO</label>
                <input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Perez" className="mt-2 w-full bg-[#1E1C1A] border border-white/5 rounded-full px-6 py-4 text-sm text-white outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-widest text-white/30 font-bold ml-2">NÚMERO DE WHATSAPP</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="358 4123456" className="mt-2 w-full bg-[#1E1C1A] border border-white/5 rounded-full px-6 py-4 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="text-[10px] tracking-widest text-white/30 font-bold ml-2">ELEGÍ FECHA</label>
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {getDates().map(d=>(
                  <button key={d.iso} onClick={()=>{setSelectedDate(d.iso); setSelectedTime("")}} className={`min-w-[72px] py-3 rounded-full text-xs font-bold border ${selectedDate===d.iso? 'bg-[#E6D5B8] text-black' : 'bg-[#1E1C1A] border-white/5 text-white/40'}`}>{d.label}<br/><span className="text-[10px] opacity-60">{d.iso.slice(5)}</span></button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-widest text-white/30 font-bold ml-2">ELEGÍ HORA</label>
              {!selectedDate? <p className="text-white/20 text-xs mt-3 ml-2">Primero elegí una fecha</p> : (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {horasDisponibles.length === 0? <p className="col-span-4 text-white/30 text-xs text-center py-4">No quedan turnos ese día</p> :
                  horasDisponibles.map(h=>(
                    <button key={h} onClick={()=>setSelectedTime(h)} className={`py-3 rounded-full text-xs font-bold border ${selectedTime===h? 'bg-white text-black' : 'bg-[#1E1C1A] border-white/5 text-white/40'}`}>{h}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleReserva} disabled={loading} className="w-full mt-6 bg-[#E6D5B8] text-black rounded-full py-5 font-bold tracking-widest text-sm">
              {loading? 'RESERVANDO...' : 'RESERVAR TURNO • $18.500'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}