import Link from 'next/link';

export default function Header(){
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/"><a className="text-2xl font-bold" style={{color:'#FF7A00'}}>Essência do Sul</a></Link>
        <nav className="space-x-4">
          <Link href="/"><a>Início</a></Link>
          <Link href="/produtos"><a>Produtos</a></Link>
          <Link href="/about"><a>Sobre</a></Link>
          <a href="https://myairgo.com" target="_blank" rel="noreferrer" className="px-3 py-2 rounded" style={{background:'#FF7A00', color:'#fff'}}>Cardápio</a>
          <Link href="/revendedor"><a className="ml-2">Revendedores</a></Link>
        </nav>
      </div>
    </header>
  )
}
