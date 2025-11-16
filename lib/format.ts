/**
 * 数値整形ユーティリティ関数
 */

const CRLF = "\r\n";

export const repeatCRLF = (n: number): string => CRLF.repeat(n);

/**
 * 小数第1位で出力（整数入力も50→50.0に変換）
 * 未入力の場合は空文字列を返す
 */
export const fmtDecimal1 = (v: unknown): string => {
  if (v === null || v === undefined || v === '') return '';
  const n = Number(v);
  if (Number.isNaN(n)) return '';
  return n.toFixed(1);
};

/**
 * 整数で出力（小数入力は四捨五入）
 * 未入力の場合は空文字列を返す
 */
export const fmtInt = (v: unknown): string => {
  if (v === null || v === undefined || v === '') return '';
  const n = Number(v);
  if (Number.isNaN(n)) return '';
  return String(Math.round(n));
};

/**
 * 角括弧で包む（空の場合は[]のまま）
 */
export const box = (s: string): string => `[${s}]`;


