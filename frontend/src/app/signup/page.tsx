'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function AddonSignup() {
	const router = useRouter();
	const redirect = useSearchParams().get('redirect') || '/';
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [agree, setAgree] = useState(false);
	const [error, setError] = useState('');

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		if (!name.trim()) return setError('이름을 입력하세요.');
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('올바른 이메일을 입력하세요.');
		if (password.length < 6) return setError('비밀번호는 6자 이상 입력하세요.');
		if (!agree) return setError('약관에 동의해야 합니다.');
		try {
			// 데모: 로컬 저장. 실제 구현 시 API로 대체
			localStorage.setItem('addon_user', JSON.stringify({ name, email }));
			localStorage.setItem('addon_auth', '1');
			router.push(redirect);
		} catch {
			setError('알 수 없는 오류가 발생했습니다.');
		}
	};

	return (
		<main className="addon-container" style={{ paddingTop: 24, paddingBottom: 24 }}>
			<div className="addon-inner">
				<div className="addon-card" style={{ maxWidth: 520, margin: '0 auto', padding: 16 }}>
					<h1 style={{ fontWeight: 800, fontSize: 20, marginBottom: 12 }}>회원가입</h1>
					<form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
						<label>
							<div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>이름</div>
							<input className="addon-input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="홍길동" />
						</label>
						<label>
							<div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>이메일</div>
							<input className="addon-input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
						</label>
						<label>
							<div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>비밀번호</div>
							<input className="addon-input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="6자 이상" />
						</label>
						<label style={{ display:'flex', alignItems:'center', gap:8 }}>
							<input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
							<span style={{ fontSize: 13 }}>이용약관과 개인정보처리방침에 동의합니다.</span>
						</label>
						{error && <div className="addon-help" style={{ color:'#B91C1C', borderColor:'#FCA5A5', background:'#FEF2F2' }}>{error}</div>}
						<button className="addon-btn addon-btn-primary" type="submit">가입하기</button>
					</form>
				</div>
			</div>
		</main>
	);
}


