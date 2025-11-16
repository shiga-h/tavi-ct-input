'use client';

import { useState } from 'react';
import { useFormStore } from '@/store/formStore';

export default function Settings() {
  const { settings, setSettings, autoSave, setAutoSave } = useFormStore();
  const [recipientsInput, setRecipientsInput] = useState(
    settings.recipients.join(', ')
  );

  const handleSave = () => {
    const recipients = recipientsInput
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r !== '');
    setSettings({ recipients });
    alert('設定を保存しました');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">設定</h2>

      <div className="space-y-6">
        {/* 宛先設定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メール宛先（カンマ区切り）
          </label>
          <input
            type="text"
            value={recipientsInput}
            onChange={(e) => setRecipientsInput(e.target.value)}
            placeholder="例: user1@example.com, user2@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            複数の宛先はカンマで区切ってください
          </p>
        </div>

        {/* 自動保存設定 */}
        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              自動保存を有効にする
            </span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            自動保存が有効な場合、入力内容が自動的にローカルストレージに保存されます
          </p>
        </div>

        {/* 保存ボタン */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          設定を保存
        </button>
      </div>
    </div>
  );
}


