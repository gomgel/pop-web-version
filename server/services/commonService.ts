import oracledb from 'oracledb';

const getConnectionParams = () => ({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION_STRING
});

export interface CommonCode {
    v_code_dvsn: string;
    v_code_name: string;
}

const mockPlants: CommonCode[] = [
    { v_code_dvsn: '2000', v_code_name: '유구공장' },
    { v_code_dvsn: '2001', v_code_name: '인천공장' },
    { v_code_dvsn: '2002', v_code_name: '포천공장' }
];

export const getCommonCodes = async (
    plantCode: string,
    sequNmbr: string
): Promise<CommonCode[]> => {
    if (!process.env.ORACLE_CONNECTION_STRING) {
        if (plantCode === '2000' && sequNmbr === '009') {
            return mockPlants;
        }
        return [];
    }

    let conn;
    try {

        console.log("try to get plants");

        conn = await oracledb.getConnection(getConnectionParams());
        const result = await conn.execute(
            `BEGIN 
                pkg_pmextcdm.p_scomcode(
                    :o_Cursor,
                    :v_plnt_code,
                    :v_sequ_nmbr
                ); 
             END;`,
            {
                o_Cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
                v_plnt_code: plantCode,
                v_sequ_nmbr: sequNmbr
            }
        );

        const resultSet = (result.outBinds as any).o_Cursor;
        const rows = await resultSet.getRows();
        await resultSet.close();

        if (rows.length === 0) {
            return plantCode === '2000' && sequNmbr === '009' ? mockPlants : [];
        }

        return (rows as any[]).map((row: any) => ({
            v_code_dvsn: row[2], // v_code_dvsn is 3rd in RECORD
            v_code_name: row[3]  // v_code_name is 4th in RECORD
        }));
    } catch (err) {
        console.error('Error in getCommonCodes:', err);
        return plantCode === '2000' && sequNmbr === '009' ? mockPlants : [];
    } finally {
        if (conn) await conn.close();
    }
};
