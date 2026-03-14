export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTimeRemaining(endTime: string): string {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return '종료됨';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}일 ${hours}시간 남음`;
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`;
  return `${minutes}분 남음`;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    SCHEDULED: '경매 예정',
    ACTIVE: '진행중',
    ENDED: '마감',
    CANCELLED: '취소됨',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-700',
    ACTIVE: 'bg-green-100 text-green-700',
    ENDED: 'bg-gray-100 text-gray-600',
    CANCELLED: 'bg-red-100 text-red-600',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
}
