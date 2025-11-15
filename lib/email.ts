import { TaviFormData } from '@/types/form';
import { fmtDecimal1, fmtInt, box, repeatCRLF } from './format';

const CRLF = "\r\n";

/**
 * 行を生成するヘルパー関数（空欄でも行は出力する）
 */
function line(label: string, value: string, unit: string = ''): string {
  return `- ${label}${box(value)}${unit}`;
}

/**
 * メール本文を生成
 */
export function buildBody(f: TaviFormData): string {
  const four = repeatCRLF(4);
  const two = repeatCRLF(2);
  const one = repeatCRLF(1);

  const lines: string[] = [
    line('解析者', String(f.analyst ?? '')),
    `- phases${box(fmtInt(f.phases_a))}/${box(fmtInt(f.phases_b))}`,
    line('Ca score', fmtDecimal1(f.ca_score)),
    line('annulus area', fmtDecimal1(f.annulus_area), 'mm2'),
    line('annulus peri', fmtDecimal1(f.annulus_peri), 'mm'),
    line('annulus min', fmtDecimal1(f.annulus_min), 'mm'),
    line('annulus max', fmtDecimal1(f.annulus_max), 'mm'),
    four,
    line('STJ min', fmtDecimal1(f.stj_min), 'mm'),
    line('STJ max', fmtDecimal1(f.stj_max), 'mm'),
    line('SOV diameter L', fmtDecimal1(f.sov_l), 'mm'),
    line('SOV diameter R', fmtDecimal1(f.sov_r), 'mm'),
    line('SOV diameter N', fmtDecimal1(f.sov_n), 'mm'),
    line('LCC Ht. ', fmtDecimal1(f.lcc_ht), 'mm'),
    line('RCC Ht. ', fmtDecimal1(f.rcc_ht), 'mm'),
    line('NCC Ht.', fmtDecimal1(f.ncc_ht), 'mm'),
    line('LCA Ht.', fmtDecimal1(f.lca_ht), 'mm'),
    line('RCA Ht.', fmtDecimal1(f.rca_ht), 'mm'),
    two,
    line('MS oblique', fmtDecimal1(f.ms_oblique), 'mm'),
    line('MS stretch', fmtDecimal1(f.ms_stretch), 'mm'),
    line('perpen L/R', fmtDecimal1(f.perpen_lr), 'deg.'),
    line('perpen Cr/Ca', fmtDecimal1(f.perpen_crca), 'deg.'),
    line('rootangle', fmtDecimal1(f.rootangle), 'deg.'),
    one,
    line('Rt.PCIA min', fmtDecimal1(f.rt_pcia_min), 'mm'),
    line('Rt.PCIA max', fmtDecimal1(f.rt_pcia_max), 'mm'),
    line('Rt.MCIA min', fmtDecimal1(f.rt_mcia_min), 'mm'),
    line('Rt.MCIA max', fmtDecimal1(f.rt_mcia_max), 'mm'),
    line('Rt.DCIA min', fmtDecimal1(f.rt_dcia_min), 'mm'),
    line('Rt.DCIA max', fmtDecimal1(f.rt_dcia_max), 'mm'),
    line('Rt.PEIA min', fmtDecimal1(f.rt_peia_min), 'mm'),
    line('Rt.PEIA max', fmtDecimal1(f.rt_peia_max), 'mm'),
    line('Rt.MEIA min', fmtDecimal1(f.rt_meia_min), 'mm'),
    line('Rt.MEIA max', fmtDecimal1(f.rt_meia_max), 'mm'),
    line('Rt.CFA min', fmtDecimal1(f.rt_cfa_min), 'mm'),
    line('Rt.CFA max', fmtDecimal1(f.rt_cfa_max), 'mm'),
    one,
    line('Lt.PCIA min', fmtDecimal1(f.lt_pcia_min), 'mm'),
    line('Lt.PCIA max', fmtDecimal1(f.lt_pcia_max), 'mm'),
    line('Lt.MCIA min', fmtDecimal1(f.lt_mcia_min), 'mm'),
    line('Lt.MCIA max', fmtDecimal1(f.lt_mcia_max), 'mm'),
    line('Lt.DCIA min', fmtDecimal1(f.lt_dcia_min), 'mm'),
    line('Lt.DCIA max', fmtDecimal1(f.lt_dcia_max), 'mm'),
    line('Lt.PEIA min', fmtDecimal1(f.lt_peia_min), 'mm'),
    line('Lt.PEIA max', fmtDecimal1(f.lt_peia_max), 'mm'),
    line('Lt.MEIA min', fmtDecimal1(f.lt_meia_min), 'mm'),
    line('Lt.MEIA max', fmtDecimal1(f.lt_meia_max), 'mm'),
    line('Lt.CFA min', fmtDecimal1(f.lt_cfa_min), 'mm'),
    line('Lt.CFA max', fmtDecimal1(f.lt_cfa_max), 'mm'),
    one,
    line('TAo 2ndIC', fmtDecimal1(f.tao_2ndic), 'mm'),
    line('TAo 3rdIC', fmtDecimal1(f.tao_3rdic), 'mm'),
    line('Rt.DSCA min', fmtDecimal1(f.rt_dsca_min), 'mm'),
    line('Rt.DSCA max', fmtDecimal1(f.rt_dsca_max), 'mm'),
    line('Rt.MSCA min', fmtDecimal1(f.rt_msca_min), 'mm'),
    line('Rt.MSCA max', fmtDecimal1(f.rt_msca_max), 'mm'),
    line('Rt.PSCA min', fmtDecimal1(f.rt_psca_min), 'mm'),
    line('Rt.PSCA max', fmtDecimal1(f.rt_psca_max), 'mm'),
    line('Lt.DSCA min', fmtDecimal1(f.lt_dsca_min), 'mm'),
    line('Lt.DSCA max', fmtDecimal1(f.lt_dsca_max), 'mm'),
    line('Lt.MSCA min', fmtDecimal1(f.lt_msca_min), 'mm'),
    line('Lt.MSCA max', fmtDecimal1(f.lt_msca_max), 'mm'),
    line('Lt.PSCA min', fmtDecimal1(f.lt_psca_min), 'mm'),
    line('Lt.PSCA max', fmtDecimal1(f.lt_psca_max), 'mm'),
  ];

  // すべての行を結合（空欄でも行は出力される）
  return lines.join(CRLF);
}

