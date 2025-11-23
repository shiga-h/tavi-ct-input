'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, validateRange } from '@/lib/validation';
import { TaviFormData } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { buildBody, openGmailOrMailto } from '@/lib/email';
import FormField from './FormField';
import { useRef, useEffect } from 'react';

export default function TaviForm() {
  const { formData, setFormData, settings, autoSave } = useFormStore();
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<TaviFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  // デバウンス用のタイマー
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // 前回のformDataを保存（無限ループを防ぐため）
  const prevFormDataRef = useRef<string>('');
  // 現在フォーカス中のフィールド名を追跡（入力中のフィールドを保護するため）
  const focusedFieldRef = useRef<keyof TaviFormData | null>(null);
  // フィールドの順序（Enterキーで次のフィールドに移動するため）
  const fieldOrder: (keyof TaviFormData)[] = [
    'case_name',
    'analyst',
    'phases_a',
    'phases_b',
    'ca_score',
    'annulus_area',
    'annulus_peri',
    'annulus_min',
    'annulus_max',
    'stj_min',
    'stj_max',
    'sov_l',
    'sov_r',
    'sov_n',
    'lcc_ht',
    'rcc_ht',
    'ncc_ht',
    'lca_ht',
    'rca_ht',
    'ms_oblique',
    'ms_stretch',
    'perpen_lr',
    'perpen_crca',
    'rootangle',
    'rt_pcia_min',
    'rt_pcia_max',
    'rt_mcia_min',
    'rt_mcia_max',
    'rt_dcia_min',
    'rt_dcia_max',
    'rt_peia_min',
    'rt_peia_max',
    'rt_meia_min',
    'rt_meia_max',
    'rt_cfa_min',
    'rt_cfa_max',
    'lt_pcia_min',
    'lt_pcia_max',
    'lt_mcia_min',
    'lt_mcia_max',
    'lt_dcia_min',
    'lt_dcia_max',
    'lt_peia_min',
    'lt_peia_max',
    'lt_meia_min',
    'lt_meia_max',
    'lt_cfa_min',
    'lt_cfa_max',
    'tao_2ndic',
    'tao_3rdic',
    'rt_dsca_min',
    'rt_dsca_max',
    'rt_msca_min',
    'rt_msca_max',
    'rt_psca_min',
    'rt_psca_max',
    'lt_dsca_min',
    'lt_dsca_max',
    'lt_msca_min',
    'lt_msca_max',
    'lt_psca_min',
    'lt_psca_max',
  ];
  
  // ストアのformDataが変更されたときにフォームをリセット
  useEffect(() => {
    const currentFormDataStr = JSON.stringify(formData);
    // 前回の値と異なる場合のみリセット（無限ループを防ぐ）
    // ただし、フォーカス中のフィールドがある場合はリセットしない（入力中のカーソルを保護）
    if (prevFormDataRef.current !== currentFormDataStr) {
      if (focusedFieldRef.current === null) {
        // フォーカス中のフィールドがない場合のみリセット
        prevFormDataRef.current = currentFormDataStr;
        reset(formData);
      }
      // フォーカス中のフィールドがある場合は、リセットを保留（handleFieldBlurで処理）
    }
  }, [formData, reset]);
  
  // 自動保存用のハンドラー
  const handleAutoSave = () => {
    if (!autoSave) return;
    
    // 既存のタイマーをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // デバウンス: 500ms後に保存
    // ただし、フォーカス中のフィールドがある場合は、フォーカス解除後に保存
    timeoutRef.current = setTimeout(() => {
      // フォーカス中のフィールドがある場合は、保存を遅延させる
      if (focusedFieldRef.current !== null) {
        // フォーカス解除を待つ（追加で200ms待機）
        setTimeout(() => {
          const currentValues = getValues();
          setFormData(currentValues);
        }, 200);
      } else {
        const currentValues = getValues();
        setFormData(currentValues);
      }
    }, 500);
  };

  const onSubmit = (data: TaviFormData, e?: React.BaseSyntheticEvent) => {
    // Enterキーによる送信を防ぐ（送信ボタンからの送信のみ許可）
    if (e && e.nativeEvent && (e.nativeEvent as any).submitter === null) {
      // Enterキーによる送信の場合は何もしない
      return;
    }
    
    const subject = data.case_name || 'TAVI術前CT所見';
    const body = buildBody(data);
    
    if (settings.recipients.length === 0) {
      alert('宛先が設定されていません。設定画面で宛先を設定してください。');
      return;
    }

    openGmailOrMailto(settings.recipients, subject, body);
  };

  // 範囲チェック用の警告を生成（個別のフィールドを監視）
  const getWarning = (fieldName: keyof TaviFormData, min: number, max: number): string | null => {
    const value = watch(fieldName);
    return validateRange(value || '', min, max);
  };

  // フィールドのフォーカス状態を管理
  const handleFieldFocus = (fieldName: keyof TaviFormData) => {
    focusedFieldRef.current = fieldName;
  };

  const handleFieldBlur = () => {
    // 少し遅延させてからフォーカスを解除（連続入力時の保護）
    // 遅延を長くして、自動保存とリセットの競合を防ぐ
    setTimeout(() => {
      focusedFieldRef.current = null;
      // フォーカス解除後に、保留中のリセットを実行
      // さらに少し遅延させて、自動保存の処理が完了するのを待つ
      setTimeout(() => {
        const currentFormDataStr = JSON.stringify(formData);
        if (prevFormDataRef.current !== currentFormDataStr) {
          prevFormDataRef.current = currentFormDataStr;
          reset(formData);
        }
      }, 100);
    }, 200);
  };

  // Enterキーで次のフィールドに移動
  const handleFieldKeyDown = (fieldName: keyof TaviFormData, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Go') {
      e.preventDefault();
      const currentIndex = fieldOrder.indexOf(fieldName);
      if (currentIndex !== -1 && currentIndex < fieldOrder.length - 1) {
        const nextFieldName = fieldOrder[currentIndex + 1];
        const nextInput = document.querySelector(`input[name="${nextFieldName}"]`) as HTMLInputElement;
        if (nextInput) {
          // 少し遅延させてからフォーカス（キーボードの表示を考慮）
          setTimeout(() => {
            nextInput.focus();
            // モバイルの場合、テキストを選択状態にする
            if (nextInput.setSelectionRange) {
              nextInput.setSelectionRange(0, nextInput.value.length);
            }
          }, 50);
        }
      }
    }
  };

  // フォームレベルでEnterキーを処理（フォーム送信を防ぐ）
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // フォーム内のinput要素でEnterキーが押された場合は、フォーム送信を防ぐ
    if (e.key === 'Enter' || e.key === 'Go') {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT') {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  // フォーム送信を処理（Enterキーによる送信を防ぐ）
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Enterキーによる送信を検出して防ぐ
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === 'INPUT' && activeElement !== e.target) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // 送信ボタンからの送信のみ許可
    handleSubmit(onSubmit)(e);
  };

  return (
    <form onSubmit={handleFormSubmit} onKeyDown={handleFormKeyDown} className="space-y-2">
      {/* 基本情報 */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="症例識別名"
            name="case_name"
            register={register}
            error={errors.case_name}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
          />
          <FormField
            label="解析者"
            name="analyst"
            register={register}
            error={errors.analyst}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
          />
        </div>
      </div>

      {/* phases */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="phases_a"
            name="phases_a"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.phases_a}
            type="number"
            step="1"
          />
          <FormField
            label="phases_b"
            name="phases_b"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.phases_b}
            type="number"
            step="1"
          />
        </div>
      </div>

      {/* Ca score */}
      <div className="bg-white p-3 rounded-lg shadow">
        <FormField
          label="Ca score"
          name="ca_score"
          register={register}
          error={errors.ca_score}
          type="number"
          step="0.1"
          onFieldChange={handleAutoSave}
        />
      </div>

      {/* annulus */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="annulus area (mm²)"
            name="annulus_area"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.annulus_area}
            warning={getWarning('annulus_area', 0, 1000)}
            type="number"
            placeholder="例: 50.5"
          />
          <FormField
            label="annulus peri (mm)"
            name="annulus_peri"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.annulus_peri}
            warning={getWarning('annulus_peri', 0, 200)}
            type="number"
          />
          <FormField
            label="annulus min (mm)"
            name="annulus_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.annulus_min}
            warning={getWarning('annulus_min', 0, 100)}
            type="number"
          />
          <FormField
            label="annulus max (mm)"
            name="annulus_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.annulus_max}
            warning={getWarning('annulus_max', 0, 100)}
            type="number"
          />
        </div>
      </div>

      {/* STJ */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="STJ min (mm)"
            name="stj_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.stj_min}
            warning={getWarning('stj_min', 0, 100)}
            type="number"
          />
          <FormField
            label="STJ max (mm)"
            name="stj_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.stj_max}
            warning={getWarning('stj_max', 0, 100)}
            type="number"
          />
        </div>
      </div>

      {/* SOV diameter */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <FormField
            label="SOV diameter L (mm)"
            name="sov_l"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.sov_l}
            warning={getWarning('sov_l', 0, 100)}
            type="number"
          />
          <FormField
            label="SOV diameter R (mm)"
            name="sov_r"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.sov_r}
            warning={getWarning('sov_r', 0, 100)}
            type="number"
          />
          <FormField
            label="SOV diameter N (mm)"
            name="sov_n"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.sov_n}
            warning={getWarning('sov_n', 0, 100)}
            type="number"
          />
        </div>
      </div>

      {/* Heights */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="LCC Ht. (mm)"
            name="lcc_ht"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lcc_ht}
            warning={getWarning('lcc_ht', 0, 100)}
            type="number"
          />
          <FormField
            label="RCC Ht. (mm)"
            name="rcc_ht"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rcc_ht}
            warning={getWarning('rcc_ht', 0, 100)}
            type="number"
          />
          <FormField
            label="NCC Ht. (mm)"
            name="ncc_ht"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.ncc_ht}
            warning={getWarning('ncc_ht', 0, 100)}
            type="number"
          />
          <FormField
            label="LCA Ht. (mm)"
            name="lca_ht"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lca_ht}
            warning={getWarning('lca_ht', 0, 100)}
            type="number"
          />
          <FormField
            label="RCA Ht. (mm)"
            name="rca_ht"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rca_ht}
            warning={getWarning('rca_ht', 0, 100)}
            type="number"
          />
        </div>
      </div>

      {/* MS */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="MS oblique (mm)"
            name="ms_oblique"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.ms_oblique}
            warning={getWarning('ms_oblique', 0, 100)}
            type="number"
          />
          <FormField
            label="MS stretch (mm)"
            name="ms_stretch"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.ms_stretch}
            warning={getWarning('ms_stretch', 0, 100)}
            type="number"
          />
        </div>
      </div>

      {/* perpen */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="perpen L/R (deg.)"
            name="perpen_lr"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.perpen_lr}
            warning={getWarning('perpen_lr', -180, 180)}
            type="number"
            step="0.1"
          />
          <FormField
            label="perpen Cr/Ca (deg.)"
            name="perpen_crca"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.perpen_crca}
            warning={getWarning('perpen_crca', -180, 180)}
            type="number"
            step="0.1"
          />
        </div>
      </div>

      {/* rootangle */}
      <div className="bg-white p-3 rounded-lg shadow">
        <FormField
          label="rootangle (deg.)"
          name="rootangle"
          register={register}
          error={errors.rootangle}
          warning={getWarning('rootangle', -180, 180)}
          type="number"
          step="0.1"
          onFieldChange={handleAutoSave}
          onFieldFocus={handleFieldFocus}
          onFieldBlur={handleFieldBlur}
          onFieldKeyDown={handleFieldKeyDown}
        />
      </div>

      {/* Rt. PCIA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Rt.PCIA min (mm)"
            name="rt_pcia_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_pcia_min}
            warning={getWarning('rt_pcia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.PCIA max (mm)"
            name="rt_pcia_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_pcia_max}
            warning={getWarning('rt_pcia_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Rt. MCIA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Rt.MCIA min (mm)"
            name="rt_mcia_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_mcia_min}
            warning={getWarning('rt_mcia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.MCIA max (mm)"
            name="rt_mcia_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_mcia_max}
            warning={getWarning('rt_mcia_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Rt. DCIA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Rt.DCIA min (mm)"
            name="rt_dcia_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_dcia_min}
            warning={getWarning('rt_dcia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.DCIA max (mm)"
            name="rt_dcia_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_dcia_max}
            warning={getWarning('rt_dcia_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Rt. PEIA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Rt.PEIA min (mm)"
            name="rt_peia_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_peia_min}
            warning={getWarning('rt_peia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.PEIA max (mm)"
            name="rt_peia_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_peia_max}
            warning={getWarning('rt_peia_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Rt. MEIA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Rt.MEIA min (mm)"
            name="rt_meia_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_meia_min}
            warning={getWarning('rt_meia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.MEIA max (mm)"
            name="rt_meia_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_meia_max}
            warning={getWarning('rt_meia_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Rt. CFA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Rt.CFA min (mm)"
            name="rt_cfa_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_cfa_min}
            warning={getWarning('rt_cfa_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.CFA max (mm)"
            name="rt_cfa_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_cfa_max}
            warning={getWarning('rt_cfa_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Lt. PCIA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Lt.PCIA min (mm)"
            name="lt_pcia_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_pcia_min}
            warning={getWarning('lt_pcia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.PCIA max (mm)"
            name="lt_pcia_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_pcia_max}
            warning={getWarning('lt_pcia_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Lt. MCIA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Lt.MCIA min (mm)"
            name="lt_mcia_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_mcia_min}
            warning={getWarning('lt_mcia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.MCIA max (mm)"
            name="lt_mcia_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_mcia_max}
            warning={getWarning('lt_mcia_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Lt. DCIA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Lt.DCIA min (mm)"
            name="lt_dcia_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_dcia_min}
            warning={getWarning('lt_dcia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.DCIA max (mm)"
            name="lt_dcia_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_dcia_max}
            warning={getWarning('lt_dcia_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Lt. PEIA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Lt.PEIA min (mm)"
            name="lt_peia_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_peia_min}
            warning={getWarning('lt_peia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.PEIA max (mm)"
            name="lt_peia_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_peia_max}
            warning={getWarning('lt_peia_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Lt. MEIA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Lt.MEIA min (mm)"
            name="lt_meia_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_meia_min}
            warning={getWarning('lt_meia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.MEIA max (mm)"
            name="lt_meia_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_meia_max}
            warning={getWarning('lt_meia_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Lt. CFA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Lt.CFA min (mm)"
            name="lt_cfa_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_cfa_min}
            warning={getWarning('lt_cfa_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.CFA max (mm)"
            name="lt_cfa_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_cfa_max}
            warning={getWarning('lt_cfa_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* TAo */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="TAo 2ndIC (mm)"
            name="tao_2ndic"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.tao_2ndic}
            warning={getWarning('tao_2ndic', 0, 100)}
            type="number"
          />
          <FormField
            label="TAo 3rdIC (mm)"
            name="tao_3rdic"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.tao_3rdic}
            warning={getWarning('tao_3rdic', 0, 100)}
            type="number"
          />
        </div>
      </div>

      {/* Rt. DSCA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Rt.DSCA min (mm)"
            name="rt_dsca_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_dsca_min}
            warning={getWarning('rt_dsca_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.DSCA max (mm)"
            name="rt_dsca_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_dsca_max}
            warning={getWarning('rt_dsca_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Rt. MSCA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Rt.MSCA min (mm)"
            name="rt_msca_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_msca_min}
            warning={getWarning('rt_msca_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.MSCA max (mm)"
            name="rt_msca_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_msca_max}
            warning={getWarning('rt_msca_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Rt. PSCA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Rt.PSCA min (mm)"
            name="rt_psca_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_psca_min}
            warning={getWarning('rt_psca_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.PSCA max (mm)"
            name="rt_psca_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.rt_psca_max}
            warning={getWarning('rt_psca_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Lt. DSCA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Lt.DSCA min (mm)"
            name="lt_dsca_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_dsca_min}
            warning={getWarning('lt_dsca_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.DSCA max (mm)"
            name="lt_dsca_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_dsca_max}
            warning={getWarning('lt_dsca_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Lt. MSCA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Lt.MSCA min (mm)"
            name="lt_msca_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_msca_min}
            warning={getWarning('lt_msca_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.MSCA max (mm)"
            name="lt_msca_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_msca_max}
            warning={getWarning('lt_msca_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* Lt. PSCA */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="Lt.PSCA min (mm)"
            name="lt_psca_min"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_psca_min}
            warning={getWarning('lt_psca_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.PSCA max (mm)"
            name="lt_psca_max"
            register={register}
            onFieldChange={handleAutoSave}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onFieldKeyDown={handleFieldKeyDown}
            error={errors.lt_psca_max}
            warning={getWarning('lt_psca_max', 0, 50)}
            type="number"
          />
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="bg-white p-3 rounded-lg shadow">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
        >
          Gmailで作成
        </button>
      </div>
    </form>
  );
}

