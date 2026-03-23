import oracledb from 'oracledb';
import { DailyProdPlan, OrderDetail, mockDailyPlans, mockOrderDetails } from '../data/mockDailyProdPlan';

const getConnectionParams = () => ({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION_STRING
});

export const getDailyProdPlan = async (
    plantCode: string,
    deptCode?: string,
    ordrNmbr?: string,
    fromDate?: string,
    toDate?: string
): Promise<DailyProdPlan[]> => {
    console.log('getDailyProdPlan called:', { plantCode, deptCode, ordrNmbr, fromDate, toDate });
    if (!process.env.ORACLE_CONNECTION_STRING) {
        console.log('No connection string, returning mockDailyPlans');
        return mockDailyPlans;
    }

    let conn;
    try {
        conn = await oracledb.getConnection(getConnectionParams());
        const result = await conn.execute(
            `BEGIN 
                pkg_pmpdplnm.p_spmpdplnm(
                    :o_Cursor,
                    :v_Plnt_Code,
                    :v_Dept_Code,
                    :v_Ordr_Nmbr,
                    :v_From_Date,
                    :v_To_Date,
                    :v_Dele_Dvsn
                ); 
             END;`,
            {
                o_Cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
                v_Plnt_Code: plantCode,
                v_Dept_Code: deptCode === 'ALL' ? '' : (deptCode || ''),
                v_Ordr_Nmbr: ordrNmbr || '',
                v_From_Date: fromDate || '',
                v_To_Date: toDate || '',
                v_Dele_Dvsn: 'N'
            }
        );

        const resultSet = (result.outBinds as any).o_Cursor;
        const rows = await resultSet.getRows();
        await resultSet.close();

        console.log(`Query returned ${rows.length} rows`);
        if (rows.length === 0) {
            console.log('Returning mockDailyPlans as fallback');
            return mockDailyPlans;
        }

        return (rows as any[]).map((row: any) => ({
            v_Plnt_Code: row[0],
            v_Plnt_Name: row[1],
            v_Ordr_Nmbr: row[2],
            v_Mkpd_Date: row[3],
            v_Saps_Line: row[4],
            v_Dept_Code: row[5],
            v_Dept_Name: row[6],
            v_Prdt_Tpcd: row[7],
            v_Badp_Tpcd: row[8],
            v_Prvs_Name: row[9],
            v_Prjt_Name: row[10],
            v_Plan_Cunt: row[11],
            v_Prdt_Cunt: row[12],
            v_Prdt_Nmbr: row[13],
            v_Star_Time: row[14],
            v_Tact_Unit: row[15],
            v_Tact_Time: row[16],
            v_Plan_Mans: row[17],
            v_Jobs_Dvsn: row[18],
            v_Jobs_Name: row[19],
            v_Clos_Dvsn: row[20],
            v_Clos_Dnam: row[21],
            v_Scre_Date: row[22],
            v_Scre_Time: row[23],
            v_Scre_Regr: row[24],
            v_Scre_Name: row[25],
            v_Schg_Date: row[26],
            v_Schg_Time: row[27],
            v_Sreg_Nmbr: row[28],
            v_Sreg_Name: row[29],
            v_Poss_Info: row[30],
            v_Prnt_Macc: row[31],
            v_Macc_Scan: row[32],
            v_Boxx_Poss: row[33],
            v_Vald_Macc: row[34],
            v_Qult_Mark: row[35]
        }));
    } catch (err) {
        console.error('Error in getDailyProdPlan:', err);
        return mockDailyPlans;
    } finally {
        if (conn) await conn.close();
    }
};

export const getOrderDetails = async (
    plantCode: string,
    ordrNmbr: string
): Promise<OrderDetail[]> => {
    console.log('getOrderDetails called:', { plantCode, ordrNmbr });
    if (!process.env.ORACLE_CONNECTION_STRING) {
        console.log('No connection string, returning mockOrderDetails');
        return mockOrderDetails[ordrNmbr] || [];
    }

    let conn;
    try {
        conn = await oracledb.getConnection(getConnectionParams());
        const result = await conn.execute(
            `BEGIN 
                Pkg_Pmlnpdtm.p_sOrdrProduct(
                    :o_Cursor,
                    :v_Plnt_Code,
                    :v_Ordr_Nmbr
                ); 
             END;`,
            {
                o_Cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
                v_Plnt_Code: plantCode,
                v_Ordr_Nmbr: ordrNmbr
            }
        );

        const resultSet = (result.outBinds as any).o_Cursor;
        const rows = await resultSet.getRows();
        await resultSet.close();

        console.log(`Query returned ${rows.length} rows`);
        if (rows.length === 0) {
            console.log('Returning mockOrderDetails as fallback for:', ordrNmbr);
            return mockOrderDetails[ordrNmbr] || [];
        }

        return (rows as any[]).map((row: any) => ({
            v_Plnt_Code: row[0],
            v_Ordr_Nmbr: row[1],
            v_Prdt_Tpcd: row[2],
            v_Mkpd_Date: row[3],
            v_ARCH_CODE: row[4],
            v_DEPT_NAME: row[5],
            v_Prdt_Nmbr: row[6],
            v_Prdt_Cunt: row[7],
            v_Scan_Mind: row[8],
            v_Scan_Maxd: row[9],
            v_Plan_Fdat: row[10],
            v_Plan_Edat: row[11],
            v_Prvs_Name: row[12]
        }));
    } catch (err) {
        console.error('Error in getOrderDetails:', err);
        return mockOrderDetails[ordrNmbr] || [];
    } finally {
        if (conn) await conn.close();
    }
};
