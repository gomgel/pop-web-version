import { mockEmployees, Employee_Type } from '../data/mockDataForPMEMPLYM';

import oracledb from 'oracledb';

export const getEmployees = async (plantCode: string, emplCode?: string, emplName?: string, page: number = 1, pageSize: number = 10): Promise<{ data: Employee_Type[], total: number }> => {
    const connectionString = process.env.ORACLE_CONNECTION_STRING;
    const user = process.env.ORACLE_USER;
    const password = process.env.ORACLE_PASSWORD;

    if (!connectionString) {
        return filterMockData(plantCode, emplCode, emplName, page, pageSize);
    }

    let connection;
    try {
        console.log('Attempting to connect to Oracle DB...');
        connection = await oracledb.getConnection({
            user: user,
            password: password,
            connectString: connectionString
        });

        // Call the stored procedure
        const result = await connection.execute(
            `BEGIN 
                Pkg_Temporary.p_sPmemplym(
                    cursor_data => :cursor_data,
                    v_Plnt_Code => :v_Plnt_Code,
                    v_Empl_Code => :v_Empl_Code,
                    v_Empl_Name => :v_Empl_Name,
                    v_Page_No   => :v_Page_No,
                    v_Page_Size => :v_Page_Size,
                    v_Total_Count => :v_Total_Count
                ); 
             END;`,
            {
                cursor_data: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
                v_Plnt_Code: plantCode,
                v_Empl_Code: emplCode || '',
                v_Empl_Name: emplName || '',
                v_Page_No: page,
                v_Page_Size: pageSize,
                v_Total_Count: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            }
        );

        const resultSet = (result.outBinds as any)?.cursor_data;
        const totalCount = (result.outBinds as any)?.v_Total_Count || 0;

        if (resultSet) {
            try {
                const rows = await resultSet.getRows(); // Fetch all rows

                // Map the database rows to the Employee_Type interface
                // Handles both array (default for cursors) and object formats
                const results: Employee_Type[] = (rows as any[]).map((row: any) => {
                    if (Array.isArray(row)) {
                        return {
                            v_Plnt_Code: row[0],
                            v_Empl_Code: row[1],
                            v_Empl_Name: row[2],
                            v_Hrde_Code: row[3],
                            v_Dept_Code: row[4],
                            v_Scre_Date: row[5],
                            v_Scre_Time: row[6]
                        };
                    } else {
                        return {
                            v_Plnt_Code: row.V_PLNT_CODE || row.v_Plnt_Code,
                            v_Empl_Code: row.V_EMPL_CODE || row.v_Empl_Code,
                            v_Empl_Name: row.V_EMPL_NAME || row.v_Empl_Name,
                            v_Hrde_Code: row.V_HRDE_CODE || row.v_Hrde_Code,
                            v_Dept_Code: row.V_DEPT_CODE || row.v_Dept_Code,
                            v_Scre_Date: row.V_SCRE_DATE || row.v_Scre_Date,
                            v_Scre_Time: row.V_SCRE_TIME || row.v_Scre_Time
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
        console.error('Failed to query Oracle DB', error);
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

function filterMockData(plantCode: string, emplCode?: string, emplName?: string, page: number = 1, pageSize: number = 10): { data: Employee_Type[], total: number } {
    // Simulate the procedure logic: filtering by v_Plnt_Code, v_Empl_Code, v_Empl_Name
    let data = mockEmployees;

    if (plantCode) {
        data = data.filter(emp => emp.v_Plnt_Code === plantCode);
    }
    if (emplCode) {
        data = data.filter(emp => emp.v_Empl_Code === emplCode);
    }
    if (emplName) {
        data = data.filter(emp => emp.v_Empl_Name.includes(emplName));
    }

    const total = data.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pagedData = data.slice(startIndex, endIndex);

    return { data: pagedData, total };
}
