import { mockEmployees, Employee_Type } from '../data/mockDataForPMEMPLYM';

// In a real scenario, we would import oracledb here
// import oracledb from 'oracledb';

export const getEmployees = async (plantCode: string): Promise<Employee_Type[]> => {
    // Check for DB connection info (simulated)
    // Check for DB connection info (simulated)
    const connectionString = process.env.ORACLE_CONNECTION_STRING;
    const user = process.env.ORACLE_USER;
    const password = process.env.ORACLE_PASSWORD;

    const useRealDb = connectionString && user && password;

    if (useRealDb) {
        try {
            console.log('Attempting to connect to Oracle DB...');
            // Logic to connect to Oracle would go here
            // const connection = await oracledb.getConnection({ ... });
            // const result = await connection.execute(...)
            // return result;

            // For now, even if "configured", we might fail or fall back if not actually implemented
            // But per requirements, "change the codes but still return mockdata".
            // So we will simulate a DB call structure but return mock data for now 
            // or implement the actual call if I had the library. 

            // Since I don't have the library installed, I will log and fallback to mock
            console.warn('Oracle DB configured but driver not present/implemented. Returning mock data.');
            return filterMockData(plantCode);
        } catch (error) {
            console.error('Failed to query Oracle DB', error);
            throw error;
        }
    } else {
        // Return mock data
        return filterMockData(plantCode);
    }
};

function filterMockData(plantCode: string): Employee_Type[] {
    // Simulate the procedure logic: filtering by v_Plnt_Code
    if (!plantCode) {
        return mockEmployees;
    }
    return mockEmployees.filter(emp => emp.v_Plnt_Code === plantCode);
}
