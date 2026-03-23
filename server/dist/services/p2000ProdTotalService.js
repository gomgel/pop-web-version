"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getP2000ProdTotal = void 0;
const mockDataForP2000PRODTOTAL_1 = require("../data/mockDataForP2000PRODTOTAL");
const oracledb_1 = __importDefault(require("oracledb"));
const getP2000ProdTotal = async (plantCode, mkpdDate) => {
    const connectionString = process.env.ORACLE_CONNECTION_STRING;
    const user = process.env.ORACLE_USER;
    const password = process.env.ORACLE_PASSWORD;
    if (!connectionString) {
        return filterMockData(plantCode, mkpdDate);
    }
    let connection;
    try {
        console.log('Attempting to connect to Oracle DB...');
        connection = await oracledb_1.default.getConnection({
            user: user,
            password: password,
            connectString: connectionString
        });
        const result = await connection.execute(`BEGIN 
                p_s2000ProdTotal(
                    cursor_s2000ProdTotal => :cursor_s2000ProdTotal,
                    v_Plnt_Code => :v_Plnt_Code,
                    v_Mkpd_Date => :v_Mkpd_Date
                ); 
             END;`, {
            cursor_s2000ProdTotal: { type: oracledb_1.default.CURSOR, dir: oracledb_1.default.BIND_OUT },
            v_Plnt_Code: plantCode,
            v_Mkpd_Date: mkpdDate
        });
        const resultSet = result.outBinds?.cursor_s2000ProdTotal;
        if (resultSet) {
            try {
                const rows = await resultSet.getRows();
                const results = rows.map((row) => {
                    if (Array.isArray(row)) {
                        return {
                            Dept_Dvsn: row[0],
                            Dept_Code: row[1],
                            Work_Edat: row[2],
                            Work_User: row[3],
                            Prvs_Name: row[4],
                            Prdt_Nmbr: row[5],
                            Targ_Cunt: row[6],
                            Curr_Cunt: row[7],
                            Goal_Perc: row[8],
                            Lost_Time: row[9],
                            Lost_Remk: row[10],
                            Curr_Stat: row[11],
                            Plnt_Code: row[12],
                            Mkpd_Date: row[13],
                            Prdt_Tpcd: row[14],
                            Runs_Time: row[15],
                            Runs_Cunt: row[16]
                        };
                    }
                    else {
                        return {
                            Dept_Dvsn: row.DEPT_DVSN || row.dept_dvsn,
                            Dept_Code: row.DEPT_CODE || row.dept_code,
                            Work_Edat: row.WORK_EDAT || row.work_edat,
                            Work_User: row.WORK_USER || row.work_user,
                            Prvs_Name: row.PRVS_NAME || row.prvs_name,
                            Prdt_Nmbr: row.PRDT_NMBR || row.prdt_nmbr,
                            Targ_Cunt: row.TARG_CUNT || row.targ_cunt,
                            Curr_Cunt: row.CURR_CUNT || row.curr_cunt,
                            Goal_Perc: row.GOAL_PERC || row.goal_perc,
                            Lost_Time: row.LOST_TIME || row.lost_time,
                            Lost_Remk: row.LOST_REMK || row.lost_remk,
                            Curr_Stat: row.CURR_STAT || row.curr_stat,
                            Plnt_Code: row.PLNT_CODE || row.plnt_code,
                            Mkpd_Date: row.MKPD_DATE || row.mkpd_date,
                            Prdt_Tpcd: row.PRDT_TPCD || row.prdt_tpcd,
                            Runs_Time: row.RUNS_TIME || row.runs_time,
                            Runs_Cunt: row.RUNS_CUNT || row.runs_cunt
                        };
                    }
                });
                return results;
            }
            finally {
                await resultSet.close();
            }
        }
        return [];
    }
    catch (error) {
        console.error('Failed to query Oracle DB', error);
        // Fallback to mock data in case of error
        return filterMockData(plantCode, mkpdDate);
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }
};
exports.getP2000ProdTotal = getP2000ProdTotal;
function filterMockData(plantCode, mkpdDate) {
    let data = mockDataForP2000PRODTOTAL_1.mockP2000ProdTotal;
    if (plantCode) {
        data = data.filter(item => item.Plnt_Code === plantCode);
    }
    if (mkpdDate) {
        data = data.filter(item => item.Mkpd_Date === mkpdDate);
    }
    return data;
}
