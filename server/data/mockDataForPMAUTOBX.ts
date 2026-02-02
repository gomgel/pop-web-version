export interface PMAUTOBX_Type {
    v_Plnt_Code: string;      /* 플랜트                                   */
    v_Prdt_Tpcd: string;      /* 제품코드                                 */
    v_Prvs_Name: string;      /* 제품명                                   */
    v_Poss_Info: string;      /* POS 정보                                 */
    v_Prnt_Cunt: number;      /* 발행수량                                 */
    v_Vald_Macc: string;      /* MAC 검증                                 */
    v_Qult_Mark: string;      /* 품질마크                                 */
    v_Idnt_Dvsn: string;      /* ID 트래킹 여부                           */
    v_Desc_Text: string;      /* 비고                                     */
    v_Scre_Date: string;      /* 생성일                                   */
    v_Scre_Time: string;      /* 생성시간                                 */
    v_Schg_Date: string;      /* 변경일                                   */
    v_Schg_Time: string;      /* 변경시간                                 */
}

export const mockPmautobx: PMAUTOBX_Type[] = [
    {
        v_Plnt_Code: '2000',
        v_Prdt_Tpcd: 'BOX-001',
        v_Prvs_Name: 'Standard Box A',
        v_Poss_Info: 'Line 1-A',
        v_Prnt_Cunt: 100,
        v_Vald_Macc: 'Y',
        v_Qult_Mark: 'KC',
        v_Idnt_Dvsn: 'Y',
        v_Desc_Text: 'Standard cardboard box',
        v_Scre_Date: '20231001',
        v_Scre_Time: '100000',
        v_Schg_Date: '20231001',
        v_Schg_Time: '100000'
    },
    {
        v_Plnt_Code: '2000',
        v_Prdt_Tpcd: 'BOX-002',
        v_Prvs_Name: 'Premium Box B',
        v_Poss_Info: 'Line 2-B',
        v_Prnt_Cunt: 50,
        v_Vald_Macc: 'N',
        v_Qult_Mark: 'CE',
        v_Idnt_Dvsn: 'N',
        v_Desc_Text: 'Reinforced heavy-duty box',
        v_Scre_Date: '20231005',
        v_Scre_Time: '143000',
        v_Schg_Date: '20231005',
        v_Schg_Time: '143000'
    },
    {
        v_Plnt_Code: '2001',
        v_Prdt_Tpcd: 'BOX-003',
        v_Prvs_Name: 'Small Case C',
        v_Poss_Info: 'Line 3-C',
        v_Prnt_Cunt: 200,
        v_Vald_Macc: 'Y',
        v_Qult_Mark: 'UL',
        v_Idnt_Dvsn: 'Y',
        v_Desc_Text: 'Small plastic case',
        v_Scre_Date: '20231110',
        v_Scre_Time: '091500',
        v_Schg_Date: '20231110',
        v_Schg_Time: '091500'
    }
];
