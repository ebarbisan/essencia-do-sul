import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

const produtos = [
  {id:1, title:'Vinho Tinto Reserva', img:'/images/vinho1.jpg', desc:'Uvas selecionadas do sul.'},
  {id:2, title:'Espumante Brut', img:'/images/espumante1.jpg', desc:'Elegância e bolha fina.'},
  {id:3, title:'Suco de Uva Rosé (Destaque)', img:'/images/suco_rose.jpg', desc:'Diferencial da casa.'},
]

export default function Produtos(){
  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold" style={{color:'#FF7A00'}}>Produtos</h1>
        <p className="mt-2">Apresentamos nossos produtos — sem preços (confira o cardápio no menu ou em myairgo).</p>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {produtos.map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4">
              <Image src={p.img} alt={p.title} width={500} height={300} className="rounded" />
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <a href="https://myairgo.com" target="_blank" rel="noreferrer" className="px-4 py-2 rounded" style={{background:'#FF7A00', color:'#fff'}}>Abrir Cardápio e Solicitar Compra</a>
        </div>
      </main>
      <Footer />
    </>
  )
}
