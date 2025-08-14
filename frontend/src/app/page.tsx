'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AddonHome() {
  return (
    <main className="addon-container" style={{ paddingTop: 24, paddingBottom: 24, flex:1 }}>

      {/* Hero */}
      <section className="addon-inner addon-hero addon-shadow-md" style={{ padding: 28 }}>
        <div className="addon-title-row" style={{ alignItems:'flex-end' }}>
          <div style={{ display:'grid', gap:10 }}>
            <span className="addon-kicker">Enterprise</span>
            <h1 className="addon-display"><span className="addon-gradient-text">기업용 숏폼 AI 챗봇 서비스</span></h1>
            <p className="addon-lead">고객 질문을 이해하고 답변을 생성, 답변에 맞는 태그의 숏폼 동영상을 함께 재생하여 이해와 전환을 높입니다.</p>
            <p className="addon-lead" style={{ marginTop: -6 }}>텍스트+동영상으로 서비스 소개와 리드 수집을 동시에 수행하는 대화형 챗봇 서비스</p>
            <div className="addon-cta-group" style={{ marginTop: 4 }}>
              <Link className="addon-btn addon-btn-primary" href="/dashboard">내 챗봇 대화하기</Link>
              <Link className="addon-btn addon-btn-outline" href="/datasets">자료 등록하기</Link>
            </div>
            <span className="addon-subtle">AI 자동 숏폼 채팅 · 설정 1분 · 웹/파일/FAQ 크롤링</span>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="addon-inner" style={{ margin: '16px auto' }}>
        <div className="addon-grid-12">
          <div className="addon-card addon-shadow-sm addon-col-4" style={{ padding: 20 }}>
            <div className="addon-feature-icon">🎯</div>
            <h3 style={{ fontWeight:800, marginTop:10, marginBottom: 6 }}>태그 기반 숏폼</h3>
            <p style={{ color:'#4B5563', fontSize:14 }}>답변에 맞는 태그를 선택해 관련 동영상을 자동 재생하여 전달력을 강화합니다.</p>
          </div>
          <div className="addon-card addon-shadow-sm addon-col-4" style={{ padding: 20 }}>
            <div className="addon-feature-icon">📇</div>
            <h4 style={{ fontWeight:800, marginTop:10, marginBottom:6 }}>리드 유도</h4>
            <p style={{ color:'#4B5563', fontSize:14 }}>페르소나 설정 시 리드 유도 목표(전화, 카톡 또는 예약 링크)를 지정하면 AI가 대화 중 자동으로 유도합니다.</p>
          </div>
          <div className="addon-card addon-shadow-sm addon-col-4" style={{ padding: 20 }}>
            <div className="addon-feature-icon">🔗</div>
            <h3 style={{ fontWeight:800, marginTop:10, marginBottom: 6 }}>데이터 연동</h3>
            <p style={{ color:'#4B5563', fontSize:14 }}>웹 크롤링 · 파일 · FAQ를 신속히 반영하며 FAQ를 우선 참고합니다.</p>
          </div>
        </div>
      </section>

      {/* 동작 방식 */}
      <section className="addon-card addon-inner addon-shadow-sm" style={{ padding: 22, margin: '16px auto' }}>
        <h3 style={{ fontWeight:900, fontSize:18, marginBottom: 10 }}>어떻게 동작하나요?</h3>
        <hr className="addon-divider" />
        <ol style={{ color:'#374151', display:'grid', gap:10, marginTop: 12 }}>
          <li><strong>1)</strong> 업종을 선택하고 추천 태그/소재를 검토합니다.</li>
          <li><strong>2)</strong> 업종에 맞는 추천 페르소나를 선택 후 세부 수정하세요.</li>
          <li><strong>3)</strong> 데이터(웹/파일/FAQ)를 등록하고 채팅 내역을 확인하여 FAQ를 업데이트하세요.</li>
          <li><strong>4)</strong> 고객 질문 + 페르소나 + 태그를 조합해 답변과 함께 태그 숏폼이 재생됩니다.</li>
        </ol>
      </section>

      {/* 추천 챗봇: 페이지 내 임베드 미리보기 */}
      <div className="addon-inner" style={{ marginTop: 16 }}>
        <section className="addon-card addon-shadow-sm" style={{ padding: 16 }}>
          <h3 style={{ fontWeight:900, marginBottom: 12 }}>예시 챗봇</h3>
          <div style={{ display:'grid', gap:12 }} className="addon-grid-3">
            <ChatEmbedCard label="일반 채팅 1" href="/chat/1" />
            <ChatEmbedCard label="일반 채팅 2" href="/chat/2" />
            <ChatEmbedCard label="일반 채팅 3" href="/chat/3" />
          </div>
        </section>
      </div>
    </main>
  );
}

function ChatEmbedCard({ label, href }: { label: string; href: string }) {
  return (
    <div className="addon-card" style={{ padding: 12 }}>
      <div style={{ fontWeight:700, marginBottom: 8 }}>{label}</div>
      <iframe
        src={href}
        title={label}
        style={{ width:'100%', height: 640, border:'1px solid #E5E7EB', borderRadius: 12 }}
        allow="microphone; camera; autoplay; clipboard-read; clipboard-write"
      />
    </div>
  );
}

// 샘플 프리뷰 컴포넌트 제거


