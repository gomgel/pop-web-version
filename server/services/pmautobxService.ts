import oracledb from 'oracledb';
import { mockPmautobx, PMAUTOBX_Type } from '../data/mockDataForPMAUTOBX';

export const getPmautobx = async (
    plantCode: string,
    prdtTpcd?: string,
    prvsName?: string,
    possInfo?: string,
    page: number = 1,
    pageSize: number = 10
): Promise<{ data: PMAUTOBX_Type[], total: number }> => {
    const connectionString = process.env.ORACLE_CONNECTION_STRING;
    const user = process.env.ORACLE_USER;
    const password = process.env.ORACLE_PASSWORD;

    if (!connectionString) {
        return filterMockData(plantCode, prdtTpcd, prvsName, possInfo, page, pageSize);
    }

    let connection;
    try {
        console.log('Attempting to connect to Oracle DB for PMAUTOBX...');
        connection = await oracledb.getConnection({
            user: user,
            password: password,
            connectString: connectionString
        });

        // Call the stored procedure based on the provided spec
        // Assuming Pkg_Pmusrmst.P_SPMAUTOBX based on Product Label service
        const result = await connection.execute(
            `BEGIN 
                Pkg_Temporary.P_SPMAUTOBX(
                    CURSOR_DATA   => :cursor_data,
                    V_PLNT_CODE   => :V_PLNT_CODE,
                    V_PRDT_TPCD   => :V_PRDT_TPCD,
                    V_PRVS_NAME   => :V_PRVS_NAME,
                    V_POSS_INFO   => :V_POSS_INFO,
                    V_PAGE_NO     => :V_PAGE_NO,
                    V_PAGE_SIZE   => :V_PAGE_SIZE,
                    V_TOTAL_COUNT => :V_TOTAL_COUNT
                ); 
             END;`,
            {
                cursor_data: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
                V_PLNT_CODE: plantCode,
                V_PRDT_TPCD: prdtTpcd || '',
                V_PRVS_NAME: prvsName || '',
                V_POSS_INFO: possInfo || '',
                V_PAGE_NO: page,
                V_PAGE_SIZE: pageSize,
                V_TOTAL_COUNT: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            }
        );

        const resultSet = (result.outBinds as any)?.cursor_data;
        const totalCount = (result.outBinds as any)?.V_TOTAL_COUNT || 0;

        if (resultSet) {
            try {
                const rows = await resultSet.getRows();
                const results: PMAUTOBX_Type[] = (rows as any[]).map((row: any) => {
                    if (Array.isArray(row)) {
                        return {
                            v_Plnt_Code: row[0],
                            v_Prdt_Tpcd: row[1],
                            v_Prvs_Name: row[2],
                            v_Poss_Info: row[3],
                            v_Prnt_Cunt: row[4],
                            v_Vald_Macc: row[5],
                            v_Qult_Mark: row[6],
                            v_Idnt_Dvsn: row[7],
                            v_Desc_Text: row[8],
                            v_Scre_Date: row[9],
                            v_Scre_Time: row[10],
                            v_Schg_Date: row[11],
                            v_Schg_Time: row[12]
                        };
                    } else {
                        return {
                            v_Plnt_Code: row.V_PLNT_CODE || row.v_Plnt_Code,
                            v_Prdt_Tpcd: row.V_PRDT_TPCD || row.v_Prdt_Tpcd,
                            v_Prvs_Name: row.V_PRVS_NAME || row.v_Prvs_Name,
                            v_Poss_Info: row.V_POSS_INFO || row.v_Poss_Info,
                            v_Prnt_Cunt: row.V_PRNT_CUNT || row.v_Prnt_Cunt,
                            v_Vald_Macc: row.V_VALD_MACC || row.v_Vald_Macc,
                            v_Qult_Mark: row.V_QULT_MARK || row.v_Qult_Mark,
                            v_Idnt_Dvsn: row.V_IDNT_DVSN || row.v_Idnt_Dvsn,
                            v_Desc_Text: row.V_DESC_TEXT || row.v_Desc_Text,
                            v_Scre_Date: row.V_SCRE_DATE || row.v_Scre_Date,
                            v_Scre_Time: row.V_SCRE_TIME || row.v_Scre_Time,
                            v_Schg_Date: row.V_SCHG_DATE || row.v_Schg_Date,
                            v_Schg_Time: row.V_SCHG_TIME || row.v_Schg_Time
                        };
                    }
                });
                return { data: results, total: totalCount };
            } finally {
                await resultSet.close();
            }
        }
        return { data: [], total: 0 };
    } catch (error) {
        console.error('Failed to query Oracle DB for PMAUTOBX', error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }
};

function filterMockData(
    plantCode: string,
    prdtTpcd?: string,
    prvsName?: string,
    possInfo?: string,
    page: number = 1,
    pageSize: number = 10
): { data: PMAUTOBX_Type[], total: number } {
    let data = mockPmautobx;

    if (plantCode) {
        data = data.filter(item => item.v_Plnt_Code === plantCode);
    }
    if (prdtTpcd) {
        data = data.filter(item => item.v_Prdt_Tpcd.includes(prdtTpcd));
    }
    if (prvsName) {
        data = data.filter(item => item.v_Prvs_Name.includes(prvsName));
    }
    if (possInfo) {
        data = data.filter(item => item.v_Poss_Info.includes(possInfo));
    }

    const total = data.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pagedData = data.slice(startIndex, endIndex);

    return { data: pagedData, total };
}
