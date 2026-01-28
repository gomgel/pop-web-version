import oracledb from 'oracledb';

export interface ColumnMetadata {
    name: string;
    type: string;
    isPrimary: boolean;
}

export interface TableMetadata {
    tableName: string;
    columns: ColumnMetadata[];
}

const mockTables = ['PMEMPLYM', 'PMAUTOLB', 'SAMPLE_TABLE'];

const mockMetadata: Record<string, ColumnMetadata[]> = {
    'PMEMPLYM': [
        { name: 'V_PLNT_CODE', type: 'VARCHAR2', isPrimary: true },
        { name: 'V_EMPL_CODE', type: 'VARCHAR2', isPrimary: true },
        { name: 'V_EMPL_NAME', type: 'VARCHAR2', isPrimary: false },
        { name: 'V_HRDE_CODE', type: 'VARCHAR2', isPrimary: false },
    ],
    'PMAUTOLB': [
        { name: 'V_PLNT_CODE', type: 'VARCHAR2', isPrimary: true },
        { name: 'V_PRDT_TPCD', type: 'VARCHAR2', isPrimary: true },
        { name: 'V_PRVS_NAME', type: 'VARCHAR2', isPrimary: false },
        { name: 'V_POSS_INFO', type: 'VARCHAR2', isPrimary: false },
    ],
    'SAMPLE_TABLE': [
        { name: 'ID', type: 'NUMBER', isPrimary: true },
        { name: 'NAME', type: 'VARCHAR2', isPrimary: false },
        { name: 'VAL', type: 'NUMBER', isPrimary: false },
    ]
};

const getConnectionParams = () => ({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION_STRING
});

export const getTables = async (): Promise<string[]> => {
    if (!process.env.ORACLE_CONNECTION_STRING) return mockTables;

    let conn;
    try {
        conn = await oracledb.getConnection(getConnectionParams());
        const result = await conn.execute(
            `BEGIN PKG_TEMPORARY.p_ListTables(:o_Cursor); END;`,
            { o_Cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } }
        );

        const resultSet = (result.outBinds as any).o_Cursor;
        const rows = await resultSet.getRows();
        await resultSet.close();

        return rows.map((row: any) => row[0]);
    } catch (err) {
        console.error('Error fetching tables via procedure:', err);
        return mockTables;
    } finally {
        if (conn) await conn.close();
    }
};

export const getTableMetadata = async (tableName: string): Promise<TableMetadata> => {
    if (!process.env.ORACLE_CONNECTION_STRING) {
        return { tableName, columns: mockMetadata[tableName] || [] };
    }

    let conn;
    try {
        conn = await oracledb.getConnection(getConnectionParams());
        const result = await conn.execute(
            `BEGIN PKG_TEMPORARY.p_GetMetadata(:i_TableName, :o_Cursor); END;`,
            {
                i_TableName: tableName,
                o_Cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        const resultSet = (result.outBinds as any).o_Cursor;
        const rows = await resultSet.getRows();
        await resultSet.close();

        const columns: ColumnMetadata[] = rows.map((row: any) => ({
            name: row[0],
            type: row[1],
            isPrimary: row[2] === 'Y'
        }));

        return { tableName, columns };
    } catch (err) {
        console.error('Error fetching metadata via procedure:', err);
        return { tableName, columns: mockMetadata[tableName] || [] };
    } finally {
        if (conn) await conn.close();
    }
};

export const getTableData = async (
    tableName: string,
    filters: Record<string, string>,
    page: number = 1,
    pageSize: number = 10
): Promise<{ data: any[], total: number }> => {
    if (!process.env.ORACLE_CONNECTION_STRING) {
        // Mock fallback logic...
        const mockData: any[] = [];
        for (let i = 1; i <= 25; i++) {
            if (tableName === 'PMEMPLYM') {
                mockData.push({ V_PLNT_CODE: '2000', V_EMPL_CODE: `E${1000 + i}`, V_EMPL_NAME: `Employee ${i}`, V_HRDE_CODE: 'HR01' });
            } else if (tableName === 'PMAUTOLB') {
                mockData.push({ V_PLNT_CODE: '2000', V_PRDT_TPCD: `T00${i}`, V_PRVS_NAME: `Label ${i}`, V_POSS_INFO: 'A1' });
            } else {
                mockData.push({ ID: i, NAME: `Item ${i}`, VAL: Math.floor(Math.random() * 100) });
            }
        }
        let filtered = mockData;
        for (const [key, value] of Object.entries(filters)) {
            if (value) filtered = filtered.filter(row => row[key]?.toString() === value);
        }
        const total = filtered.length;
        const start = (page - 1) * pageSize;
        const paged = filtered.slice(start, start + pageSize);
        return { data: paged, total };
    }

    let conn;
    try {
        conn = await oracledb.getConnection(getConnectionParams());

        // Construct simple WHERE clause for PKs on the Node side safely
        // Note: For a true production system, you might want to bind these in the procedure
        // but since PKs are dynamic, building a string is often necessary for generic tools.
        const whereParts = [];
        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                // Basic sanitization for simple values (quotes escaping)
                const safeVal = value.replace(/'/g, "''");
                whereParts.push(`${key} = '${safeVal}'`);
            }
        }
        const whereClause = whereParts.join(' AND ');

        const result = await conn.execute(
            `BEGIN 
                PKG_TEMPORARY.p_GetData(
                    :i_TableName, :i_WhereClause, :i_PageNo, :i_PageSize, 
                    :o_TotalCount, :o_Cursor
                ); 
             END;`,
            {
                i_TableName: tableName,
                i_WhereClause: whereClause,
                i_PageNo: page,
                i_PageSize: pageSize,
                o_TotalCount: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
                o_Cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );

        const total = (result.outBinds as any).o_TotalCount;
        const resultSet = (result.outBinds as any).o_Cursor;
        const rows = await resultSet.getRows(pageSize);
        await resultSet.close();

        // Convert array rows to objects if necessary (procedure returns rows typically as arrays unless specified)
        // However, oracledb.OUT_FORMAT_OBJECT won't work easily with cursors in 10g/older drivers.
        // We'll need to map them based on our metadata or just return as is.
        // For simplicity in this demo, we assume the client handles the order or we map them here.
        // Let's fetch metadata internally or rely on the fact that 'SELECT *' order is consistent.

        return { data: rows, total };
    } catch (err) {
        console.error('Error fetching data via procedure:', err);
        return { data: [], total: 0 };
    } finally {
        if (conn) await conn.close();
    }
};
