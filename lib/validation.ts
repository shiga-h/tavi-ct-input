import { z } from 'zod';

// 数値バリデーション（小数を受け付ける）
const decimalSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val === '') return true;
      return /^-?\d+(\.\d+)?$/.test(val);
    },
    { message: '数値を入力してください' }
  );

// 整数バリデーション
const intSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val === '') return true;
      return /^-?\d+(\.\d+)?$/.test(val);
    },
    { message: '数値を入力してください' }
  );

// 範囲チェック用のヘルパー（警告表示用、送信は可）
export const validateRange = (
  value: string,
  min: number,
  max: number
): string | null => {
  if (!value || value === '') return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  if (num < min || num > max) {
    return `値が範囲外です（${min}～${max}）`;
  }
  return null;
};

// フォームスキーマ
export const formSchema = z.object({
  case_name: z.string().optional(),
  analyst: z.string().optional(),
  phases_a: intSchema,
  phases_b: intSchema,
  ca_score: intSchema,
  annulus_area: decimalSchema,
  annulus_peri: decimalSchema,
  annulus_min: decimalSchema,
  annulus_max: decimalSchema,
  stj_min: decimalSchema,
  stj_max: decimalSchema,
  sov_l: decimalSchema,
  sov_r: decimalSchema,
  sov_n: decimalSchema,
  lcc_ht: decimalSchema,
  rcc_ht: decimalSchema,
  ncc_ht: decimalSchema,
  lca_ht: decimalSchema,
  rca_ht: decimalSchema,
  ms_oblique: decimalSchema,
  ms_stretch: decimalSchema,
  perpen_lr: intSchema,
  perpen_crca: intSchema,
  rootangle: intSchema,
  rt_pcia_min: decimalSchema,
  rt_pcia_max: decimalSchema,
  rt_mcia_min: decimalSchema,
  rt_mcia_max: decimalSchema,
  rt_dcia_min: decimalSchema,
  rt_dcia_max: decimalSchema,
  rt_peia_min: decimalSchema,
  rt_peia_max: decimalSchema,
  rt_meia_min: decimalSchema,
  rt_meia_max: decimalSchema,
  rt_cfa_min: decimalSchema,
  rt_cfa_max: decimalSchema,
  lt_pcia_min: decimalSchema,
  lt_pcia_max: decimalSchema,
  lt_mcia_min: decimalSchema,
  lt_mcia_max: decimalSchema,
  lt_dcia_min: decimalSchema,
  lt_dcia_max: decimalSchema,
  lt_peia_min: decimalSchema,
  lt_peia_max: decimalSchema,
  lt_meia_min: decimalSchema,
  lt_meia_max: decimalSchema,
  lt_cfa_min: decimalSchema,
  lt_cfa_max: decimalSchema,
  tao_2ndic: decimalSchema,
  tao_3rdic: decimalSchema,
  rt_dsca_min: decimalSchema,
  rt_dsca_max: decimalSchema,
  rt_msca_min: decimalSchema,
  rt_msca_max: decimalSchema,
  rt_psca_min: decimalSchema,
  rt_psca_max: decimalSchema,
  lt_dsca_min: decimalSchema,
  lt_dsca_max: decimalSchema,
  lt_msca_min: decimalSchema,
  lt_msca_max: decimalSchema,
  lt_psca_min: decimalSchema,
  lt_psca_max: decimalSchema,
});

export type FormSchemaType = z.infer<typeof formSchema>;

