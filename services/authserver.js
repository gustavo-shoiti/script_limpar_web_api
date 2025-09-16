import pg from 'pg'
import axios from 'axios';
import fs from 'fs/promises'

const logPath = "./log.txt"
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aUBzZ3Npc3RlbWFzLmNvbS5iciIsImlhdCI6MTc1Nzk1NDAzOSwiZXhwIjoxNzU3OTYxMjM5fQ.VviBOGgJ0MGPvjOEYi6-8FqoGMOjG2xS5gMOV2XVWUk"
const { Client } = pg

export async function getauthServiceData() {
    try{
        // const authConnection = new Client({
        //   user: 'postgres',
        //   host: '168.138.125.125',
        //   database: 'web_api_client',
        //   password: 'SG515t3m45',
        //   port: 5434,
        // });

        const authConnection = new Client({
            user: 'postgres',
            host: '192.168.3.152',
            database: 'web_api_client_prod_shoiti',
            password: '1234',
            port: 5434,
          });

        await authConnection.connect()
          .then(() => console.log('Conectado ao PostgreSQL!'))
          .catch(err => console.error('Erro na conexão:', err));

        const queryAuth = "select id from empresa"
        const authResult = await authConnection.query(queryAuth)
        console.log("web_api_client",authResult.rows.length)
        return (authResult.rows.map(obj => obj.id))
    } catch(e) {
        console.log(e)
    }
}

export async function deleteById(ids) {
    for(const id of ids) {
        try{
            const a = await axios.delete(`http://localhost:8080/v1/admin/empresa/${id}`, {headers: { Authorization: `Bearer ${TOKEN}` }})
            await fs.appendFile(logPath, `Deletado com sucesso empresa id = ${id}\n`, 'utf8');
        } catch(e) {
            await fs.appendFile(logPath, `Falha ao deletar empresa id = ${id}, ${e}\n`, 'utf8');
            console.log(e)
        }
    }
}

export async function getIdsEmpresaSemConfiguracao() {
    try{
        const authConnection = new Client({
            user: 'postgres',
            host: '192.168.3.152',
            database: 'web_api_client_prod_shoiti',
            password: '1234',
            port: 5434,
          });

        await authConnection.connect()
          .then(() => console.log('Conectado ao PostgreSQL!'))
          .catch(err => console.error('Erro na conexão:', err));

        const queryAuth = "select id from empresa e where e.id not in (select pe.empresa_fk_id  from produto_empresa pe) and e.id not in (select cpe.empresa_id from config_pruduto_empresa cpe);"
        const authResult = await authConnection.query(queryAuth)
        console.log("web_api_client",authResult.rows.length)
        const idsEmpresa = authResult.rows.map(obj => obj.id);
        await fs.appendFile(logPath, `Ids Empresa a serem deletadas = ${idsEmpresa}\n`, 'utf8');

        return (idsEmpresa)
    } catch(e) {
        console.log(e)
    }

}