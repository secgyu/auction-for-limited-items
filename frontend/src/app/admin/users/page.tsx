'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { formatDate } from '@/lib/format';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { bids: number; wonAuctions: number };
}

interface UsersResponse {
  data: AdminUser[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<UsersResponse>('/admin/users?limit=50')
      .then((res) => setUsers(res.data.data))
      .catch(() => toast.error('회원 목록을 불러올 수 없습니다'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">고객 관리</h1>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">이름</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">이메일</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">연락처</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">역할</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">입찰수</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">낙찰수</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">가입일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 text-gray-400">{user.phone || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{user._count.bids}</td>
                  <td className="px-4 py-3 text-right">{user._count.wonAuctions}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
