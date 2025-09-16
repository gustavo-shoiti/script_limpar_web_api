import * as sgpsService from './services/sgps.js'
import * as authService from './services/authserver.js'
import fs from 'fs'

async function deletarIdsTeste() {
    const idServcent = await sgpsService.getSgpsData();
    const idsCloud = JSON.parse(fs.readFileSync('./idscloud.txt')).map(String)

    const idsUtilizados = [... new Set([...idServcent, ...idsCloud])]
    const idsEmpresa =  await authService.getauthServiceData();

    console.log("ids", idsUtilizados.length, idsUtilizados)
    const idsToDelete = idsEmpresa.filter(item => !idsUtilizados.includes(item));
    console.log("idsToDelete", idsToDelete.length)
    await authService.deleteById(["7386", "7388"])
}

async function deletarEmpresasSemConfiguracao() {
    const idsEmpresa = await authService.getIdsEmpresaSemConfiguracao();
    console.log("idsEmpresa", idsEmpresa.length, idsEmpresa)
    await authService.deleteById(["7527", "7528","7529"])
    await sgpsService.setIdServcentNull(["7527", "7528","7529"])
}

fs.appendFile(logPath, `Iniciando rotina para limpar dados servidor central ${new Date().toISOString()} \n`, 'utf8');

await deletarEmpresasSemConfiguracao();
await deletarIdsTeste();

process.exit()


//Query para verificar quais empresas possuem idservcent em ambas as bases
//select sg.empresa, sg.cgc, sg.idservcent, rjk.empresa, rjk.cgc, rjk.idservcent
//	from sgps.sgscli sg
//	join rjk.sgscli rjk on sg.cgc = rjk.cgc and sg.empresa = rjk.empresa and (sg.idservcent is not null and rjk.idservcent is not null);