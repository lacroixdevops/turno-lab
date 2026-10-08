"use client"

export default function Home() {
  const phone = "5493584396887" // tu whatsapp
  const msg = encodeURIComponent("Hola! Vi TurnoLab y quiero una demo para mi barbería")

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');`}</style>
      <div className="min-h-screen bg-white text-black flex flex-col" style={{fontFamily:'Inter'}}>

        {/* HEADER */}
        <div className="w-full max-w-[960px] mx-auto px-6 py-6 flex justify-between items-center">
          <p className="text-[11px] font-black tracking-[0.3em]">TURNO LAB</p>
          <a href="/admin" className="text-[10px] font-black tracking-widest text-black/40 hover:text-black">ACCESO MAESTRO</a>
        </div>

        {/* HERO */}
        <div className="flex-1 max-w-[960px] mx-auto px-6 pt-16 pb-20 text-center">
          <h1 className="text-[56px] md:text-[84px] font-black leading-[0.85] tracking-[-0.04em]">
            TURNO<br/>LAB<span className="font-light">.</span>
          </h1>
          <p className="mt-6 text-[15px] md:text-[18px] font-bold leading-[1.4] text-black/60 max-w-[520px] mx-auto">
            Software para barberías que automatiza turnos, evita bardo de WhatsApp y te ordena la caja. Sin comisiones.
          </p>

          <div className="mt-8 flex flex-col gap-3 max-w-[360px] mx-auto">
            <a href={`https://wa.me/${phone}?text=${msg}`} target="_blank" className="bg-black text-white rounded-full py-4 font-black text-[13px] tracking-[0.15em] text-center">
              SOLICITAR DEMO POR WHATSAPP
            </a>
            <p className="text-[11px] font-bold text-black/30 mt-2">Desde $15.000/mes • Instalación en 5 minutos</p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-[760px] mx-auto">
            <div className="bg-[#F6F5F2] rounded-[20px] p-5 border border-black/5">
              <p className="font-black text-[13px]">Agenda 24/7</p>
              <p className="text-[12px] font-bold text-black/50 mt-1">El cliente reserva solo, sin que le contestes. Se bloquea el horario automáticamente.</p>
            </div>
            <div className="bg-[#F6F5F2] rounded-[20px] p-5 border border-black/5">
              <p className="font-black text-[13px]">Caja anclada a HOY</p>
              <p className="text-[12px] font-bold text-black/50 mt-1">Ventas por fecha, historial real y link para cerrar caja por WhatsApp.</p>
            </div>
            <div className="bg-[#F6F5F2] rounded-[20px] p-5 border border-black/5">
              <p className="font-black text-[13px]">Vos cobrás primero</p>
              <p className="text-[12px] font-bold text-black/50 mt-1">Cada barbería paga su link mensual. Vos controlás vencimientos desde el Maestro.</p>
            </div>
          </div>

          <div className="mt-16">
            <p className="text-[10px] font-black tracking-[0.3em] text-black/20">TURNO LAB • HECHO EN RIO CUARTO</p>
          </div>
        </div>
      </div>
    </>
  )
}