import { mockEmployees, Employee_Type } from '../data/mockDataForPMEMPLYM';

import oracledb from 'oracledb';

export const getEmployees = async (plantCode: string): Promise<Employee_Type[]> => {
    const connectionString = process.env.ORACLE_CONNECTION_STRING;
    const user = process.env.ORACLE_USER;
    const password = process.env.ORACLE_PASSWORD;

    if (!connectionString) {
        return filterMockData(plantCode);
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
                    v_Plnt_Code => :v_Plnt_Code
                ); 
             END;`,
            {
                cursor_data: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
                v_Plnt_Code: plantCode
            }
        );

        const resultSet = (result.outBinds as any)?.cursor_data;

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
                            v_Empl_Name: row[2]
                        };
                    } else {
                        return {
                            v_Plnt_Code: row.V_PLNT_CODE || row.v_Plnt_Code,
                            v_Empl_Code: row.V_EMPL_CODE || row.v_Empl_Code,
                            v_Empl_Name: row.V_EMPL_NAME || row.v_Empl_Name
                        };
                    }
                });
                return results;

            } finally {
                await resultSet.close();
            }
        }

        return [];
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

function filterMockData(plantCode: string): Employee_Type[] {
    // Simulate the procedure logic: filtering by v_Plnt_Code
    if (!plantCode) {
        return mockEmployees;
    }
    return mockEmployees.filter(emp => emp.v_Plnt_Code === plantCode);
}
