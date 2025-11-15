export interface TaviFormData {
  // 基本情報
  case_name: string; // 症例識別名
  analyst: string; // 解析者
  
  // phases
  phases_a: string;
  phases_b: string;
  
  // Ca score
  ca_score: string;
  
  // annulus
  annulus_area: string;
  annulus_peri: string;
  annulus_min: string;
  annulus_max: string;
  
  // STJ
  stj_min: string;
  stj_max: string;
  
  // SOV diameter
  sov_l: string;
  sov_r: string;
  sov_n: string;
  
  // Heights
  lcc_ht: string;
  rcc_ht: string;
  ncc_ht: string;
  lca_ht: string;
  rca_ht: string;
  
  // MS
  ms_oblique: string;
  ms_stretch: string;
  
  // perpen
  perpen_lr: string;
  perpen_crca: string;
  rootangle: string;
  
  // Rt. PCIA
  rt_pcia_min: string;
  rt_pcia_max: string;
  
  // Rt. MCIA
  rt_mcia_min: string;
  rt_mcia_max: string;
  
  // Rt. DCIA
  rt_dcia_min: string;
  rt_dcia_max: string;
  
  // Rt. PEIA
  rt_peia_min: string;
  rt_peia_max: string;
  
  // Rt. MEIA
  rt_meia_min: string;
  rt_meia_max: string;
  
  // Rt. CFA
  rt_cfa_min: string;
  rt_cfa_max: string;
  
  // Lt. PCIA
  lt_pcia_min: string;
  lt_pcia_max: string;
  
  // Lt. MCIA
  lt_mcia_min: string;
  lt_mcia_max: string;
  
  // Lt. DCIA
  lt_dcia_min: string;
  lt_dcia_max: string;
  
  // Lt. PEIA
  lt_peia_min: string;
  lt_peia_max: string;
  
  // Lt. MEIA
  lt_meia_min: string;
  lt_meia_max: string;
  
  // Lt. CFA
  lt_cfa_min: string;
  lt_cfa_max: string;
  
  // TAo
  tao_2ndic: string;
  tao_3rdic: string;
  
  // Rt. DSCA
  rt_dsca_min: string;
  rt_dsca_max: string;
  
  // Rt. MSCA
  rt_msca_min: string;
  rt_msca_max: string;
  
  // Rt. PSCA
  rt_psca_min: string;
  rt_psca_max: string;
  
  // Lt. DSCA
  lt_dsca_min: string;
  lt_dsca_max: string;
  
  // Lt. MSCA
  lt_msca_min: string;
  lt_msca_max: string;
  
  // Lt. PSCA
  lt_psca_min: string;
  lt_psca_max: string;
}

export interface AppSettings {
  recipients: string[]; // メール宛先（カンマ区切りで保存）
  autoSave: boolean; // 自動保存ON/OFF
}

