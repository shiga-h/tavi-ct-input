import { TaviFormData } from '@/types/form';
import { fmtDecimal1, fmtInt, repeatCRLF } from './format';

const CRLF = "\r\n";

/**
 * メール本文を生成（数値のみ、見出し・単位なし）
 */
export function buildBody(f: TaviFormData): string {
  const four = repeatCRLF(4);
  const two = repeatCRLF(2);
  const one = repeatCRLF(1);

  const lines: string[] = [
    String(f.analyst ?? ''),
    `${fmtInt(f.phases_a)}/${fmtInt(f.phases_b)}`,
    fmtDecimal1(f.ca_score),
    fmtDecimal1(f.annulus_area),
    fmtDecimal1(f.annulus_peri),
    fmtDecimal1(f.annulus_min),
    fmtDecimal1(f.annulus_max),
    four,
    fmtDecimal1(f.stj_min),
    fmtDecimal1(f.stj_max),
    fmtDecimal1(f.sov_l),
    fmtDecimal1(f.sov_r),
    fmtDecimal1(f.sov_n),
    fmtDecimal1(f.lcc_ht),
    fmtDecimal1(f.rcc_ht),
    fmtDecimal1(f.ncc_ht),
    fmtDecimal1(f.lca_ht),
    fmtDecimal1(f.rca_ht),
    two,
    fmtDecimal1(f.ms_oblique),
    fmtDecimal1(f.ms_stretch),
    fmtDecimal1(f.perpen_lr),
    fmtDecimal1(f.perpen_crca),
    fmtDecimal1(f.rootangle),
    one,
    fmtDecimal1(f.rt_pcia_min),
    fmtDecimal1(f.rt_pcia_max),
    fmtDecimal1(f.rt_mcia_min),
    fmtDecimal1(f.rt_mcia_max),
    fmtDecimal1(f.rt_dcia_min),
    fmtDecimal1(f.rt_dcia_max),
    fmtDecimal1(f.rt_peia_min),
    fmtDecimal1(f.rt_peia_max),
    fmtDecimal1(f.rt_meia_min),
    fmtDecimal1(f.rt_meia_max),
    fmtDecimal1(f.rt_cfa_min),
    fmtDecimal1(f.rt_cfa_max),
    one,
    fmtDecimal1(f.lt_pcia_min),
    fmtDecimal1(f.lt_pcia_max),
    fmtDecimal1(f.lt_mcia_min),
    fmtDecimal1(f.lt_mcia_max),
    fmtDecimal1(f.lt_dcia_min),
    fmtDecimal1(f.lt_dcia_max),
    fmtDecimal1(f.lt_peia_min),
    fmtDecimal1(f.lt_peia_max),
    fmtDecimal1(f.lt_meia_min),
    fmtDecimal1(f.lt_meia_max),
    fmtDecimal1(f.lt_cfa_min),
    fmtDecimal1(f.lt_cfa_max),
    one,
    fmtDecimal1(f.tao_2ndic),
    fmtDecimal1(f.tao_3rdic),
    fmtDecimal1(f.rt_dsca_min),
    fmtDecimal1(f.rt_dsca_max),
    fmtDecimal1(f.rt_msca_min),
    fmtDecimal1(f.rt_msca_max),
    fmtDecimal1(f.rt_psca_min),
    fmtDecimal1(f.rt_psca_max),
    fmtDecimal1(f.lt_dsca_min),
    fmtDecimal1(f.lt_dsca_max),
    fmtDecimal1(f.lt_msca_min),
    fmtDecimal1(f.lt_msca_max),
    fmtDecimal1(f.lt_psca_min),
    fmtDecimal1(f.lt_psca_max),
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

