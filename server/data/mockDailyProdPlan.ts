export interface DailyProdPlan {
    v_Plnt_Code: string;
    v_Plnt_Name: string;
    v_Ordr_Nmbr: string;
    v_Mkpd_Date: string;
    v_Saps_Line: string;
    v_Dept_Code: string;
    v_Dept_Name: string;
    v_Prdt_Tpcd: string;
    v_Badp_Tpcd: string;
    v_Prvs_Name: string;
    v_Prjt_Name: string;
    v_Plan_Cunt: number;
    v_Prdt_Cunt: number;
    v_Prdt_Nmbr: number;
    v_Star_Time: string;
    v_Tact_Unit: string;
    v_Tact_Time: number;
    v_Plan_Mans: number;
    v_Jobs_Dvsn: string;
    v_Jobs_Name: string;
    v_Clos_Dvsn: string;
    v_Clos_Dnam: string;
    v_Scre_Date: string;
    v_Scre_Time: string;
    v_Scre_Regr: string;
    v_Scre_Name: string;
    v_Schg_Date: string;
    v_Schg_Time: string;
    v_Sreg_Nmbr: string;
    v_Sreg_Name: string;
    v_Poss_Info: string;
    v_Prnt_Macc: string;
    v_Macc_Scan: string;
    v_Boxx_Poss: string;
    v_Vald_Macc: string;
    v_Qult_Mark: string;
}

export interface OrderDetail {
    v_Plnt_Code: string;
    v_Ordr_Nmbr: string;
    v_Prdt_Tpcd: string;
    v_Mkpd_Date: string;
    v_ARCH_CODE: string;
    v_DEPT_NAME: string;
    v_Prdt_Nmbr: number;
    v_Prdt_Cunt: number;
    v_Scan_Mind: string;
    v_Scan_Maxd: string;
    v_Plan_Fdat: string;
    v_Plan_Edat: string;
    v_Prvs_Name: string;
}

export const mockDailyPlans: DailyProdPlan[] = [
    {
        v_Plnt_Code: '2000',
        v_Plnt_Name: '유구공장',
        v_Ordr_Nmbr: '0009115696',
        v_Mkpd_Date: '2026.03.19',
        v_Saps_Line: 'EA13',
        v_Dept_Code: 'CA03',
        v_Dept_Name: '정수기3라인',
        v_Prdt_Tpcd: '114134',
        v_Badp_Tpcd: '02G2E',
        v_Prvs_Name: 'AP-3525I_BG(MY-700010)',
        v_Prjt_Name: 'MY-700010',
        v_Plan_Cunt: 370,
        v_Prdt_Cunt: 183,
        v_Prdt_Nmbr: 1,
        v_Star_Time: '08:00',
        v_Tact_Unit: 'EA',
        v_Tact_Time: 35,
        v_Plan_Mans: 12,
        v_Jobs_Dvsn: '10',
        v_Jobs_Name: '정상가동',
        v_Clos_Dvsn: 'N',
        v_Clos_Dnam: '진행중',
        v_Scre_Date: '20260319',
        v_Scre_Time: '07:30:00',
        v_Scre_Regr: 'ADMIN',
        v_Scre_Name: '관리자',
        v_Schg_Date: '20260319',
        v_Schg_Time: '14:00:00',
        v_Sreg_Nmbr: 'ADMIN',
        v_Sreg_Name: '관리자',
        v_Poss_Info: 'Y',
        v_Prnt_Macc: 'Y',
        v_Macc_Scan: 'Y',
        v_Boxx_Poss: 'N',
        v_Vald_Macc: 'N',
        v_Qult_Mark: 'A'
    },
    {
        v_Plnt_Code: '2000',
        v_Plnt_Name: '유구공장',
        v_Ordr_Nmbr: '0009115705',
        v_Mkpd_Date: '2026.03.19',
        v_Saps_Line: 'FA13',
        v_Dept_Code: 'CA03',
        v_Dept_Name: '정수기3라인',
        v_Prdt_Tpcd: '113475',
        v_Badp_Tpcd: '02FK3',
        v_Prvs_Name: 'AP-1520D_WT/ART',
        v_Prjt_Name: 'ART-2000',
        v_Plan_Cunt: 13,
        v_Prdt_Cunt: 13,
        v_Prdt_Nmbr: 2,
        v_Star_Time: '09:00',
        v_Tact_Unit: 'EA',
        v_Tact_Time: 40,
        v_Plan_Mans: 10,
        v_Jobs_Dvsn: '10',
        v_Jobs_Name: '정상가동',
        v_Clos_Dvsn: 'Y',
        v_Clos_Dnam: '완료',
        v_Scre_Date: '20260319',
        v_Scre_Time: '08:45:00',
        v_Scre_Regr: 'ADMIN',
        v_Scre_Name: '관리자',
        v_Schg_Date: '20260319',
        v_Schg_Time: '09:15:00',
        v_Sreg_Nmbr: 'ADMIN',
        v_Sreg_Name: '관리자',
        v_Poss_Info: 'Y',
        v_Prnt_Macc: 'Y',
        v_Macc_Scan: 'Y',
        v_Boxx_Poss: 'N',
        v_Vald_Macc: 'N',
        v_Qult_Mark: 'A'
    }
];

export const mockOrderDetails: Record<string, OrderDetail[]> = {
    '0009115705': [
        {
            v_Plnt_Code: '2000',
            v_Ordr_Nmbr: '0009115705',
            v_Prdt_Tpcd: '113475',
            v_Mkpd_Date: '2026.03.19',
            v_ARCH_CODE: 'FA13',
            v_DEPT_NAME: '정수기3라인',
            v_Prdt_Nmbr: 1,
            v_Prdt_Cunt: 13,
            v_Scan_Mind: '2026-03-19 09:03:59',
            v_Scan_Maxd: '2026-03-19 09:11:34',
            v_Plan_Fdat: '2026-03-19 09:00:00',
            v_Plan_Edat: '2026-03-19 09:14:00',
            v_Prvs_Name: 'AP-1520D_WT/ART'
        }
    ]
};
