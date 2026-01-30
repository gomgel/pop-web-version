import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserInfo {
    v_Plnt_Cod2?: string;
    v_Plnt_Name?: string;
    v_Hrde_code?: string;
    v_Hrde_Name?: string;
    v_Dept_Code?: string;
    v_Dept_Name?: string;
    v_Empl_Cod2?: string;
    v_Empl_Name?: string;
    v_Endd_Date?: string;
    v_Dpgr_Code?: string;
}

interface AuthState {
    isLoggedIn: boolean;
    userInfo: UserInfo | null;
    setLogin: (info: UserInfo) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            userInfo: null,
            setLogin: (info) => set({ isLoggedIn: true, userInfo: info }),
            logout: () => set({ isLoggedIn: false, userInfo: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
