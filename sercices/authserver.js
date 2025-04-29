import pg from 'pg'
import axios from 'axios';
import fs from 'fs/promises'

const logPath = "./log.txt"
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aUBzZ3Npc3RlbWFzLmNvbS5iciIsImlhdCI6MTc0NTg1ODEyMSwiZXhwIjoxNzQ1ODY1MzIxfQ.-Ybyx8woC64FQoFfLfvPIsgVP90_32HOgaRdMV47tgs"


export async function getauthServiceData() {
    try{
        const { Client } = pg
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
    await fs.appendFile(logPath, `Iniciando deleção ${new Date().toISOString()} \n`, 'utf8');
    for(const id of ids) {
        try{
            const a = await axios.delete(`http://localhost:8080/v1/admin/empresa/${id}`, {headers: { Authorization: `Bearer ${TOKEN}` }})
            await fs.appendFile(logPath, `Deletado empresa id = ${id}\n`, 'utf8');
        } catch(e) {
            await fs.appendFile(logPath, `Falha ao deletar empresa id = ${id}, ${e}\n`, 'utf8');
            console.log(e)
        }
    }
}