"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Home(){
  const [barberias, setBarberias] = useState<any[]>([])

  useEffect(()=>{
    const load = async () => {
      const { data } = await supabase.from('businesses').select('*').eq('status','active')
      if(data) setBarberias(data)
    }
    load()
  },[])

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="w-full bg-black text-white px-6 py-4 flex justify-between items-center">
        <p className="text-[10px] tracking-[0.4em] font-black">TURNO LAB</p>
        <Link href="/admin" className="text-[10px] font-black tracking-widest bg-white text-black px-4 py-2 rounded-full">MASTER ADMIN</Link>
      </div>

      <div className="p-10 text-center max-w-[560px] mx-auto">
        <h1 className="text-4xl font-black tracking-tight">TURNO LAB</h1>
        <p className="mt-3 text-[13px] font-bold text-black/50 tracking-wide leading-relaxed">PROBÁ TU NUEVO SISTEMA DE SOFTWARE PARA AUTOMATIZACIÓN DE TURNOS</p>

        <div className="mt-8 flex flex-col gap-3">
          {barberias.length === 0 && (
            <p className="text-sm text-black/30 font-bold py-6">No hay barberías activas. Creá una en Master Admin.</p>
          )}

          {barberias.map(b => (
            <Link key={b.id} href={`/b/${b.slug}`} className="bg-black text-white px-6 py-3.5 rounded-full font-black text-sm text-center">
              Ver {b.name} → /b/{b.slug}
            </Link>
          ))}

          <Link href="/presentacion" className="bg-zinc-100 text-black px-6 py-3.5 rounded-full font-black text-sm text-center border border-black/5 mt-2">Ver Landing Ventas</Link>
          <Link href="/admin" className="bg-white border border-black/10 text-black/40 px-6 py-3.5 rounded-full font-black text-xs tracking-widest text-center">Ir a Master Admin</Link>
        </div>
      </div>
    </div>
  )
}