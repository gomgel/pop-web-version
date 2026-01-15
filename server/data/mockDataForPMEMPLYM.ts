export interface Employee_Type {
    v_Plnt_Code: string; /* 플랜트 */
    v_Empl_Code: string; /* 사원코드 */
    v_Empl_Name: string; /* 사원명 */
}

export const mockEmployees: Employee_Type[] = [
    {
        v_Plnt_Code: "1000",
        v_Empl_Code: "E001",
        v_Empl_Name: "John Doe",
    },
    {
        v_Plnt_Code: "1000",
        v_Empl_Code: "E002",
        v_Empl_Name: "Jane Smith",
    },
    {
        v_Plnt_Code: "2000",
        v_Empl_Code: "E003",
        v_Empl_Name: "Alice Johnson",
    },
    {
        v_Plnt_Code: "1000",
        v_Empl_Code: "E004",
        v_Empl_Name: "Bob Brown",
    },
];
