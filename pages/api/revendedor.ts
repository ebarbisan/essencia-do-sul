import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end();
  const data = req.body;
  const file = path.join(process.cwd(), 'data', 'revendedores.json');

  // cria pasta data se não tiver
  try{
    if(!fs.existsSync(path.join(process.cwd(), 'data'))){
      fs.mkdirSync(path.join(process.cwd(), 'data'));
    }
    let arr = [];
    if(fs.existsSync(file)){
      arr = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    const entry = {...data, id: Date.now(), status: 'pendente', createdAt: new Date().toISOString()};
    arr.push(entry);
    fs.writeFileSync(file, JSON.stringify(arr, null, 2));
    // opcional: enviar email para equipe usando nodemailer (requer credenciais SMTP)
    res.status(200).json({ok:true});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'erro interno'});
  }
}