/**
 * モバイルデバイスかどうかを判定
 */
function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Gmailアプリまたはmailtoでメールを起動
 */
export function openGmailOrMailto(
  toList: string[],
  subject: string,
  body: string
): void {
  const to = toList.join(',');
  const encSubj = encodeURIComponent(subject ?? '');
  const encBody = encodeURIComponent(body ?? '');
  
  const gmailUrl = `googlegmail://co?to=${encodeURIComponent(to)}&subject=${encSubj}&body=${encBody}`;
  const mailtoUrl = `mailto:${to}?subject=${encSubj}&body=${encBody}`;

  // モバイルデバイスの場合のみGmailアプリを試す
  if (isMobileDevice()) {
    // まずGmailアプリを試す
    let fallbackTimer: NodeJS.Timeout | null = null;
    
    // ページが非表示になったらフォールバックをキャンセル（Gmailアプリが起動した場合）
    const handleVisibilityChange = () => {
      if (document.hidden && fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange, { once: true });
    
    // フォールバック: 1秒後にmailtoを試す
    fallbackTimer = setTimeout(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.location.href = mailtoUrl;
    }, 1000);

    // Gmailアプリを起動
    window.location.href = gmailUrl;
  } else {
    // デスクトップの場合は直接mailtoを使用
    window.location.href = mailtoUrl;
  }
}

