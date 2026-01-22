export interface PMAUTOLB_Type {
    v_Plnt_Code: string;   /* 플랜트 */
    v_Prdt_Tpcd: string;   /* 제품코드 */
    v_Prvs_Name: string;   /* 제품명 */
    v_Poss_Info: string;   /* POS 정보 */
    v_Prnt_Macc: string;   /* MAC 발행유무 */
    v_Macc_Scan: string;   /* MAC 스캔여부 */
    v_Desc_Text: string;   /* 비고 */
    v_Scre_Date: string;   /* 생성일 */
    v_Scre_Time: string;   /* 생성시간 */
    v_Schg_Date: string;   /* 변경일 */
    v_Schg_Time: string;   /* 변경시간 */
}

export const mockPmautolb: PMAUTOLB_Type[] = [
    {
        v_Plnt_Code: "2000",
        v_Prdt_Tpcd: "P001",
        v_Prvs_Name: "Product A",
        v_Poss_Info: "POS001",
        v_Prnt_Macc: "Y",
        v_Macc_Scan: "Y",
        v_Desc_Text: "First product",
        v_Scre_Date: "20240101",
        v_Scre_Time: "090000",
        v_Schg_Date: "20240101",
        v_Schg_Time: "090000"
    },
    {
        v_Plnt_Code: "2000",
        v_Prdt_Tpcd: "P002",
        v_Prvs_Name: "Product B",
        v_Poss_Info: "POS002",
        v_Prnt_Macc: "N",
        v_Macc_Scan: "Y",
        v_Desc_Text: "Second product",
        v_Scre_Date: "20240102",
        v_Scre_Time: "100000",
        v_Schg_Date: "20240102",
        v_Schg_Time: "100000"
    },
    {
        v_Plnt_Code: "2000",
        v_Prdt_Tpcd: "P003",
        v_Prvs_Name: "Product C",
        v_Poss_Info: "POS003",
        v_Prnt_Macc: "Y",
        v_Macc_Scan: "N",
        v_Desc_Text: "Third product",
        v_Scre_Date: "20240103",
        v_Scre_Time: "110000",
        v_Schg_Date: "20240103",
        v_Schg_Time: "110000"
    }
];
