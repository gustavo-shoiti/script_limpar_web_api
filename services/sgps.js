import mysql from "mysql2/promise";
import fs from "fs/promises";
const logPath = "./log.txt"

export async function getSgpsData() {
    try {
        const sgpsConnection = await mysql.createConnection({
          host: '192.168.1.252',
          user: 'sgps',
          port:3306,
          password: '6Cx8A3p7',
          database: 'sgps'
        });

        const querySGSCli = `select distinct s.idservcent, s.empresa from sgscli s where s.idservcent is not null and s.idservcent != ""`;
        const [results] = await sgpsConnection.query(querySGSCli);
        console.log("sgps", results.length)
        return(results.map(obj => obj.idservcent));
    } catch (e) {
        await fs.appendFile(logPath, `Falha ao pegar dados do SGPS, ${e}\n`, 'utf8');
        console.log(e)
    }
}

export async function setIdServcentNull(idsEmpresa){
        try {
        // const sgpsConnection = await mysql.createConnection({
        //   host: '192.168.1.252',
        //   user: 'sgps',
        //   port:3306,
        //   password: '6Cx8A3p7',
        //   database: 'sgps'
        // });

        // const rjkConnection = await mysql.createConnection({
        //   host: '192.168.1.252',
        //   user: 'sgps',
        //   port:3306,
        //   password: '6Cx8A3p7',
        //   database: 'rjk'
        // });

        const sgpsConnection = await mysql.createConnection({
          host: '192.168.1.250',
          user: 'root',
          port:3306,
          password: 'senha1',
          database: 'sgps'
        });

        const rjkConnection = await mysql.createConnection({
          host: '192.168.1.250',
          user: 'root',
          port:3306,
          password: 'senha1',
          database: 'rjk'
        });

        const querySGSCli = `update sgscli s set s.idservcent = NULL where s.idservcent in (${idsEmpresa.join(",")})`;
        const [resultsSGPS] = await sgpsConnection.query(querySGSCli);
        console.log("Linhas atualizadas SGPS: ", resultsSGPS.affectedRows)
        await fs.appendFile(logPath, `Linhas atualizadas SGPS: ${resultsSGPS.affectedRows}\n`, 'utf8');

        const [resultsRJK] = await rjkConnection.query(querySGSCli);
        console.log("Linhas atualizadas RJK: ", resultsRJK.affectedRows)
        await fs.appendFile(logPath, `Linhas atualizadas RJK: ${resultsRJK.affectedRows}\n`, 'utf8');

    } catch (e) {
        await fs.appendFile(logPath, `Falha ao pegar dados do SGPS, ${e}\n`, 'utf8');
        console.log(e)
    }

}
