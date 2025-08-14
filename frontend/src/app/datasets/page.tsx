'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type WebsiteItem = { id: string; url: string; lastRefreshedAt?: string };
type UploadedFileItem = { id: string; name: string; sizeKB: number };
type FaqItem = { id: string; question: string; answer: string };

export default function AddonDatasets() {
	const router = useRouter();
	const [websiteUrlInput, setWebsiteUrlInput] = useState('');
	const [websiteItems, setWebsiteItems] = useState<WebsiteItem[]>([]);
	const [websiteError, setWebsiteError] = useState('');

	const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);

	const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
	const [faqSearchQuery, setFaqSearchQuery] = useState('');
	const filteredFaqItems = useMemo(() => {
		if (!faqSearchQuery.trim()) return faqItems;
		const q = faqSearchQuery.toLowerCase();
		return faqItems.filter((item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q));
	}, [faqItems, faqSearchQuery]);

	const [editFaqId, setEditFaqId] = useState<string | null>(null);
	const [editQuestionInput, setEditQuestionInput] = useState('');
	const [editAnswerInput, setEditAnswerInput] = useState('');

	const [newFaqQuestion, setNewFaqQuestion] = useState('');
	const [newFaqAnswer, setNewFaqAnswer] = useState('');
	const [newFaqSavedNotice, setNewFaqSavedNotice] = useState('');

	const [useSimilarityThreshold, setUseSimilarityThreshold] = useState(false);
	const [similarityThresholdPct, setSimilarityThresholdPct] = useState(20);
	const [similaritySavedNotice, setSimilaritySavedNotice] = useState('');

