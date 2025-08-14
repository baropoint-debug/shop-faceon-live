'use client';

import { useState } from 'react';

export default function AddonChatPage() {
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user'|'assistant'; text: string }>>([
    { id: 'm1', role: 'assistant', text: '안녕하세요! 무엇을 도와드릴까요?' }
  ]);
  const [text, setText] = useState('');

  const send = () => {
    const t = text.trim();
    if (!t) return;
    const id = String(Date.now());
    setMessages((prev) => [...prev, { id: id+'u', role: 'user', text: t }, { id: id+'a', role: 'assistant', text: '샘플 응답입니다 (태그 기반 동영상 재생 예정).' }]);
    setText('');
  };

  return (
    <main className="addon-container" style={{ paddingTop: 24, paddingBottom: 24, flex:1 }}>
      <div className="addon-card" style={{ padding: 12, marginBottom: 12, display:'flex', justifyContent:'space-between', alignItems:'center', gap:8, maxWidth: 1400, margin: '0 auto 12px' }}>
        <strong>내 챗봇</strong>
        <div className="addon-badge">엔터프라이즈 데모</div>
      </div>

      {/* 대화 영역 */}
      <div className="addon-card" style={{ height: '70vh', display:'flex', flexDirection:'column', maxWidth: 1400, margin:'0 auto' }}>
        <div style={{ flex:1, overflowY:'auto', padding: 12, display:'grid', gap: 8 }}>
          {messages.map((m) => (
            <div key={m.id} style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '70%', padding: '8px 12px', borderRadius: 12, background: m.role==='user' ? '#3B82F6' : '#F3F4F6', color: m.role==='user' ? '#fff' : '#111' }}>
                <div style={{ fontSize: 14 }}>{m.text}</div>
              </div>
            </div>
          ))}
        </div>
        {/* 숏폼 플레이 자리 */}
        <div style={{ borderTop:'1px solid #E5E7EB', padding: 12 }}>
          <video src="" style={{ width:'100%', borderRadius: 12, background:'#000' }} controls={false} autoPlay muted />
          <div style={{ fontSize:12, color:'#6B7280', marginTop: 6 }}>태그 기반 동영상이 여기 재생됩니다.</div>
        </div>
      </div>

      {/* 입력 */}
      <div className="addon-card" style={{ marginTop: 12, padding: 12, display:'flex', gap: 8, maxWidth: 1400, marginLeft:'auto', marginRight:'auto' }}>
        <input className="addon-input" value={text} onChange={(e)=>setText(e.target.value)} placeholder="메시지를 입력하세요" onKeyDown={(e)=>{ if (e.key==='Enter') send(); }} />
        <button className="addon-btn addon-btn-primary" onClick={send}>전송</button>
      </div>
    </main>
  );
}


