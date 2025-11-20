// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'


const prisma = new PrismaClient()


async function main(){
const password = await bcrypt.hash('admin123', 10)
await prisma.user.upsert({
where: { email: 'admin@essenciadosul.com' },
update: {},
create: {
name: 'Administrador',
email: 'admin@essenciadosul.com',
password,
role: 'ADMIN'
}
})


// produtos de exemplo
await prisma.product.createMany({
data: [
{ title: 'Vinho Tinto Reserva', slug: 'vinho-tinto-reserva', desc: 'Uvas selecionadas do sul.', image: '/images/vinho1.jpg' },
{ title: 'Espumante Brut', slug: 'espumante-brut', desc: 'Elegância e bolha fina.', image: '/images/espumante1.jpg' },
{ title: 'Suco de Uva Rosé (Destaque)', slug: 'suco-rose', desc: 'Diferencial da casa.', image: '/images/suco_rose.jpg', featured: true }
]
})
}


main()
.catch(e=>{ console.error(e); process.exit(1) })
.finally(()=>{ process.exit(0) })