// 구독 요금 설정 (현재 회원 요금제 표시: 테스트로 Business)
const [currentPlan] = useState<'payg' | 'start' | 'business' | 'enterprise'>('business');
const [enterpriseNotice, setEnterpriseNotice] = useState('');
const [topupOpen, setTopupOpen] = useState(false);
const [subscribeOpen, setSubscribeOpen] = useState<null | 'start' | 'business'>(null);

	// 채팅 건수 설정: 1일 고객당, 1달 전체(봇 전체)
	const [dailyLimitPerCustomer, setDailyLimitPerCustomer] = useState<number>(10);
	const [monthlyTotalLimit, setMonthlyTotalLimit] = useState<number>(250);
	const [chatLimitSavedNotice, setChatLimitSavedNotice] = useState('');

	const recommendedFaqTemplates: Array<{ label: string; question: string; answer: string }> = [
		{ label: '영업시간', question: '영업시간이 어떻게 되나요?', answer: '평일 10:00~19:00, 주말 11:00~18:00 운영합니다. 공휴일은 휴무입니다.' },
		{ label: '주말영업', question: '주말에도 영업하나요?', answer: '네, 토·일 11:00~18:00 영업합니다. 단, 공휴일은 휴무입니다.' },
		{ label: '연락처', question: '문의 연락처를 알려주세요.', answer: '대표번호 02-1234-5678, 카카오톡 채널 @faceon 으로 문의 주세요.' },
		{ label: '주소', question: '매장 위치가 어디인가요?', answer: '서울시 강남구 테헤란로 123, 1층 FaceOn 매장입니다.' },
		{ label: '주차', question: '주차가 가능한가요?', answer: '매장 뒤편 전용 주차장 1시간 무료 제공, 이후 10분/500원 과금됩니다.' },
		{ label: '결제수단', question: '어떤 결제수단을 지원하나요?', answer: '신용/체크카드, 간편결제(네이버페이/카카오페이), 현금 결제를 지원합니다.' },
		{ label: '교환/환불', question: '교환 또는 환불 규정이 어떻게 되나요?', answer: '구매 7일 이내 미사용 제품은 영수증 지참 시 교환/환불이 가능합니다. 일부 특가품 제외.' },
		{ label: '배송', question: '배송은 얼마나 걸리나요?', answer: '서울/수도권 1~2일, 지방 2~3일 소요됩니다. 일부 도서산간 지역은 추가 기간이 필요합니다.' },
	];

	function generateId(prefix: string) {
		return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
	}


	function normalizeUrl(u: string) {
		try {
			const url = new URL(/^(http|https):\/\//i.test(u) ? u : `https://${u}`);
			const normalized = `${url.protocol}//${url.host}${url.pathname.replace(/\/$/, '')}`;
			return normalized.toLowerCase();
		} catch {
			return u.trim().toLowerCase();
		}
	}

	function validateWebsite(raw: string): string | null {
		if (!raw.trim()) return '주소를 입력해주세요.';
		let url: URL;
		try {
			url = new URL(/^(http|https):\/\//i.test(raw) ? raw : `https://${raw}`);
		} catch {
			return '유효한 URL 형식이 아닙니다. (예: https://example.com)';
		}
		if (!/^https?:$/i.test(url.protocol)) return 'http/https만 허용됩니다.';
		if (!url.hostname || !/[.]/.test(url.hostname)) return '도메인 형식이 올바르지 않습니다.';
		const normalized = normalizeUrl(url.toString());
		if (websiteItems.some((w) => normalizeUrl(w.url) === normalized)) return '이미 등록된 사이트입니다.';
		return null;
	}

	function handleAddWebsite() {
		const raw = websiteUrlInput.trim();
		const error = validateWebsite(raw);
		if (error) {
			setWebsiteError(error);
			return;
		}
		const url = /^(http|https):\/\//i.test(raw) ? raw : `https://${raw}`;
		const newItem: WebsiteItem = { id: generateId('web'), url, lastRefreshedAt: new Date().toLocaleString() };
		setWebsiteItems((prev) => [newItem, ...prev]);
		setWebsiteUrlInput('');
		setWebsiteError('');
	}

	function handleRefreshWebsite(id: string) {
		setWebsiteItems((prev) => prev.map((w) => (w.id === id ? { ...w, lastRefreshedAt: new Date().toLocaleString() } : w)));
	}

	function handleDeleteWebsite(id: string) {
		setWebsiteItems((prev) => prev.filter((w) => w.id !== id));
	}

	const allowedFileTypes = ['text/plain', 'application/pdf'];
	const allowedExtensions = ['.txt', '.pdf'];
	const [fileErrors, setFileErrors] = useState<string[]>([]);

	function isAllowedFile(file: File): boolean {
		const lower = file.name.toLowerCase();
		const hasAllowedExt = allowedExtensions.some((ext) => lower.endsWith(ext));
		const hasAllowedMime = allowedFileTypes.includes(file.type || '');
		return hasAllowedExt || hasAllowedMime;
	}

	function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;
		const valid: UploadedFileItem[] = [];
		const errors: string[] = [];
		for (const file of files) {
			if (isAllowedFile(file)) {
				valid.push({ id: generateId('file'), name: file.name, sizeKB: Math.round(file.size / 1024) });
			} else {
				errors.push(`${file.name}: 지원하지 않는 형식입니다. (허용: TXT, PDF)`);
			}
		}
		if (valid.length) setUploadedFiles((prev) => [...valid, ...prev]);
		setFileErrors(errors);
		e.currentTarget.value = '';
	}

	function handleDeleteFile(id: string) {
		setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
	}

	function handleInsertFaqTemplate(t: { question: string; answer: string }) {
		setNewFaqQuestion(t.question);
		setNewFaqAnswer(t.answer);
	}

	function handleAddFaq() {
		if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
		const item: FaqItem = { id: generateId('faq'), question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() };
		setFaqItems((prev) => [item, ...prev]);
		setNewFaqQuestion('');
		setNewFaqAnswer('');
		setNewFaqSavedNotice('등록되었습니다.');
		setTimeout(() => setNewFaqSavedNotice(''), 1500);
	}

	function beginEditFaq(item: FaqItem) {
		setEditFaqId(item.id);
		setEditQuestionInput(item.question);
		setEditAnswerInput(item.answer);
	}

	function cancelEditFaq() {
		setEditFaqId(null);
		setEditQuestionInput('');
		setEditAnswerInput('');
	}

	function saveEditFaq(id: string) {
		setFaqItems((prev) => prev.map((f) => (f.id === id ? { ...f, question: editQuestionInput, answer: editAnswerInput } : f)));
		cancelEditFaq();
	}

	function deleteFaq(id: string) {
		setFaqItems((prev) => prev.filter((f) => f.id !== id));
	}

	function saveSimilarity() {
		setSimilaritySavedNotice('저장되었습니다.');
		setTimeout(() => setSimilaritySavedNotice(''), 1500);
	}

	function saveChatLimits() {
		// 간단 유효성: 음수 방지
		const daily = isFinite(dailyLimitPerCustomer) && dailyLimitPerCustomer >= 0 ? dailyLimitPerCustomer : 0;
		const monthly = isFinite(monthlyTotalLimit) && monthlyTotalLimit >= 0 ? monthlyTotalLimit : 0;
		setDailyLimitPerCustomer(Math.floor(daily));
		setMonthlyTotalLimit(Math.floor(monthly));
		setChatLimitSavedNotice('저장되었습니다.');
		setTimeout(() => setChatLimitSavedNotice(''), 1500);
	}

function openTopup() { setTopupOpen(true); }
function openSubscribe(plan: 'start' | 'business') { setSubscribeOpen(plan); }
function closeModals() { setTopupOpen(false); setSubscribeOpen(null); }

	function handleEnterpriseInquiry() {
		setEnterpriseNotice('접수되었습니다.');
		setTimeout(() => setEnterpriseNotice(''), 1500);
	}

  return (
    <main className="addon-container" style={{ paddingTop: 24, paddingBottom: 24, flex:1 }}>
      <div className="addon-inner">
        <div className="addon-card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="addon-title-row">
            <strong>데이터셋 · 설정</strong>
            <div className="addon-help">FAQ 최우선 → 데이터 소스 → 일반지식 순으로 답변합니다.</div>
          </div>
        </div>
      </div>

      <div className="addon-grid addon-inner" style={{ gap: 16, gridTemplateColumns:'repeat(12,minmax(0,1fr))' }}>
				{/* 1. 웹사이트 등록(크롤링) */}
				<section className="addon-card addon-col-6" style={{ padding: 16 }}>
          <h3 style={{ fontWeight:700, marginBottom: 8 }}>웹사이트 등록(크롤링)</h3>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
						<input className="addon-input" placeholder="https://example.com" value={websiteUrlInput} onChange={(e)=>{ setWebsiteUrlInput(e.target.value); if (websiteError) setWebsiteError(''); }} onBlur={(e)=>{ const err = validateWebsite(e.target.value); setWebsiteError(err || ''); }} />
						<button className="addon-btn addon-btn-primary" onClick={handleAddWebsite}>등록</button>
					</div>
					{websiteError && <div className="addon-help" style={{ color:'#B91C1C', borderColor:'#FCA5A5', background:'#FEF2F2', marginTop:8 }}>{websiteError}</div>}
					{websiteItems.length > 0 && (
						<div style={{ marginTop: 12, display:'grid', gap:8 }}>
							{websiteItems.map((site) => (
								<div key={site.id} className="addon-card" style={{ padding: 12, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
									<div style={{ display:'grid', gap:4 }}>
										<span className="addon-badge" style={{ width:'fit-content' }}>크롤링 대상</span>
										<strong>{site.url}</strong>
										<span className="addon-subtle">최근 새로고침: {site.lastRefreshedAt || '—'}</span>
									</div>
									<div style={{ display:'flex', gap:8 }}>
										<button className="addon-btn addon-btn-outline" onClick={()=>handleRefreshWebsite(site.id)}>새로고침</button>
										<button className="addon-btn addon-btn-outline" onClick={()=>handleDeleteWebsite(site.id)}>삭제</button>
									</div>
								</div>
							))}
          </div>
					)}
        </section>

				{/* 2. 자료 업로드 */}
				<section className="addon-card addon-col-6" style={{ padding: 16 }}>
          <h3 style={{ fontWeight:700, marginBottom: 8 }}>자료 업로드 (TEXT, PDF)</h3>
					<input className="addon-input" type="file" multiple accept=".txt,.pdf" onChange={handleFilesSelected} />
					{fileErrors.length > 0 && (
						<div className="addon-help" style={{ color:'#B91C1C', borderColor:'#FCA5A5', background:'#FEF2F2', marginTop:8 }}>
							{fileErrors.map((msg, idx) => (
								<div key={idx}>{msg}</div>
							))}
						</div>
					)}
					{uploadedFiles.length > 0 && (
						<div style={{ marginTop: 12, display:'grid', gap:8 }}>
							{uploadedFiles.map((f) => (
								<div key={f.id} className="addon-card" style={{ padding: 12, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
									<div>
										<strong>{f.name}</strong>
										<span className="addon-subtle" style={{ marginLeft: 8 }}>({f.sizeKB} KB)</span>
									</div>
									<button className="addon-btn addon-btn-outline" onClick={()=>handleDeleteFile(f.id)}>삭제</button>
								</div>
							))}
						</div>
					)}
				</section>

				{/* 3. FAQ 검색 */}
				<section className="addon-card addon-col-6" style={{ padding: 16 }}>
					<h3 style={{ fontWeight:700, marginBottom: 8 }}>FAQ 검색</h3>
					<input className="addon-input" placeholder="FAQ 검색..." value={faqSearchQuery} onChange={(e)=>setFaqSearchQuery(e.target.value)} />
					<div style={{ marginTop: 8 }} className="addon-subtle">결과: {filteredFaqItems.length}건</div>
					<div style={{ display:'grid', gap:8, marginTop: 8 }}>
						{filteredFaqItems.map((item) => (
							<div key={item.id} className="addon-card" style={{ padding: 12 }}>
								{editFaqId === item.id ? (
									<div style={{ display:'grid', gap:8 }}>
										<input className="addon-input" value={editQuestionInput} onChange={(e)=>setEditQuestionInput(e.target.value)} placeholder="질문" />
										<textarea className="addon-textarea" value={editAnswerInput} onChange={(e)=>setEditAnswerInput(e.target.value)} placeholder="답변" />
										<div style={{ display:'flex', gap:8 }}>
											<button className="addon-btn addon-btn-primary" onClick={()=>saveEditFaq(item.id)}>저장</button>
											<button className="addon-btn addon-btn-outline" onClick={cancelEditFaq}>취소</button>
										</div>
									</div>
								) : (
									<div style={{ display:'grid', gap:6 }}>
										<strong>{item.question}</strong>
										<div className="addon-muted" style={{ whiteSpace:'pre-wrap' }}>{item.answer}</div>
										<div style={{ display:'flex', gap:8 }}>
											<button className="addon-btn addon-btn-outline" onClick={()=>beginEditFaq(item)}>수정</button>
											<button className="addon-btn addon-btn-outline" onClick={()=>deleteFaq(item.id)}>삭제</button>
										</div>
									</div>
								)}
							</div>
						))}
						{filteredFaqItems.length === 0 && (
							<div className="addon-help">검색 결과가 없습니다.</div>
						)}
					</div>
        </section>

				{/* 4. FAQ 등록 + 추천 FAQ 템플릿 */}
				<section className="addon-card addon-col-6" style={{ padding: 16 }}>
          <h3 style={{ fontWeight:700, marginBottom: 8 }}>FAQ 등록</h3>
					<input className="addon-input" placeholder="질문" value={newFaqQuestion} onChange={(e)=>setNewFaqQuestion(e.target.value)} />
					<textarea className="addon-textarea" placeholder="답변" value={newFaqAnswer} onChange={(e)=>setNewFaqAnswer(e.target.value)} />
					<div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
						<button className="addon-btn addon-btn-primary" onClick={handleAddFaq}>등록</button>
						{newFaqSavedNotice && <span className="addon-badge">{newFaqSavedNotice}</span>}
					</div>
					<p style={{ marginTop: 8, color:'#6B7280' }}>FAQ를 최우선으로 참고합니다. 채팅 내역을 보고 필요한 내용을 바로 추가하세요.</p>
					<hr className="addon-divider" style={{ margin: '12px 0' }} />
					<div style={{ display:'grid', gap:8 }}>
						<strong>추천 FAQ</strong>
						<div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
							{recommendedFaqTemplates.map((t) => (
								<button key={t.label} className="addon-btn addon-btn-outline" onClick={()=>handleInsertFaqTemplate(t)}>{t.label}</button>
							))}
						</div>
					</div>
        </section>

				{/* 5. 채팅 건수 설정 */}
				<section className="addon-card" style={{ padding: 16, gridColumn:'span 12' }}>
					<h3 style={{ fontWeight:700, marginBottom: 8 }}>채팅 건수 설정</h3>
					<p className="addon-muted" style={{ marginBottom: 8 }}>고객별 일일 제한과 챗봇 전체 월간 제한을 설정합니다. 0은 무제한을 의미합니다.</p>
					<div className="addon-grid addon-grid-2" style={{ gap:12 }}>
            <div>
							<label>1일 고객당 건수 제한</label>
							<input className="addon-input" type="number" min={0} value={dailyLimitPerCustomer} onChange={(e)=>setDailyLimitPerCustomer(parseInt(e.target.value || '0', 10))} placeholder="기본 10 (0 = 무제한)" />
            </div>
            <div>
							<label>1달 전체 건수 제한(챗봇 전체)</label>
							<input className="addon-input" type="number" min={0} value={monthlyTotalLimit} onChange={(e)=>setMonthlyTotalLimit(parseInt(e.target.value || '0', 10))} placeholder="기본 250 (0 = 무제한)" />
						</div>
					</div>
					<div style={{ display:'flex', gap:8, alignItems:'center', marginTop: 10 }}>
						<button className="addon-btn addon-btn-primary" onClick={saveChatLimits}>저장</button>
						{chatLimitSavedNotice && <span className="addon-badge">{chatLimitSavedNotice}</span>}
					</div>
				</section>

				{/* 6. 구독 요금 설정 */}
				<section className="addon-card" style={{ padding: 16, gridColumn:'span 12' }}>
					<h3 style={{ fontWeight:700, marginBottom: 8 }}>
						구독 요금 설정
						<span className="addon-badge" style={{ marginLeft: 8 }}>현재 요금제: Business</span>
					</h3>
					<p className="addon-muted" style={{ marginBottom: 8 }}>원하시는 과금 방식을 선택하세요.</p>
          <div className="addon-pricing-grid">
						<div className={`addon-card ${currentPlan === 'payg' ? 'addon-shadow-sm' : ''}`} style={{ padding: 12, display:'grid', gap:6 }}>
							<strong>종량제</strong>
							<div className="addon-muted">건당 100원</div>
							<button className="addon-btn addon-btn-primary" onClick={openTopup}>충전하기</button>
						</div>
						<div className={`addon-card ${currentPlan === 'start' ? 'addon-shadow-sm' : ''}`} style={{ padding: 12, display:'grid', gap:6 }}>
							<strong>Start</strong>
							<div><span style={{ fontWeight:800 }}>4,900원</span> / 월</div>
							<div className="addon-muted">100건 / 월</div>
              {currentPlan !== 'start' && <button className="addon-btn addon-btn-outline" onClick={()=>openSubscribe('start')}>구독하기</button>}
						</div>
						<div className={`addon-card ${currentPlan === 'business' ? 'addon-shadow-sm' : ''}`} style={{ padding: 12, display:'grid', gap:6 }}>
							<strong>Business</strong>
							<div><span style={{ fontWeight:800 }}>9,900원</span> / 월</div>
							<div className="addon-muted">250건 / 월</div>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                {currentPlan !== 'business' && <button className="addon-btn addon-btn-outline" onClick={()=>openSubscribe('business')}>구독하기</button>}
                {currentPlan === 'business' && <span className="addon-badge">현재 구독중</span>}
              </div>
						</div>
						<div className={`addon-card ${currentPlan === 'enterprise' ? 'addon-shadow-sm' : ''}`} style={{ padding: 12, display:'grid', gap:6 }}>
							<strong>Enterprise</strong>
							<div className="addon-muted">별도 문의</div>
							<div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
								<button className="addon-btn addon-btn-outline" onClick={handleEnterpriseInquiry}>문의하기</button>
								{enterpriseNotice && <span className="addon-badge">{enterpriseNotice}</span>}
							</div>
						</div>
					</div>

          {/* 결제 모달: 충전 */}
          {topupOpen && (
            <div className="addon-modal-overlay" role="dialog" aria-modal="true">
              <div className="addon-modal">
                <div className="addon-modal-title">충전하기 (종량제)</div>
                <div className="addon-muted">원하는 충전 금액을 입력하고 결제를 진행하세요. 예: 10,000원 충전 → 100건 사용 가능</div>
                <div className="addon-modal-actions">
                  <button className="addon-btn addon-btn-outline" onClick={closeModals}>취소</button>
                  <button className="addon-btn addon-btn-primary" onClick={()=>{ closeModals(); router.push('/checkout?plan=payg&action=topup'); }}>결제 진행</button>
                </div>
              </div>
            </div>
          )}

          {/* 결제 모달: 구독 */}
          {subscribeOpen && (
            <div className="addon-modal-overlay" role="dialog" aria-modal="true">
              <div className="addon-modal">
                <div className="addon-modal-title">구독하기 ({subscribeOpen === 'start' ? 'Start' : 'Business'})</div>
                <div className="addon-muted">선택한 구독으로 결제를 진행합니다. 결제 완료 시 즉시 적용됩니다.</div>
                <div className="addon-modal-actions">
                  <button className="addon-btn addon-btn-outline" onClick={closeModals}>취소</button>
                  <button className="addon-btn addon-btn-primary" onClick={()=>{ const plan = subscribeOpen; closeModals(); router.push(`/checkout?plan=${plan}&action=subscribe`); }}>결제 진행</button>
                </div>
              </div>
            </div>
          )}
				</section>

				{/* 7. 데이터 유사 설정 */}
				<section className="addon-card" style={{ padding: 16, gridColumn:'span 12' }}>
					<h3 style={{ fontWeight:700, marginBottom: 8 }}>데이터 유사 설정</h3>
					<p className="addon-muted" style={{ marginBottom: 8 }}>사용자 질문과 등록한 자료의 유사도를 비교하여, 특정 유사도 미만일 경우 "답변 없음" 처리합니다.</p>
					<div style={{ display:'grid', gap:12 }}>
						<label style={{ display:'flex', alignItems:'center', gap:8 }}>
							<input type="checkbox" checked={useSimilarityThreshold} onChange={(e)=>setUseSimilarityThreshold(e.target.checked)} />
							유사도 임계치 사용
						</label>
						<div style={{ opacity: useSimilarityThreshold ? 1 : 0.5, pointerEvents: useSimilarityThreshold ? 'auto' : 'none' }}>
							<div style={{ display:'flex', alignItems:'center', gap:12 }}>
								<input type="range" min={0} max={100} value={similarityThresholdPct} onChange={(e)=>setSimilarityThresholdPct(parseInt(e.target.value,10))} style={{ width:'100%' }} />
								<strong>{similarityThresholdPct}%</strong>
							</div>
							<div className="addon-subtle">기본값 20%. 값이 높을수록 보수적으로 답변합니다.</div>
						</div>
						<div style={{ display:'flex', gap:8, alignItems:'center' }}>
							<button className="addon-btn addon-btn-primary" onClick={saveSimilarity}>저장</button>
							{similaritySavedNotice && <span className="addon-badge">{similaritySavedNotice}</span>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


