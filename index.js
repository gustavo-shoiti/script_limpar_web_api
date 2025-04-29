import getSgpsData from './sercices/sgps.js'
import {getauthServiceData, deleteById} from './sercices/authserver.js'
import fs from 'fs'

const idServcent = await getSgpsData();
const idsCloud = JSON.parse(fs.readFileSync('./idscloud.txt')).map(String)

const idsUtilizados = [... new Set([...idServcent, ...idsCloud])]
const idsEmpresa =  await getauthServiceData();

console.log("ids", idsUtilizados.length, idsUtilizados)
const idsToDelete = idsEmpresa.filter(item => !idsUtilizados.includes(item));
console.log(idsToDelete)
await deleteById(["7675"])
process.exit()