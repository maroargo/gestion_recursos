var bcrypt = require('bcryptjs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  
  const roleA = await prisma.role.upsert({
    where: { id: '', name: 'Administrador' },
    update: {},
    create: { name: 'Administrador' },
  })   
  const roleB = await prisma.role.upsert({
    where: { id: '', name: 'Usuario' },
    update: {},
    create: { name: 'Usuario' },
  })   
  
  const role = await prisma.role.findFirst({ where: { name: 'Administrador' } })  

  const passwordHash = await bcrypt.hash("123123", 10);
  const user = await prisma.user.upsert({
    where: { id: '', name: 'Administrador', email:'admin@gestion.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Administrador', email:'admin@gestion.com', password:passwordHash, phone: '', idRole: role.id },
  })

  const periodoA = await prisma.periodo.upsert({
    where: { id: '', periodo: '2024', descripcion: 'Periodo Anual 2024', nombre: 'Año del Bicentenario, de la consolidación de nuestra Independencia, y de la conmemoración de las heroicas batallas de Junín y Ayacucho' },
    update: {},
    create: { periodo: '2024', descripcion: 'Periodo Anual 2024', nombre: 'Año del Bicentenario, de la consolidación de nuestra Independencia, y de la conmemoración de las heroicas batallas de Junín y Ayacucho' },
  })
  const periodoB = await prisma.periodo.upsert({
    where: { id: '', periodo: '2025', descripcion: 'Periodo Anual 2025', nombre: 'Año de la recuperación y consolidación de la economía peruana' },
    update: {},
    create: { periodo: '2025', descripcion: 'Periodo Anual 2025', nombre: 'Año de la recuperación y consolidación de la economía peruana' },
  })

  const periodo = await prisma.periodo.findFirst({ where: { periodo: '2025' } })  
  const tipoPresA = await prisma.tipoPresupuesto.upsert({
    where: { id: '', name: 'FUNC 2025' },
    update: {},
    create: { value: '1', name: 'FUNC 2025', idPeriodo: periodo.id },
  })
  const tipoPresB = await prisma.tipoPresupuesto.upsert({
    where: { id: '', name: 'PROCESOS ELECTORALES' },
    update: {},
    create: { value: '2', name: 'PROCESOS ELECTORALES', idPeriodo: periodo.id },
  })  

  const genericagastoA = await prisma.genericaGasto.upsert({
    where: { id: '', name: 'Servicios' },
    update: {},
    create: { value: '2.3', name: 'Servicios' },
  })

  const tipoContratoA = await prisma.tipoContrato.upsert({
    where: { id: '', name: 'LOCACION' },
    update: {},
    create: { value: '1', name: 'LOCACION', siglas: 'LS' },
  })
  const tipoContratoB = await prisma.tipoContrato.upsert({
    where: { id: '', name: 'ORDEN DE SERVICIO' },
    update: {},
    create: { value: '2', name: 'ORDEN DE SERVICIO', siglas: 'OS' },
  })

  const medidaA = await prisma.tipoContrato.upsert({
    where: { id: '', name: 'Locador' },
    update: {},
    create: { value: '1', name: 'Locador' },
  })
  const medidaB = await prisma.tipoContrato.upsert({
    where: { id: '', name: 'Servicio' },
    update: {},
    create: { value: '2', name: 'Servicio' },
  })  
  
  console.log({ roleA, roleB   
    , user
    , periodoA, periodoB
    , tipoPresA, tipoPresB
    , genericagastoA
    , tipoContratoA, tipoContratoB  
    , medidaA, medidaB
   })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })