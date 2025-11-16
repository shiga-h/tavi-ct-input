'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, validateRange } from '@/lib/validation';
import { TaviFormData } from '@/types/form';
import { useFormStore } from '@/store/formStore';
import { buildBody, openGmailOrMailto } from '@/lib/email';
import FormField from './FormField';
import { useRef } from 'react';

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
  
  // 自動保存用のハンドラー
  const handleAutoSave = () => {
    if (!autoSave) return;
    
    // 既存のタイマーをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // デバウンス: 500ms後に保存
    timeoutRef.current = setTimeout(() => {
      const currentValues = getValues();
      setFormData(currentValues);
    }, 500);
  };

  const onSubmit = (data: TaviFormData) => {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {/* 基本情報 */}
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            label="症例識別名"
            name="case_name"
            register={register}
            error={errors.case_name}
            onFieldChange={handleAutoSave}
          />
          <FormField
            label="解析者"
            name="analyst"
            register={register}
            error={errors.analyst}
            onFieldChange={handleAutoSave}
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
            error={errors.phases_a}
            type="number"
            step="1"
          />
          <FormField
            label="phases_b"
            name="phases_b"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.annulus_peri}
            warning={getWarning('annulus_peri', 0, 200)}
            type="number"
          />
          <FormField
            label="annulus min (mm)"
            name="annulus_min"
            register={register}
            onFieldChange={handleAutoSave}
            error={errors.annulus_min}
            warning={getWarning('annulus_min', 0, 100)}
            type="number"
          />
          <FormField
            label="annulus max (mm)"
            name="annulus_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.stj_min}
            warning={getWarning('stj_min', 0, 100)}
            type="number"
          />
          <FormField
            label="STJ max (mm)"
            name="stj_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.sov_l}
            warning={getWarning('sov_l', 0, 100)}
            type="number"
          />
          <FormField
            label="SOV diameter R (mm)"
            name="sov_r"
            register={register}
            onFieldChange={handleAutoSave}
            error={errors.sov_r}
            warning={getWarning('sov_r', 0, 100)}
            type="number"
          />
          <FormField
            label="SOV diameter N (mm)"
            name="sov_n"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.lcc_ht}
            warning={getWarning('lcc_ht', 0, 100)}
            type="number"
          />
          <FormField
            label="RCC Ht. (mm)"
            name="rcc_ht"
            register={register}
            onFieldChange={handleAutoSave}
            error={errors.rcc_ht}
            warning={getWarning('rcc_ht', 0, 100)}
            type="number"
          />
          <FormField
            label="NCC Ht. (mm)"
            name="ncc_ht"
            register={register}
            onFieldChange={handleAutoSave}
            error={errors.ncc_ht}
            warning={getWarning('ncc_ht', 0, 100)}
            type="number"
          />
          <FormField
            label="LCA Ht. (mm)"
            name="lca_ht"
            register={register}
            onFieldChange={handleAutoSave}
            error={errors.lca_ht}
            warning={getWarning('lca_ht', 0, 100)}
            type="number"
          />
          <FormField
            label="RCA Ht. (mm)"
            name="rca_ht"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.ms_oblique}
            warning={getWarning('ms_oblique', 0, 100)}
            type="number"
          />
          <FormField
            label="MS stretch (mm)"
            name="ms_stretch"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.rt_pcia_min}
            warning={getWarning('rt_pcia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.PCIA max (mm)"
            name="rt_pcia_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.rt_mcia_min}
            warning={getWarning('rt_mcia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.MCIA max (mm)"
            name="rt_mcia_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.rt_dcia_min}
            warning={getWarning('rt_dcia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.DCIA max (mm)"
            name="rt_dcia_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.rt_peia_min}
            warning={getWarning('rt_peia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.PEIA max (mm)"
            name="rt_peia_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.rt_meia_min}
            warning={getWarning('rt_meia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.MEIA max (mm)"
            name="rt_meia_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.rt_cfa_min}
            warning={getWarning('rt_cfa_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.CFA max (mm)"
            name="rt_cfa_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.lt_pcia_min}
            warning={getWarning('lt_pcia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.PCIA max (mm)"
            name="lt_pcia_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.lt_mcia_min}
            warning={getWarning('lt_mcia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.MCIA max (mm)"
            name="lt_mcia_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.lt_dcia_min}
            warning={getWarning('lt_dcia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.DCIA max (mm)"
            name="lt_dcia_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.lt_peia_min}
            warning={getWarning('lt_peia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.PEIA max (mm)"
            name="lt_peia_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.lt_meia_min}
            warning={getWarning('lt_meia_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.MEIA max (mm)"
            name="lt_meia_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.lt_cfa_min}
            warning={getWarning('lt_cfa_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.CFA max (mm)"
            name="lt_cfa_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.tao_2ndic}
            warning={getWarning('tao_2ndic', 0, 100)}
            type="number"
          />
          <FormField
            label="TAo 3rdIC (mm)"
            name="tao_3rdic"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.rt_dsca_min}
            warning={getWarning('rt_dsca_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.DSCA max (mm)"
            name="rt_dsca_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.rt_msca_min}
            warning={getWarning('rt_msca_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.MSCA max (mm)"
            name="rt_msca_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.rt_psca_min}
            warning={getWarning('rt_psca_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Rt.PSCA max (mm)"
            name="rt_psca_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.lt_dsca_min}
            warning={getWarning('lt_dsca_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.DSCA max (mm)"
            name="lt_dsca_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.lt_msca_min}
            warning={getWarning('lt_msca_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.MSCA max (mm)"
            name="lt_msca_max"
            register={register}
            onFieldChange={handleAutoSave}
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
            error={errors.lt_psca_min}
            warning={getWarning('lt_psca_min', 0, 50)}
            type="number"
          />
          <FormField
            label="Lt.PSCA max (mm)"
            name="lt_psca_max"
            register={register}
            onFieldChange={handleAutoSave}
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

