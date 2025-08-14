'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AddonHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [open, setOpen] = useState(false);

  // 임시 로그인 체크: add01_ 접두 사용자 아이디/비밀번호 보관 가정
  useEffect(() => {
    try { setIsAuthed(localStorage.getItem('addon_auth') === '1'); } catch {}
  }, [pathname]);

  const ensureAuth = (href: string) => (e: React.MouseEvent) => {
    if (!isAuthed) {
      e.preventDefault();
      router.push('/login?redirect=' + encodeURIComponent(href));
    }
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      onClick={ensureAuth(href)}
      className={`addon-btn addon-btn-outline ${pathname === href ? 'addon-active' : ''}`}
    >
      {children}
    </Link>
  );

  const handleLoginLogout = () => {
    try {
      if (isAuthed) {
        localStorage.removeItem('addon_auth');
        setIsAuthed(false);
        router.refresh();
      } else {
        router.push('/login?redirect=' + encodeURIComponent(pathname || '/'));
      }
    } catch {
      router.push('/login');
    }
  };

  return (
    <header className="addon-header">
      <div className="addon-header-inner">
        <Link href="/" className="addon-brand" aria-label="서비스 소개로 이동">
          <img src="/logo.png" alt="Addon" className="addon-brand-icon" />
          <span className="addon-brand-title">FaceOn Biz</span>
        </Link>
        {/* 데스크톱 내비 */}
        <nav className="addon-nav">
          <Link href="/" className="addon-btn addon-btn-outline">서비스 소개</Link>
          <NavLink href="/dashboard">페르소나</NavLink>
          <NavLink href="/datasets">데이터셋·설정</NavLink>
          <NavLink href="/chats">채팅 리스트</NavLink>
          <a
            href="/chat/1"
            className="addon-btn addon-btn-outline"
            onClick={(e) => {
              e.preventDefault();
              try {
                window.open('/chat/1', 'faceon-chat', 'width=420,height=740,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes');
              } catch {
                window.open('/chat/1', '_blank');
              }
            }}
          >내 챗봇 대화하기</a>
        </nav>
        {/* 모바일 햄버거 */}
        <button
          className="addon-btn addon-btn-outline addon-mobile-only"
          onClick={() => setOpen((v) => !v)}
          aria-label="메뉴"
        >
          ☰
        </button>
        {/* 로그인/회원가입/로그아웃 (모바일에서는 햄버거 내부에만 표시) */}
        <div className="addon-desktop-only addon-auth-actions">
          {!isAuthed && (
            <Link className="addon-btn addon-btn-outline" href="/signup">
              회원가입
            </Link>
          )}
          <button className="addon-btn addon-btn-outline" onClick={handleLoginLogout}>
            {isAuthed ? '로그아웃' : '로그인'}
          </button>
        </div>
      </div>
      {/* 모바일 드로어 메뉴 */}
      {open && (
        <div className="addon-card" style={{ position:'fixed', top:'56px', left:0, right:0, zIndex:59, padding:12 }}>
          <div style={{ display:'grid', gap:8 }}>
            <Link href="/" className="addon-btn addon-btn-outline" onClick={()=>setOpen(false)}>서비스 소개</Link>
            <a className="addon-btn addon-btn-outline" href="/dashboard" onClick={(e)=>{ ensureAuth('/dashboard')(e as any); setOpen(false); }}>페르소나</a>
            <a className="addon-btn addon-btn-outline" href="/datasets" onClick={(e)=>{ ensureAuth('/datasets')(e as any); setOpen(false); }}>데이터셋·설정</a>
            <a className="addon-btn addon-btn-outline" href="/chats" onClick={(e)=>{ ensureAuth('/chats')(e as any); setOpen(false); }}>채팅 리스트</a>
            <a className="addon-btn addon-btn-outline" href="/chat/1" onClick={(e)=>{ e.preventDefault(); setOpen(false); try { window.open('/chat/1', 'faceon-chat', 'width=420,height=740,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'); } catch { window.open('/chat/1','_blank'); } }}>내 챗봇 대화하기</a>
            {!isAuthed && <Link className="addon-btn addon-btn-outline" href="/signup" onClick={()=>setOpen(false)}>회원가입</Link>}
            <button className="addon-btn addon-btn-outline" onClick={()=>{ setOpen(false); handleLoginLogout(); }}>{isAuthed ? '로그아웃' : '로그인'}</button>
          </div>
        </div>
      )}
    </header>
  );
}


