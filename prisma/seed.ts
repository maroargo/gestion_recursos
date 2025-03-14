var bcrypt = require('bcryptjs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  
  await prisma.role.deleteMany();
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

  await prisma.user.deleteMany();
  const passwordHash = await bcrypt.hash("123123", 10);
  const user = await prisma.user.upsert({
    where: { id: '', name: 'Administrador', email:'admin@gestion.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Administrador', email:'admin@gestion.com', password:passwordHash, phone: '', idRole: role.id },
  })

  await prisma.periodo.deleteMany();
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

  await prisma.tipoPresupuesto.deleteMany();  
  const tipoPresA = await prisma.tipoPresupuesto.upsert({
    where: { id: '', name: 'FUNC' },
    update: {},
    create: { value: '1', name: 'FUNC' },
  })
  const tipoPresB = await prisma.tipoPresupuesto.upsert({
    where: { id: '', name: 'PROCESO ELECTORAL' },
    update: {},
    create: { value: '2', name: 'PROCESO ELECTORAL' },
  })  

  await prisma.genericaGasto.deleteMany();
  const genericagastoA = await prisma.genericaGasto.upsert({
    where: { id: '', name: 'BIENES Y SERVICIOS' },
    update: {},
    create: { value: '2.3', name: 'BIENES Y SERVICIOS', descripcion: 'GASTOS POR CONCEPTO DE ADQUISICIÓN DE BIENES PARA EL FUNCIONAMIENTO INSTITUCIONAL Y CUMPLIMIENTO DE FUNCIONES, ASI COMO POR LOS PAGOS POR SERVICIOS DE DIVERSA NATURALEZA PRESTADOS POR PERSONAS NATURALES, SIN VÍNCULO LABORAL CON EL ESTADO, O PERSONAS JURÍDICAS' },
  })

  await prisma.tipoContrato.deleteMany();
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

  await prisma.unidadMedida.deleteMany();
  const medidaA = await prisma.unidadMedida.upsert({
    where: { id: '', name: 'Locador' },
    update: {},
    create: { value: '1', name: 'Locador' },
  })
  const medidaB = await prisma.unidadMedida.upsert({
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