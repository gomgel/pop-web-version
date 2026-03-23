"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployees = void 0;
const mockDataForPMEMPLYM_1 = require("../data/mockDataForPMEMPLYM");
const oracledb_1 = __importDefault(require("oracledb"));
const getEmployees = async (plantCode, emplCode, emplName, page = 1, pageSize = 10) => {
    const connectionString = process.env.ORACLE_CONNECTION_STRING;
    const user = process.env.ORACLE_USER;
    const password = process.env.ORACLE_PASSWORD;
    if (!connectionString) {
        return filterMockData(plantCode, emplCode, emplName, page, pageSize);
    }
    let connection;
    try {
        console.log('Attempting to connect to Oracle DB...');
        connection = await oracledb_1.default.getConnection({
            user: user,
            password: password,
            connectString: connectionString
        });
        // Call the stored procedure
        const result = await connection.execute(`BEGIN 
                Pkg_Temporary.p_sPmemplym(
                    cursor_data => :cursor_data,
                    v_Plnt_Code => :v_Plnt_Code,
                    v_Empl_Code => :v_Empl_Code,
                    v_Empl_Name => :v_Empl_Name,
                    v_Page_No   => :v_Page_No,
                    v_Page_Size => :v_Page_Size,
                    v_Total_Count => :v_Total_Count
                ); 
             END;`, {
            cursor_data: { type: oracledb_1.default.CURSOR, dir: oracledb_1.default.BIND_OUT },
            v_Plnt_Code: plantCode,
            v_Empl_Code: emplCode || '',
            v_Empl_Name: emplName || '',
            v_Page_No: page,
            v_Page_Size: pageSize,
            v_Total_Count: { type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_OUT }
        });
        const resultSet = result.outBinds?.cursor_data;
        const totalCount = result.outBinds?.v_Total_Count || 0;
        if (resultSet) {
            try {
                const rows = await resultSet.getRows(); // Fetch all rows
                // Map the database rows to the Employee_Type interface
                // Handles both array (default for cursors) and object formats
                const results = rows.map((row) => {
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
                    }
                    else {
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
            }
            finally {
                await resultSet.close();
            }
        }
        return { data: [], total: 0 };
    }
    catch (error) {
        console.error('Failed to query Oracle DB', error);
        throw error;
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
exports.getEmployees = getEmployees;
function filterMockData(plantCode, emplCode, emplName, page = 1, pageSize = 10) {
    // Simulate the procedure logic: filtering by v_Plnt_Code, v_Empl_Code, v_Empl_Name
    let data = mockDataForPMEMPLYM_1.mockEmployees;
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
