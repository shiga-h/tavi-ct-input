import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TaviFormData, AppSettings } from '@/types/form';

interface FormStore {
  formData: TaviFormData;
  settings: AppSettings;
  autoSave: boolean;
  setFormData: (data: Partial<TaviFormData>) => void;
  resetFormData: () => void;
  setSettings: (settings: Partial<AppSettings>) => void;
  setAutoSave: (enabled: boolean) => void;
}

const initialFormData: TaviFormData = {
  case_name: '',
  analyst: '',
  phases_a: '',
  phases_b: '',
  ca_score: '',
  annulus_area: '',
  annulus_peri: '',
  annulus_min: '',
  annulus_max: '',
  stj_min: '',
  stj_max: '',
  sov_l: '',
  sov_r: '',
  sov_n: '',
  lcc_ht: '',
  rcc_ht: '',
  ncc_ht: '',
  lca_ht: '',
  rca_ht: '',
  ms_oblique: '',
  ms_stretch: '',
  perpen_lr: '',
  perpen_crca: '',
  rootangle: '',
  rt_pcia_min: '',
  rt_pcia_max: '',
  rt_mcia_min: '',
  rt_mcia_max: '',
  rt_dcia_min: '',
  rt_dcia_max: '',
  rt_peia_min: '',
  rt_peia_max: '',
  rt_meia_min: '',
  rt_meia_max: '',
  rt_cfa_min: '',
  rt_cfa_max: '',
  lt_pcia_min: '',
  lt_pcia_max: '',
  lt_mcia_min: '',
  lt_mcia_max: '',
  lt_dcia_min: '',
  lt_dcia_max: '',
  lt_peia_min: '',
  lt_peia_max: '',
  lt_meia_min: '',
  lt_meia_max: '',
  lt_cfa_min: '',
  lt_cfa_max: '',
  tao_2ndic: '',
  tao_3rdic: '',
  rt_dsca_min: '',
  rt_dsca_max: '',
  rt_msca_min: '',
  rt_msca_max: '',
  rt_psca_min: '',
  rt_psca_max: '',
  lt_dsca_min: '',
  lt_dsca_max: '',
  lt_msca_min: '',
  lt_msca_max: '',
  lt_psca_min: '',
  lt_psca_max: '',
};

const initialSettings: AppSettings = {
  recipients: [],
  autoSave: true,
};

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      formData: initialFormData,
      settings: initialSettings,
      autoSave: true,
      setFormData: (data) =>
        set((state) => {
          const newData = { ...state.formData, ...data };
          // 自動保存が有効な場合のみlocalStorageに保存
          if (state.autoSave) {
            return { formData: newData };
          }
          return { formData: newData };
        }),
      resetFormData: () => set({ formData: initialFormData }),
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      setAutoSave: (enabled) => set({ autoSave: enabled }),
    }),
    {
      name: 'tavi-ct-form-storage',
      partialize: (state) => ({
        formData: state.autoSave ? state.formData : initialFormData,
        settings: state.settings,
        autoSave: state.autoSave,
      }),
    }
  )
);

