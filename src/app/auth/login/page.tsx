'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError('Email hoặc mật khẩu không đúng');
    } else {
      router.push('/game');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>
        <p className="text-sm text-center mt-4 text-zinc-500">
          Chưa có tài khoản?{' '}
          <a href="/auth/signup" className="text-red-600 hover:underline">Đăng ký</a>
        </p>
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <a href="/" className="block text-sm text-center text-zinc-500 hover:text-zinc-700">
            ← Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
