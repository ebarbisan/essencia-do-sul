import Header from '../components/header';
import Footer from '../components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { GetStaticProps } from 'next'
import { prisma } from '../lib/prisma'

export default function Home(){
  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <section className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-4xl font-extrabold" style={{color:'#FF7A00'}}>Essência do Sul</h1>
            <p className="mt-4 text-lg">Vinhos, espumantes e sucos de uva finos do Rio Grande do Sul. Especialidade: suco de uva rosé.</p>
            <div className="mt-6">
              <Link href="/produtos"><a className="px-5 py-3 rounded-lg text-white" style={{background:'#FF7A00'}}>Ver Produtos</a></Link>
              <a href="https://myairgo.com" target="_blank" rel="noreferrer" className="ml-3 px-4 py-3 border rounded-md">Abrir Cardápio</a>
            </div>
          </div>
          <div>
            <Image src="/images/vinho1.jpg" alt="Vinho Essência" width={700} height={450} className="rounded-lg" />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Missão</h2>
          <p className="mt-2">Promover a cultura vitivinícola do sul do Brasil, entregando qualidade e autenticidade.</p>

          <h2 className="text-2xl font-semibold mt-6">Visão</h2>
          <p className="mt-2">Ser referência nacional em produtos derivados da uva, com foco em tradição e inovação.</p>

          <h2 className="text-2xl font-semibold mt-6">Valores</h2>
          <ul className="list-disc pl-6 mt-2">
            <li>Qualidade artesanal</li>
            <li>Sustentabilidade</li>
            <li>Respeito à tradição</li>
            <li>Inovação e transparência</li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}
