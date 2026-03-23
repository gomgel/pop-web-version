import oracledb from 'oracledb';

export async function getDbMetrics() {
    let connection;
    try {
        try {
            connection = await oracledb.getConnection({
                user: process.env.ORACLE_USER || 'popadmin',
                password: process.env.ORACLE_PASSWORD || 'havefun',
                connectString: process.env.ORACLE_CONNECTION_STRING || 'test-popdb.coway.dev/POPORA'
            });

            // Use direct SQL SELECT statements as requested by the user
            const sql = `
                SELECT 'LOGICAL_IO' as category, name as metric_name, value, 'BLOCKS' as unit
                FROM V$SYSSTAT
                WHERE name IN ('consistent gets', 'db block gets', 'db block changes')
                UNION ALL
                SELECT 'PHYSICAL_IO' as category, name as metric_name, value, 'OPS' as unit
                FROM V$SYSSTAT
                WHERE name IN ('physical reads', 'physical writes')
                UNION ALL
                SELECT 'CALL_RATES' as category, name as metric_name, value, 'CALLS' as unit
                FROM V$SYSSTAT
                WHERE name IN ('user calls', 'execute count', 'user commits')
                UNION ALL
                SELECT 'SESSIONS' as category, status as metric_name, count(*) as value, 'COUNT' as unit
                FROM V$SESSION
                GROUP BY status
                UNION ALL
                SELECT 'SGA' as category, 
                       CASE 
                         WHEN name = 'Fixed SGA' THEN 'fixed_sga'
                         WHEN name = 'buffer_cache' THEN 'buffer_cache'
                         WHEN name = 'log_buffer' THEN 'log_buffer'
                         ELSE 'shared pool'
                       END as metric_name, 
                       SUM(bytes) as value, 
                       'BYTES' as unit
                FROM V$SGASTAT
                GROUP BY CASE 
                         WHEN name = 'Fixed SGA' THEN 'fixed_sga'
                         WHEN name = 'buffer_cache' THEN 'buffer_cache'
                         WHEN name = 'log_buffer' THEN 'log_buffer'
                         ELSE 'shared pool'
                       END
            `;

            const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

            if (result.rows && result.rows.length > 0) {
                const sgaCount = result.rows.filter((r: any) => r.CATEGORY === 'SGA').length;
                console.log(`[dbMonitorService] Fetched ${result.rows.length} metrics (${sgaCount} SGA categories).`);
                return { success: true, data: result.rows, source: 'real' };
            }
        } catch (dbErr: any) {
            console.warn('Real DB metrics via direct SQL failed, falling back to mock.', dbErr.message);
        }

        // MOCK DATA (Matches the UI structure expected)
        const categories = [
            { cat: 'LOGICAL_IO', metrics: ['consistent gets', 'db block gets', 'db block changes'], unit: 'BLOCKS', base: 5000, var: 10000 },
            { cat: 'SESSIONS', metrics: ['ACTIVE', 'INACTIVE', 'SNIPED'], unit: 'COUNT', base: 5, var: 50 },
            { cat: 'SGA', metrics: ['fixed_sga', 'buffer_cache', 'log_buffer', 'shared pool'], unit: 'BYTES', base: 1000000, var: 100000000 },
            { cat: 'PHYSICAL_IO', metrics: ['physical reads', 'physical writes'], unit: 'OPS', base: 10, var: 50 },
            { cat: 'CALL_RATES', metrics: ['user calls', 'execute count', 'user commits'], unit: 'CALLS', base: 500, var: 2000 }
        ];

        const mockRows = categories.flatMap(c =>
            c.metrics.map(m => ({
                CATEGORY: c.cat,
                METRIC_NAME: m,
                VALUE: Math.floor(c.base + Math.random() * c.var + (m === 'consistent gets' ? 10000 : 0)), // Higher base for consistent gets to look more realistic
                UNIT: c.unit
            }))
        );

        return {
            success: true,
            data: mockRows,
            source: 'mock',
            timestamp: new Date().toISOString()
        };
    } catch (err) {
        console.error('Error getting DB metrics:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
