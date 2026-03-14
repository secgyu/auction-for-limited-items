'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', description: '', category: '', condition: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('files', f));

    try {
      const { data } = await api.post<{ urls: string[] }>('/uploads/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages((prev) => [...prev, ...data.urls]);
      toast.success('이미지가 업로드되었습니다');
    } catch {
      toast.error('이미지 업로드에 실패했습니다');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/products', { ...form, images });
      toast.success('상품이 등록되었습니다');
      router.push('/admin/products');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : msg || '등록에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">상품 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">상품명</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">설명</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">카테고리</label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            >
              <option value="">선택</option>
              <option value="가구">가구</option>
              <option value="패션">패션</option>
              <option value="전자제품">전자제품</option>
              <option value="예술품">예술품</option>
              <option value="빈티지">빈티지</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">상태</label>
            <select
              required
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            >
              <option value="">선택</option>
              <option value="새 상품">새 상품</option>
              <option value="거의 새것">거의 새것</option>
              <option value="양호">양호</option>
              <option value="사용감 있음">사용감 있음</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">이미지</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full text-sm"
          />
          {images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {images.map((url, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A1A1A] text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? '등록 중...' : '상품 등록'}
        </button>
      </form>
    </div>
  );
}
