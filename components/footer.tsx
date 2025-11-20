export default function Footer(){
  return (
    <footer className="mt-12 bg-white">
      <div className="container mx-auto p-6 text-sm text-gray-600">
        © {new Date().getFullYear()} Essência do Sul — Vinhos do Rio Grande do Sul. Todos os direitos reservados.
      </div>
    </footer>
  )
}
