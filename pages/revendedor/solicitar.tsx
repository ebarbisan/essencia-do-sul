import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';

export default function Solicitar(){
  const [form, setForm] = useState({nome:'', documento:'', cidade:'', contato:'', mensagem:''});
  const [status, setStatus] = useState('');

  const submit = async (e:any) => {
    e.preventDefault();
    setStatus('Enviando...');
    try{
      await axios.post('/api/revendedor', form);
      setStatus('Pedido enviado com sucesso. Iremos analisar.');
      setForm({nome:'', documento:'', cidade:'', contato:'', mensagem:''});
    }catch(err){
      setStatus('Erro ao enviar. Tente novamente.');
    }
  }

  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold" style={{color:'#FF7A00'}}>Solicitar ser Revendedor</h1>
        <form onSubmit={submit} className="mt-4 max-w-lg">
          <input className="w-full p-2 mb-2" placeholder="Nome / Empresa" value={form.nome} onChange={(e)=>setForm({...form, nome:e.target.value})} />
          <input className="w-full p-2 mb-2" placeholder="CPF/CNPJ" value={form.documento} onChange={(e)=>setForm({...form, documento:e.target.value})} />
          <input className="w-full p-2 mb-2" placeholder="Cidade" value={form.cidade} onChange={(e)=>setForm({...form, cidade:e.target.value})} />
          <input className="w-full p-2 mb-2" placeholder="Contato (telefone/email)" value={form.contato} onChange={(e)=>setForm({...form, contato:e.target.value})} />
          <textarea className="w-full p-2 mb-2" placeholder="Mensagem" value={form.mensagem} onChange={(e)=>setForm({...form, mensagem:e.target.value})} />
          <button type="submit" className="px-4 py-2 rounded text-white" style={{background:'#FF7A00'}}>Enviar Solicitação</button>
        </form>
        {status && <p className="mt-4">{status}</p>}
      </main>
      <Footer />
    </>
  )
}
