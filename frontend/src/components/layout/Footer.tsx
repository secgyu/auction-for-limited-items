export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h3 className="text-white text-xl font-bold mb-2">Nafal</h3>
            <p className="text-sm">믿을 수 있는 가치 플랫폼</p>
            <p className="text-sm">갖고 싶은 한정판 제품은 다 나팔에서</p>
          </div>
          <div className="text-sm space-y-1">
            <p>마이리더팀 | 자원 순환 플랫폼</p>
            <p>이메일: contact@nafal.kr</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-4 text-sm text-center">
          &copy; 2026 Nafal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
