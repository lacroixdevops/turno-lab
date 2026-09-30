"use client"
import { useState, useEffect } from "react"
import { supabase } from "../../../lib/supabase"

const PRECIO_CORTE = 18500

export default function CajaDiaria() {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [turnos, setTurnos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cargarCaja()
  }, [fecha])

  async function cargarCaja() {
    setLoading(true)
    const { data } = await supabase.from("appointments").select("*").eq("date", fecha).order("time", { ascending: true })
    setTurnos(data || [])
    setLoading(false)
  }

  const total = turnos.length * PRECIO_CORTE
  const cobrados = turnos.filter(t => t.status === 'cobrado').length
  const totalCobrado = cobrados * PRECIO_CORTE

  async function marcarCobrado(id: string) {
    await supabase.from("appointments").update({ status: 'cobrado' }).eq("id", id)
    cargarCaja()
  }

  async function borrarCaja() {
    const confirmar = confirm(`¿Seguro querés BORRAR toda la caja del día ${fecha}? Se van a borrar ${turnos.length} turnos. Esta acción no se puede deshacer.`)
    if(!confirmar) return
    const dobleConfirmar = prompt(`Escribí BORRAR para confirmar`)
    if(dobleConfirmar!== 'BORRAR') return
    const { error } = await supabase.from("appointments").delete().eq("date", fecha)
    if(error) alert("Error: " + error.message)
    else {
      alert("Caja borrada")
      setTurnos([])
    }
  }

  async function borrarUno(id: string) {
    if(!confirm("¿Borrar este turno?")) return
    await supabase.from("appointments").delete().eq("id", id)
    cargarCaja()
  }

  return (
    <div className="min-h-screen bg-[#151412] text-white p-5 flex flex-col justify-between" style={{fontFamily:'Inter'}}>
      <div className="max-w-[500px] mx-auto w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Caja Diaria</h1>
          <a href="/admin" className="text-white/30 text-xs">← Admin</a>
        </div>

        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="mt-4 w-full bg-[#1E1C1A] border border-white/10 rounded-full px-6 py-4 text-white" />

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-[#E6D5B8] text-black rounded-[24px] p-5">
            <p className="text-[10px] tracking-widest font-bold opacity-60">TOTAL DÍA</p>
            <p className="text-3xl font-bold mt-2">${total.toLocaleString('es-AR')}</p>
            <p className="text-xs mt-1">{turnos.length} turnos</p>
          </div>
          <div className="bg-[#1E1C1A] border border-white/10 rounded-[24px] p-5">
            <p className="text-[10px] tracking-widest font-bold text-white/40">COBRADO</p>
            <p className="text-3xl font-bold mt-2 text-[#E6D5B8]">${totalCobrado.toLocaleString('es-AR')}</p>
            <p className="text-xs mt-1 text-white/40">{cobrados} cobrados</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-[10px] tracking-widest text-white/30 font-bold">TURNOS {fecha}</h2>
            {turnos.length > 0 && (
              <button onClick={borrarCaja} className="text-red-400 text-[10px] border border-red-400/20 bg-red-400/10 px-3 py-1 rounded-full font-bold">BORRAR CAJA DEL DÍA</button>
            )}
          </div>

          {loading? <p className="text-white/20 mt-4">Cargando...</p> :
            turnos.length === 0? <p className="text-white/20 mt-4">No hay turnos este día</p> :
            <div className="space-y-2 mt-3">
              {turnos.map(t => (
                <div key={t.id} className="bg-[#1E1C1A] border border-white/5 rounded-full px-5 py-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold">{t.time.slice(0,5)} - {t.client_name}</p>
                    <p className="text-[10px] text-white/30">{t.client_phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">${PRECIO_CORTE.toLocaleString('es-AR')}</span>
                    {t.status === 'cobrado'? <span className="bg-green-500/20 text-green-400 text-[10px] px-3 py-1 rounded-full">COBRADO</span> :
                      <button onClick={() => marcarCobrado(t.id)} className="bg-white text-black text-[10px] px-3 py-1 rounded-full font-bold">COBRAR</button>}
                    <button onClick={() => borrarUno(t.id)} className="text-white/20 text-xs">✕</button>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full text-center py-8 mt-16 border-t border-white/5">
        <p className="text-[10px] tracking-[0.3em] text-white/20 font-bold">ATELIER BARBER</p>
        <p className="text-[10px] text-white/30 mt-2">© 2026 Atelier Barber. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}