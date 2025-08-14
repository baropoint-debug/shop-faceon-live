'use client';

import { useMemo, useState } from 'react';

type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string; at: string };
type ChatConversation = { id: string; userId: string; startedAt: string; messages: ChatMessage[] };
type ChatUser = { id: string; name: string; email?: string };

export default function AddonChats() {
  // 샘플 데이터 (백엔드 연동 시 교체)
  const users: ChatUser[] = [
    { id: 'u1', name: '홍길동', email: 'hong@example.com' },
    { id: 'u2', name: '김영희', email: 'kim@example.com' },
  ];
  const conversations: ChatConversation[] = [
    {
      id: 'c1',
      userId: 'u1',
      startedAt: '2025-08-14 14:12',
      messages: [
        { id: 'm1', role: 'user', text: '안녕하세요, 제품 가격 알려주세요', at: '14:12' },
        { id: 'm2', role: 'assistant', text: '안녕하세요! 기본형은 9,900원입니다.', at: '14:12' },
        { id: 'm3', role: 'user', text: '주말에도 상담 가능해요?', at: '14:13' },
        { id: 'm4', role: 'assistant', text: '네, 주말 11:00~18:00 상담 가능합니다.', at: '14:13' },
      ],
    },
    {
      id: 'c2',
      userId: 'u1',
      startedAt: '2025-08-14 15:01',
      messages: [
        { id: 'm5', role: 'user', text: '배송은 얼마나 걸리나요?', at: '15:01' },
        { id: 'm6', role: 'assistant', text: '서울/수도권 1~2일, 지방은 2~3일 소요됩니다.', at: '15:01' },
      ],
    },
    {
      id: 'c3',
      userId: 'u2',
      startedAt: '2025-08-13 10:05',
      messages: [
        { id: 'm7', role: 'user', text: '주소가 어디인가요?', at: '10:05' },
        { id: 'm8', role: 'assistant', text: '서울시 강남구 테헤란로 123, 1층입니다.', at: '10:06' },
      ],
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [openConversationId, setOpenConversationId] = useState<string | null>(null);
  const [faqModal, setFaqModal] = useState<{ open: boolean; question: string; answer: string }>(
    { open: false, question: '', answer: '' }
  );

  const userSummaries = useMemo(() => {
    return users
      .map((user) => {
        const userConvos = conversations.filter((c) => c.userId === user.id);
        const totalMessages = userConvos.reduce((sum, c) => sum + c.messages.length, 0);
        const lastAt = userConvos.map((c) => c.startedAt).sort().slice(-1)[0];
        return {
          user,
          totalConversations: userConvos.length,
          totalMessages,
          lastAt: lastAt || '-',
          conversations: userConvos,
        };
      })
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.user.name.toLowerCase().includes(q) ||
          (s.user.email ? s.user.email.toLowerCase().includes(q) : false) ||
          s.user.id.toLowerCase().includes(q)
        );
      });
  }, [users, conversations, searchQuery]);

  return (
    <main className="addon-container" style={{ paddingTop: 24, paddingBottom: 24, flex:1 }}>
      <div className="addon-inner">
        <div className="addon-card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="addon-title-row" style={{ alignItems:'flex-end' }}>
            <strong>채팅 리스트</strong>
            <div className="addon-help">사용자별 대화 수, 메시지 수를 확인하고 대화 내용을 자세히 살펴보세요. 대화 내용을 보고 FAQ로 바로 추가하여 더욱 똑똑한 챗봇을 만들어보세요.</div>
          </div>
        </div>
      </div>

      <div className="addon-card addon-inner" style={{ padding: 16, maxWidth: 'var(--addon-max)' }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom: 12 }}>
          <input className="addon-input" placeholder="사용자 이름/이메일/ID 검색" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
        </div>

        <ul style={{ display:'grid', gap:12 }}>
          {userSummaries.map((summary) => (
            <li
              key={summary.user.id}
              className="addon-card addon-card-clickable addon-accent-left addon-accent-blue"
              style={{ padding: 12 }}
              onClick={() => {
                const next = expandedUserId === summary.user.id ? null : summary.user.id;
                setExpandedUserId(next);
                setOpenConversationId(null);
              }}
            >
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                <div style={{ display:'grid', gap:4 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <strong>{summary.user.name}</strong>
                    {summary.user.email ? (
                      <span className="addon-subtle">{summary.user.email}</span>
                    ) : (
                      <span className="addon-badge">비로그인</span>
                    )}
                  </div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <span className="addon-badge">대화 {summary.totalConversations}건</span>
                    <span className="addon-badge">메시지 {summary.totalMessages}개</span>
                    <span className="addon-subtle">최근: {summary.lastAt}</span>
                  </div>
                </div>
                {/* 버튼 제거: 카드 전체 클릭으로 토글 */}
              </div>

              {expandedUserId === summary.user.id && (
                <div style={{ marginTop: 12, display:'grid', gap:8 }}>
                  {summary.conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="addon-card addon-card-clickable addon-accent-left addon-accent-violet"
                      style={{ padding: 12 }}
                      onClick={(e)=>{ e.stopPropagation(); setOpenConversationId(openConversationId === conv.id ? null : conv.id); }}
                    >
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
                        <div style={{ display:'grid', gap:4 }}>
                          <strong>대화 시작: {conv.startedAt}</strong>
                          <span className="addon-subtle">메시지 {conv.messages.length}개</span>
                        </div>
                        {/* 버튼 제거: 카드 전체 클릭으로 토글 */}
                      </div>

                      {openConversationId === conv.id && (
                        <div className="addon-chat" style={{ marginTop: 10 }}>
                          <div className="addon-chat-messages">
                            <div className="addon-chat-timestamp">{conv.startedAt}</div>
                            {conv.messages.map((m, idx) => {
                              const isUser = m.role === 'user';
                              const nextAssistant = isUser ? conv.messages.slice(idx + 1).find((msg) => msg.role === 'assistant') : undefined;
                              return (
                                <div key={m.id} className={`addon-chat-row ${isUser ? 'addon-chat-row-right' : ''}`}>
                                  {!isUser && <span className="addon-avatar">AI</span>}
                                  <div className={`addon-bubble ${isUser ? 'addon-bubble-user' : 'addon-bubble-ai'}`}>{m.text}</div>
                                  {isUser && <span className="addon-avatar">U</span>}
                                  {isUser && (
                                    <button
                                      className="addon-btn addon-btn-outline addon-btn-xs"
                                      style={{ marginLeft: 8 }}
                                      onClick={(e)=>{
                                        e.stopPropagation();
                                        setFaqModal({ open: true, question: m.text, answer: nextAssistant?.text || '' });
                                      }}
                                    >FAQ로 저장</button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
          {userSummaries.length === 0 && (
            <li className="addon-help">검색 결과가 없습니다.</li>
          )}
        </ul>
      </div>

      {/* FAQ 저장 모달 */}
      {faqModal.open && (
        <div className="addon-modal-overlay" role="dialog" aria-modal="true">
          <div className="addon-modal">
            <div className="addon-modal-title">FAQ로 저장</div>
            <input className="addon-input" placeholder="질문" value={faqModal.question} onChange={(e)=>setFaqModal({ ...faqModal, question: e.target.value })} />
            <textarea className="addon-textarea" placeholder="답변" value={faqModal.answer} onChange={(e)=>setFaqModal({ ...faqModal, answer: e.target.value })} />
            <div className="addon-modal-actions">
              <button className="addon-btn addon-btn-outline" onClick={()=>setFaqModal({ open:false, question:'', answer:'' })}>취소</button>
              <button className="addon-btn addon-btn-primary" onClick={()=>{ try { const list = JSON.parse(localStorage.getItem('addon_faq')||'[]'); list.unshift({ id: `faq_${Date.now()}`, question: faqModal.question, answer: faqModal.answer }); localStorage.setItem('addon_faq', JSON.stringify(list)); } catch {} setFaqModal({ open:false, question:'', answer:'' }); }}>저장</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


