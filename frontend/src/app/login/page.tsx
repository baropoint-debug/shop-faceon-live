'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function AddonLoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get('redirect') || '/dashboard';
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // 임시 정책: add01_ 접두만 통과
    if (id.startsWith('add01_') && pw.startsWith('add01_')) {
      try { localStorage.setItem('addon_auth', '1'); } catch {}
      router.push(redirect);
    } else {
      alert('제휴 계정 형식이 올바르지 않습니다. add01_ 접두를 사용하세요.');
    }
  };
  return (
    <main className="addon-container" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <div className="addon-card" style={{ maxWidth: 420, margin: '48px auto', padding: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>제휴사 로그인</h1>
        <form onSubmit={submit} style={{ display:'grid', gap: 10 }}>
          <input className="addon-input" placeholder="아이디 (add01_*)" value={id} onChange={(e)=>setId(e.target.value)} />
          <input className="addon-input" type="password" placeholder="비밀번호 (add01_*)" value={pw} onChange={(e)=>setPw(e.target.value)} />
          <button className="addon-btn addon-btn-primary" type="submit">로그인</button>
        </form>
        <p style={{ fontSize:12, color:'#6B7280', marginTop: 8 }}>이메일/비밀번호를 사용하는 당사 로그인 체계와는 별도로 제휴 전용 접두 형식을 사용합니다.</p>
      </div>
    </main>
  );
}


