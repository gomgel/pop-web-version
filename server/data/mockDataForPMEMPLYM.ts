export interface Employee_Type {
    v_Plnt_Code: string; /* 플랜트 */
    v_Empl_Code: string; /* 사원코드 */
    v_Empl_Name: string; /* 사원명 */
    v_Hrde_Code: string; /* 부서코드_HR */
    v_Dept_Code: string; /* 라인코드 */
    v_Scre_Date: string; /* 생성일자 */
    v_Scre_Time: string; /* 생성시간 */
}

export const mockEmployees: Employee_Type[] = [
    {
        v_Plnt_Code: "2000",
        v_Empl_Code: "E001",
        v_Empl_Name: "John Doe",
        v_Hrde_Code: "HR001",
        v_Dept_Code: "DEPT01",
        v_Scre_Date: "20240101",
        v_Scre_Time: "090000"
    },
    {
        v_Plnt_Code: "2000",
        v_Empl_Code: "E002",
        v_Empl_Name: "Jane Smith",
        v_Hrde_Code: "HR002",
        v_Dept_Code: "DEPT02",
        v_Scre_Date: "20240102",
        v_Scre_Time: "100000"
    },
    {
        v_Plnt_Code: "2000",
        v_Empl_Code: "E003",
        v_Empl_Name: "Alice Johnson",
        v_Hrde_Code: "HR003",
        v_Dept_Code: "DEPT03",
        v_Scre_Date: "20240103",
        v_Scre_Time: "110000"
    },
    {
        v_Plnt_Code: "1000",
        v_Empl_Code: "E004",
        v_Empl_Name: "Bob Brown",
        v_Hrde_Code: "HR004",
        v_Dept_Code: "DEPT04",
        v_Scre_Date: "20240104",
        v_Scre_Time: "120000"
    },
];
