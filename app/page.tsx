'use client';

import { useState } from 'react';
import TaviForm from '@/components/TaviForm';
import Settings from '@/components/Settings';

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            TAVI術前CT所見入力
          </h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {showSettings ? 'フォームに戻る' : '設定'}
          </button>
        </div>

        {showSettings ? <Settings /> : <TaviForm />}
      </div>
    </main>
  );
}

