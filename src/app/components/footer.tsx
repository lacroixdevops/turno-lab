export default function Footer() {
  return (
    <footer className="w-full bg-[#151412] border-t border-white/5 py-8 mt-20">
      <div className="max-w-[500px] mx-auto px-6 text-center">
        <p className="text-[10px] tracking-[0.3em] text-white/20 font-bold">
          ATELIER BARBER
        </p>
        <p className="text-[10px] text-white/20 mt-2">
          © {new Date().getFullYear()} Atelier Barber. Todos los derechos reservados.
        </p>
        <p className="text-[9px] text-white/10 mt-1">
          Río Cuarto • Córdoba • Desarrollado con 💈
        </p>
      </div>
    </footer>
  )
}