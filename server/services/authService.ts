import oracledb from 'oracledb';

export interface LoginResult {
    success: boolean;
    message: string;
    userInfo?: any;
    errorText?: string;
}

const getConnectionParams = () => ({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION_STRING
});

export const login = async (plant: string, emplCode: string, password: string): Promise<LoginResult> => {
    if (!process.env.ORACLE_CONNECTION_STRING) {
        // Mock success for development if no connection string
        if (emplCode === 'admin' && password === '1234') {
            return {
                success: true,
                message: 'Login Successful (Mock)',
                userInfo: {
                    v_Plnt_Cod2: plant,
                    v_Plnt_Name: 'Sample Plant',
                    v_Empl_Cod2: emplCode,
                    v_Empl_Name: 'Administrator',
                    v_Cert_Dvsn: 'Y'
                }
            };
        }
        return { success: false, message: 'Invalid Credentials (Mock)' };
    }

    let conn;
    try {
        conn = await oracledb.getConnection(getConnectionParams());
        const result = await conn.execute(
            `BEGIN 
                Pkg_Temporary.p_SelectPasswdCheck(
                    :i_Plnt_Code, :i_Empl_Code, :i_Pass_Word,
                    :o_Plnt_Cod2, :o_Plnt_Name, :o_Hrde_code, :o_Hrde_Name,
                    :o_Dept_Code, :o_Dept_Name, :o_Empl_Cod2, :o_Empl_Name,
                    :o_Endd_Date, :o_Dpgr_Code, :o_Syst_Date, :o_Cert_Dvsn,
                    :o_Success_Code, :o_Return_Message, :o_ErrorText
                ); 
             END;`,
            {
                i_Plnt_Code: plant,
                i_Empl_Code: emplCode,
                i_Pass_Word: password,
                o_Plnt_Cod2: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_Plnt_Name: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_Hrde_code: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_Hrde_Name: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_Dept_Code: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_Dept_Name: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_Empl_Cod2: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_Empl_Name: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_Endd_Date: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_Dpgr_Code: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_Syst_Date: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_Cert_Dvsn: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_Success_Code: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
                o_Return_Message: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
                o_ErrorText: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
            }
        );

        const out = result.outBinds as any;
        const certDvsn = out.o_Cert_Dvsn?.trim();
        const successCode = out.o_Success_Code;

        console.log('Login Procedure Attempt Result:', {
            certDvsn,
            successCode,
            returnMessage: out.o_Return_Message,
            errorText: out.o_ErrorText
        });

        if (certDvsn === 'Y' || successCode === 0) {
            return {
                success: true,
                message: out.o_Return_Message || 'Login Success',
                userInfo: {
                    v_Plnt_Cod2: out.o_Plnt_Cod2,
                    v_Plnt_Name: out.o_Plnt_Name,
                    v_Hrde_code: out.o_Hrde_code,
                    v_Hrde_Name: out.o_Hrde_Name,
                    v_Dept_Code: out.o_Dept_Code,
                    v_Dept_Name: out.o_Dept_Name,
                    v_Empl_Cod2: out.o_Empl_Cod2,
                    v_Empl_Name: out.o_Empl_Name,
                    v_Endd_Date: out.o_Endd_Date,
                    v_Dpgr_Code: out.o_Dpgr_Code
                }
            };
        } else {
            return {
                success: false,
                message: out.o_Return_Message || 'Login Failed',
                errorText: out.o_ErrorText
            };
        }
    } catch (err) {
        console.error('Error in login procedure:', err);
        return { success: false, message: 'Internal Server Error', errorText: (err as Error).message };
    } finally {
        if (conn) await conn.close();
    }
};
