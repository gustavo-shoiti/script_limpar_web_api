import mysql from "mysql2/promise";

export default async function getSgpsData() {
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
        console.log(e)
    }
}
