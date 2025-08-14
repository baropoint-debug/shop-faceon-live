'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface TagItem {
  id: string;
  name: string;
  hasMedia: boolean;
  isActive: boolean;
  isCustom: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  tagName: string;
}

// 미리보기 모달 컴포넌트
function PreviewModal({ isOpen, onClose, mediaUrl, mediaType, tagName }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          maxWidth: '90vw',
          maxHeight: '90vh',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: '#EF4444',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18
          }}
        >
          ×
        </button>
        
        {/* 태그명 */}
        <h3 style={{ marginBottom: 16, textAlign: 'center', fontWeight: 600, color: '#374151' }}>
          {tagName}
        </h3>
        
        {/* iPhone 프레임 스타일의 미디어 컨테이너 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          {/* iPhone 프레임 */}
          <div style={{
            width: 280,
            height: 560,
            backgroundColor: '#1F2937',
            borderRadius: 40,
            padding: 8,
            border: '4px solid #374151',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 15px 35px rgba(0, 0, 0, 0.15)',
            position: 'relative'
          }}>
            {/* iPhone 상단 노치 */}
            <div style={{
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 120,
              height: 25,
              backgroundColor: '#111827',
              borderRadius: '0 0 20px 20px',
              zIndex: 2
            }} />
            
            {/* iPhone 화면 */}
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000000',
              borderRadius: 36,
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* 미디어 표시 */}
              {mediaType === 'image' ? (
                <img 
                  src={mediaUrl} 
                  alt={tagName}
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              ) : (
                <video 
                  src={mediaUrl} 
                  controls 
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              )}
            </div>
          </div>
          
          {/* 파일명 (작고 단순한 텍스트) */}
          <div style={{
            color: '#6B7280',
            fontSize: 12,
            textAlign: 'center',
            maxWidth: 280,
            wordBreak: 'break-word'
          }}>
            {tagName}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddonDashboard() {
  const [industry, setIndustry] = useState('');
  const [similarity, setSimilarity] = useState(20);
  const [defaultMedia, setDefaultMedia] = useState<{ file: File | null; preview: string | null; type: 'image' | 'video' | null }>({ file: null, preview: null, type: null });
  const [customTags, setCustomTags] = useState<TagItem[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagFile, setNewTagFile] = useState<File | null>(null);
  const [newTagPreview, setNewTagPreview] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; mediaUrl: string; mediaType: 'image' | 'video'; tagName: string }>({ isOpen: false, mediaUrl: '', mediaType: 'image', tagName: '' });
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [persona, setPersona] = useState('');
  const [fullPersona, setFullPersona] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagFileInputRef = useRef<HTMLInputElement>(null);

  // 업종별 추천 태그 (미디어 URL 포함)
  const industryTags = {
    'yoga': [
      { name: '우르드바 다누라 아시나', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '우르드바 하스타 아사나', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '차투랑가 단다아사나', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '아도 무카스바나 아사나', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '수리아 나마스카라', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '발라사나', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const }
    ],
    'nail': [
      { name: '젤네일 디자인', mediaUrl: '/img/001.jpg', mediaType: 'image' as const },
      { name: '네일아트 패턴', mediaUrl: '/img/002.jpg', mediaType: 'image' as const },
      { name: '매니큐어 스타일', mediaUrl: '/img/003.jpg', mediaType: 'image' as const },
      { name: '네일 케어 팁', mediaUrl: '/img/004.jpg', mediaType: 'image' as const },
      { name: '시즌별 네일 트렌드', mediaUrl: '/img/001.jpg', mediaType: 'image' as const },
      { name: '네일 케어 루틴', mediaUrl: '/img/002.jpg', mediaType: 'image' as const }
    ],
    'coffee': [
      { name: '원두 추천', mediaUrl: '/img/005.jpg', mediaType: 'image' as const },
      { name: '커피 추출법', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '라떼아트 기법', mediaUrl: '/img/001.jpg', mediaType: 'image' as const },
      { name: '커피 레시피', mediaUrl: '/img/002.jpg', mediaType: 'image' as const },
      { name: '시즌별 커피 메뉴', mediaUrl: '/img/003.jpg', mediaType: 'image' as const },
      { name: '커피 브루잉 팁', mediaUrl: '/img/004.jpg', mediaType: 'image' as const }
    ],
    'beauty': [
      { name: '메이크업 튜토리얼', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '스킨케어 루틴', mediaUrl: '/img/001.jpg', mediaType: 'image' as const },
      { name: '헤어 스타일링', mediaUrl: '/img/002.jpg', mediaType: 'image' as const },
      { name: '시즌별 뷰티 트렌드', mediaUrl: '/img/003.jpg', mediaType: 'image' as const },
      { name: '뷰티 꿀팁', mediaUrl: '/img/004.jpg', mediaType: 'image' as const },
      { name: '프로 메이크업 기법', mediaUrl: '/img/005.jpg', mediaType: 'image' as const }
    ],
    'fitness': [
      { name: '홈 운동 루틴', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '근력 운동 가이드', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '유산소 운동', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '스트레칭 방법', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '운동 전후 준비운동', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '체형별 맞춤 운동', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const }
    ],
    'bakery': [
      { name: '베이킹 레시피', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '케이크 장식 기법', mediaUrl: '/img/001.jpg', mediaType: 'image' as const },
      { name: '빵 만들기 팁', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '시즌별 베이킹', mediaUrl: '/img/002.jpg', mediaType: 'image' as const },
      { name: '초보자 베이킹 가이드', mediaUrl: '/img/003.jpg', mediaType: 'image' as const },
      { name: '베이킹 도구 활용법', mediaUrl: '/img/004.jpg', mediaType: 'image' as const }
    ],
    'pet': [
      { name: '펫 케어 루틴', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '펫 훈련 방법', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '펫 건강 관리', mediaUrl: '/img/001.jpg', mediaType: 'image' as const },
      { name: '펫 그루밍 팁', mediaUrl: '/img/002.jpg', mediaType: 'image' as const },
      { name: '펫과 함께하는 놀이', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '펫 영양 관리', mediaUrl: '/img/003.jpg', mediaType: 'image' as const }
    ],
    'interior': [
      { name: '인테리어 꿀팁', mediaUrl: '/img/001.jpg', mediaType: 'image' as const },
      { name: '공간 활용법', mediaUrl: '/img/002.jpg', mediaType: 'image' as const },
      { name: '컬러 매칭 가이드', mediaUrl: '/img/003.jpg', mediaType: 'image' as const },
      { name: '가구 배치 아이디어', mediaUrl: '/img/004.jpg', mediaType: 'image' as const },
      { name: 'DIY 인테리어', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '시즌별 인테리어', mediaUrl: '/img/005.jpg', mediaType: 'image' as const }
    ],
    'fashion': [
      { name: '코디네이션 팁', mediaUrl: '/img/001.jpg', mediaType: 'image' as const },
      { name: '시즌별 패션 트렌드', mediaUrl: '/img/002.jpg', mediaType: 'image' as const },
      { name: '체형별 스타일링', mediaUrl: '/img/003.jpg', mediaType: 'image' as const },
      { name: '액세서리 매칭', mediaUrl: '/img/004.jpg', mediaType: 'image' as const },
      { name: '패션 꿀팁', mediaUrl: '/img/005.jpg', mediaType: 'image' as const },
      { name: '옷장 정리법', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const }
    ],
    'cooking': [
      { name: '요리 레시피', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '요리 기법', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '재료 손질법', mediaUrl: '/emotion/happy_001.mp4', mediaType: 'video' as const },
      { name: '시즌별 요리', mediaUrl: '/img/001.jpg', mediaType: 'image' as const },
      { name: '초보자 요리 가이드', mediaUrl: '/img/002.jpg', mediaType: 'image' as const },
      { name: '요리 도구 활용법', mediaUrl: '/img/003.jpg', mediaType: 'image' as const }
    ]
  };

  // 추가된 태그를 추적하기 위한 상태
  const [addedTags, setAddedTags] = useState<Set<string>>(new Set());
  
  // 선택된 페르소나 업종을 추적하기 위한 상태
  const [selectedPersonaType, setSelectedPersonaType] = useState<string>('');
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  
  // 이용약관 동의 확인 함수
  const checkTermsAccepted = () => {
    if (!termsAccepted) {
      alert('⚠️ 이용약관에 동의해주세요!\n\n파일 업로드 및 저장을 위해서는 이용약관 동의가 필요합니다.');
      return false;
    }
    return true;
  };
  
  // 페이지 로딩 시 저장된 페르소나 및 태그 자동 불러오기
  useEffect(() => {
    // 저장된 페르소나 불러오기
    const savedPersona = localStorage.getItem('savedPersona');
    const savedBusinessName = localStorage.getItem('savedBusinessName');
    const savedGreeting = localStorage.getItem('savedGreeting');
    const savedPersonaType = localStorage.getItem('savedPersonaType');
    
    if (savedPersona && savedBusinessName) {
      setPersona(savedPersona);
      setBusinessName(savedBusinessName);
      setGreeting(savedGreeting || '');
      setSelectedPersonaType(savedPersonaType || '');
      
      // fullPersona도 복원 (태그 연동 포함)
      if (savedPersonaType) {
        const fullPersona = generatePersona(savedPersonaType);
        setFullPersona(fullPersona);
      }
    }
    
    // 저장된 사용자 태그 불러오기
    const savedCustomTags = localStorage.getItem('savedCustomTags');
    const savedAddedTags = localStorage.getItem('savedAddedTags');
    
    if (savedCustomTags) {
      try {
        const parsedTags = JSON.parse(savedCustomTags);
        setCustomTags(parsedTags);
        console.log('저장된 사용자 태그를 불러왔습니다:', parsedTags);
      } catch (error) {
        console.error('저장된 태그 파싱 오류:', error);
      }
    }
    
    if (savedAddedTags) {
      try {
        const parsedAddedTags = JSON.parse(savedAddedTags);
        setAddedTags(new Set(parsedAddedTags));
        console.log('저장된 추가된 태그 정보를 불러왔습니다:', parsedAddedTags);
      } catch (error) {
        console.error('저장된 추가된 태그 파싱 오류:', error);
      }
    }
  }, []);

  // 업종별 전문 페르소나 생성 함수
  const generatePersona = (businessType: string) => {
    // 사용자에게 보여줄 페르소나 (태그 연동 부분 제외)
    const userPersonas: { [key: string]: string } = {
      '요가센터': `안녕하세요! 저는 ${businessName || '요가센터'}의 전문 요가 강사입니다. 

역할과 톤:
- 전문적이면서도 따뜻하고 친근한 요가 강사
- 명상적이고 평화로운 분위기 연출
- 체계적이고 단계별 접근으로 초보자도 쉽게 따라할 수 있도록 안내

주요 기능:
- 요가 자세(아사나) 상세 가이드 및 수정 방법
- 호흡법(프라나야마) 지도
- 명상 및 릴랙세이션 기법 안내
- 체형별 맞춤 요가 프로그램 제안
- 요가 철학과 라이프스타일 조언

업종별 주의사항:
- 의학적 상담이나 진단은 하지 않음
- 심각한 통증이나 부상 시 전문의 상담 권장
- 개인별 체력과 유연성에 맞춘 수정 자세 제시
- 임신부, 고혈압, 심장질환 등 특수 상황 시 주의사항 안내

리드 생성:
- 정기 요가 클래스 및 워크샵 안내
- 개인 맞춤 요가 프로그램 상담 예약
- 요가 용품 및 관련 서적 추천
- 요가 커뮤니티 활동 참여 유도`,

      '네일샵': `안녕하세요! 저는 ${businessName || '네일샵'}의 전문 네일 아티스트입니다.

역할과 톤:
- 트렌디하고 창의적인 네일 디자인 전문가
- 친근하고 유쾌한 분위기로 고객과 소통
- 최신 네일 트렌드와 기술에 대한 전문 지식 제공

주요 기능:
- 네일 디자인 및 아트 컨설팅
- 네일 케어 및 건강 관리 팁
- 시즌별 네일 트렌드 안내
- 개인별 스타일에 맞는 네일 디자인 추천
- 네일 제품 사용법 및 관리법 안내

업종별 주의사항:
- 의학적 진단이나 치료는 하지 않음
- 심각한 네일 질환 시 피부과 상담 권장
- 알레르기 반응 가능성에 대한 안내
- 네일 시술 후 관리법 상세 안내

리드 생성:
- 네일 시술 예약 및 상담 안내
- 시즌별 프로모션 및 이벤트 정보
- 네일 제품 및 도구 구매 안내
- VIP 고객 프로그램 및 멤버십 혜택`,

      '커피숍': `안녕하세요! 저는 ${businessName || '커피숍'}의 커피 전문가입니다.

역할과 톤:
- 열정적이고 지식이 풍부한 커피 전문가
- 따뜻하고 환영하는 분위기로 고객과 소통
- 커피에 대한 깊은 이해와 애정을 바탕으로 한 상담

주요 기능:
- 원두 추천 및 커피 상담
- 커피 추출법 및 브루잉 기법 안내
- 라떼아트 및 커피 레시피 제안
- 시즌별 커피 메뉴 및 특별 음료 소개
- 커피 문화와 역사 이야기

업종별 주의사항:
- 의학적 조언이나 건강 상담은 하지 않음
- 카페인 민감자에 대한 주의사항 안내
- 알레르기 성분이 포함된 음료 시 주의사항
- 음료 온도 및 보관법 안내

리드 생성:
- 커피 클래스 및 워크샵 참여 안내
- 원두 구독 서비스 및 정기 배송
- 커피 도구 및 용품 구매 상담
- 시즌별 프로모션 및 이벤트 정보`,

      '뷰티샵': `안녕하세요! 저는 ${businessName || '뷰티샵'}의 뷰티 전문가입니다.

역할과 톤:
- 트렌디하고 전문적인 뷰티 컨설턴트
- 자신감을 불어넣는 긍정적이고 격려하는 톤
- 개인별 특성에 맞는 맞춤형 뷰티 솔루션 제공

주요 기능:
- 메이크업 튜토리얼 및 컨설팅
- 스킨케어 루틴 및 제품 추천
- 헤어 스타일링 및 관리법 안내
- 시즌별 뷰티 트렌드 소개
- 개인별 컬러 분석 및 스타일링 조언

업종별 주의사항:
- 의학적 진단이나 치료는 하지 않음
- 심각한 피부 문제 시 피부과 상담 권장
- 알레르기 테스트 및 패치 테스트 권장
- 제품 사용법 및 주의사항 상세 안내

리드 생성:
- 뷰티 서비스 예약 및 상담 안내
- 뷰티 제품 구매 및 추천
- 뷰티 클래스 및 워크샵 참여
- VIP 고객 프로그램 및 멤버십 혜택`,

      '피트니스센터': `안녕하세요! 저는 ${businessName || '피트니스센터'}의 전문 피트니스 트레이너입니다.

역할과 톤:
- 동기부여적이고 격려하는 피트니스 전문가
- 체계적이고 과학적인 운동 방법 제시
- 개인별 목표와 체력에 맞춘 맞춤형 가이드

주요 기능:
- 홈 운동 루틴 및 가이드
- 근력 운동 및 유산소 운동 방법
- 스트레칭 및 준비운동 안내
- 체형별 맞춤 운동 프로그램
- 영양 및 식단 관리 조언

업종별 주의사항:
- 의학적 진단이나 치료는 하지 않음
- 심각한 통증이나 부상 시 전문의 상담 권장
- 개인별 체력과 건강상태에 맞춘 운동 강도 조절
- 운동 전후 준비운동 및 정리운동 중요성 강조

리드 생성:
- 개인 트레이닝 및 그룹 클래스 예약
- 피트니스 프로그램 및 멤버십 안내
- 운동 용품 및 보조제품 추천
- 건강 검진 및 체성분 측정 서비스`,

      '베이커리': `안녕하세요! 저는 ${businessName || '베이커리'}의 베이킹 전문가입니다.

역할과 톤:
- 창의적이고 따뜻한 베이킹 마스터
- 베이킹의 즐거움과 보람을 전달하는 격려하는 톤
- 단계별로 쉽게 따라할 수 있는 상세한 설명

주요 기능:
- 베이킹 레시피 및 기법 안내
- 케이크 장식 및 디자인 기법
- 시즌별 베이킹 아이디어 제안
- 초보자를 위한 베이킹 가이드
- 베이킹 도구 및 재료 활용법

업종별 주의사항:
- 식품 알레르기 성분에 대한 주의사항 안내
- 식품 위생 및 안전 수칙 강조
- 재료 보관법 및 유통기한 확인 중요성
- 베이킹 과정에서의 안전 주의사항

리드 생성:
- 베이킹 클래스 및 워크샵 참여
- 베이커리 도구 및 재료 구매 안내
- 맞춤형 케이크 주문 및 상담
- 베이킹 커뮤니티 활동 참여`,

      '펫샵/동물병원': `안녕하세요! 저는 ${businessName || '펫샵/동물병원'}의 반려동물 전문가입니다.

역할과 톤:
- 따뜻하고 사랑스러운 반려동물 전문가
- 반려동물과 보호자 모두를 위한 배려하는 마음
- 전문적이면서도 이해하기 쉬운 설명

주요 기능:
- 반려동물 케어 및 건강 관리 상담
- 반려동물 훈련 방법 및 행동 교정
- 반려동물 영양 및 식단 관리
- 반려동물 그루밍 및 미용 상담
- 반려동물과 함께하는 놀이 및 활동 제안

업종별 주의사항:
- 정확한 진단을 위해서는 직접 방문 권장
- 응급 상황 시 즉시 병원 방문 안내
- 예방접종 및 정기 검진의 중요성 강조
- 반려동물 안전 및 사고 예방법 안내

리드 생성:
- 반려동물 서비스 예약 및 상담
- 반려동물 용품 및 사료 구매 안내
- 정기 검진 및 예방접종 일정 관리
- 반려동물 커뮤니티 활동 참여`,

      '인테리어샵': `안녕하세요! 저는 ${businessName || '인테리어샵'}의 인테리어 디자인 전문가입니다.

역할과 톤:
- 창의적이고 감각적인 인테리어 디자이너
- 공간의 잠재력을 끌어내는 영감을 주는 톤
- 실용적이면서도 아름다운 솔루션 제시

주요 기능:
- 공간 분석 및 인테리어 컨설팅
- 컬러 매칭 및 조화로운 디자인 제안
- 가구 배치 및 공간 활용법 안내
- DIY 인테리어 프로젝트 가이드
- 시즌별 인테리어 트렌드 소개

업종별 주의사항:
- 건축 구조 변경은 전문가와 상담 후 진행
- 안전 기준 및 건축법규 준수 중요성 강조
- 예산 범위 내에서의 현실적인 제안
- 유지보수 및 관리법 상세 안내

리드 생성:
- 인테리어 컨설팅 및 디자인 서비스
- 가구 및 인테리어 소품 구매 안내
- DIY 워크샵 및 클래스 참여
- 시공업체 및 전문가 연계 서비스`,

      '패션샵': `안녕하세요! 저는 ${businessName || '패션샵'}의 패션 스타일리스트입니다.

역할과 톤:
- 트렌디하고 자신감 있는 패션 전문가
- 개인별 스타일을 발견하고 발전시키는 격려하는 톤
- 최신 패션 트렌드와 클래식한 스타일의 조화 제안

주요 기능:
- 개인별 스타일 분석 및 컨설팅
- 코디네이션 및 스타일링 조언
- 시즌별 패션 트렌드 안내
- 체형별 맞춤 스타일링 가이드
- 액세서리 매칭 및 활용법

업종별 주의사항:
- 개인별 체형과 스타일 선호도 고려
- 예산 범위 내에서의 현실적인 제안
- 의류 관리법 및 보관법 안내
- 지속 가능한 패션과 소비 습관 권장

리드 생성:
- 개인 스타일링 서비스 및 상담
- 의류 및 액세서리 구매 안내
- 패션 클래스 및 워크샵 참여
- VIP 고객 프로그램 및 멤버십 혜택`,

      '요리학원': `안녕하세요! 저는 ${businessName || '요리학원'}의 요리 전문가입니다.

역할과 톤:
- 열정적이고 경험이 풍부한 요리 강사
- 요리의 즐거움과 보람을 전달하는 격려하는 톤
- 단계별로 쉽게 따라할 수 있는 상세한 가이드

주요 기능:
- 요리 레시피 및 기법 안내
- 재료 손질법 및 기본 요리 기법
- 시즌별 요리 및 계절 음식 제안
- 초보자를 위한 요리 가이드
- 요리 도구 및 주방 용품 활용법

업종별 주의사항:
- 식품 안전 및 위생 수칙 강조
- 알레르기 성분에 대한 주의사항 안내
- 칼 사용법 및 주방 안전 수칙
- 재료 보관법 및 유통기한 확인 중요성

리드 생성:
- 요리 클래스 및 워크샵 참여
- 요리 도구 및 주방 용품 구매 안내
- 맞춤형 요리 프로그램 및 상담
- 요리 커뮤니티 활동 참여`
    };

    // 내부적으로 저장할 전체 페르소나 (태그 연동 포함)
    const fullPersonas: { [key: string]: string } = {
      '요가센터': `${userPersonas['요가센터']}

태그 연동:
업종 선택에서 추가된 태그들을 분석하여 답변 생성 시 가장 관련성 높은 태그의 미디어(숏폼/이미지)를 채팅방 배경으로 자동 재생하여 몰입감 있는 대화 환경을 제공합니다.`,
      '네일샵': `${userPersonas['네일샵']}

태그 연동:
업종 선택에서 추가된 태그들을 분석하여 답변 생성 시 가장 관련성 높은 태그의 미디어(숏폼/이미지)를 채팅방 배경으로 자동 재생하여 시각적 영감을 제공합니다.`,
      '커피숍': `${userPersonas['커피숍']}

태그 연동:
업종 선택에서 추가된 태그들을 분석하여 답변 생성 시 가장 관련성 높은 태그의 미디어(숏폼/이미지)를 채팅방 배경으로 자동 재생하여 커피의 분위기와 맛을 시각적으로 전달합니다.`,
      '뷰티샵': `${userPersonas['뷰티샵']}

태그 연동:
업종 선택에서 추가된 태그들을 분석하여 답변 생성 시 가장 관련성 높은 태그의 미디어(숏폼/이미지)를 채팅방 배경으로 자동 재생하여 뷰티의 결과물과 분위기를 시각적으로 전달합니다.`,
      '피트니스센터': `${userPersonas['피트니스센터']}

태그 연동:
업종 선택에서 추가된 태그들을 분석하여 답변 생성 시 가장 관련성 높은 태그의 미디어(숏폼/이미지)를 채팅방 배경으로 자동 재생하여 운동의 동기부여와 올바른 자세를 시각적으로 전달합니다.`,
      '베이커리': `${userPersonas['베이커리']}

태그 연동:
업종 선택에서 추가된 태그들을 분석하여 답변 생성 시 가장 관련성 높은 태그의 미디어(숏폼/이미지)를 채팅방 배경으로 자동 재생하여 베이킹의 과정과 결과물을 시각적으로 전달합니다.`,
      '펫샵/동물병원': `${userPersonas['펫샵/동물병원']}

태그 연동:
업종 선택에서 추가된 태그들을 분석하여 답변 생성 시 가장 관련성 높은 태그의 미디어(숏폼/이미지)를 채팅방 배경으로 자동 재생하여 반려동물의 건강과 행복을 시각적으로 전달합니다.`,
      '인테리어샵': `${userPersonas['인테리어샵']}

태그 연동:
업종 선택에서 추가된 태그들을 분석하여 답변 생성 시 가장 관련성 높은 태그의 미디어(숏폼/이미지)를 채팅방 배경으로 자동 재생하여 인테리어의 분위기와 스타일을 시각적으로 전달합니다.`,
      '패션샵': `${userPersonas['패션샵']}

태그 연동:
업종 선택에서 추가된 태그들을 분석하여 답변 생성 시 가장 관련성 높은 태그의 미디어(숏폼/이미지)를 채팅방 배경으로 자동 재생하여 패션의 스타일과 분위기를 시각적으로 전달합니다.`,
      '요리학원': `${userPersonas['요리학원']}

태그 연동:
업종 선택에서 추가된 태그들을 분석하여 답변 생성 시 가장 관련성 높은 태그의 미디어(숏폼/이미지)를 채팅방 배경으로 자동 재생하여 요리의 과정과 결과물을 시각적으로 전달합니다.`
    };

    // 사용자에게는 태그 연동 부분이 제외된 페르소나를 보여주고, 내부적으로는 전체 페르소나를 저장
    const userPersona = userPersonas[businessType] || '업종을 선택해주세요.';
    const fullPersona = fullPersonas[businessType] || '업종을 선택해주세요.';
    
    // 내부적으로 전체 페르소나를 저장 (태그 연동 포함)
    setFullPersona(fullPersona);
    
    return userPersona;
  };

  // 추천 페르소나 클릭 시 페르소나 생성
  const handlePersonaClick = (businessType: string) => {
    const generatedPersona = generatePersona(businessType);
    setPersona(generatedPersona);
    setSelectedPersonaType(businessType); // 선택된 페르소나 타입 저장
  };
  
  // 현재 페르소나 불러오기 (서버에서)
  const loadCurrentPersona = async () => {
    setIsLoading(true);
    try {
      // 실제로는 서버 API 호출
      // const response = await fetch('/api/persona/current');
      // const data = await response.json();
      
      // 임시로 로컬 스토리지에서 불러오기 (실제 구현 시 서버 API로 교체)
      const savedPersona = localStorage.getItem('savedPersona');
      const savedBusinessName = localStorage.getItem('savedBusinessName');
      const savedGreeting = localStorage.getItem('savedGreeting');
      const savedPersonaType = localStorage.getItem('savedPersonaType');
      
      if (savedPersona) {
        setPersona(savedPersona);
        setBusinessName(savedBusinessName || '');
        setGreeting(savedGreeting || '');
        setSelectedPersonaType(savedPersonaType || '');
        
        // fullPersona도 복원 (태그 연동 포함)
        if (savedPersonaType) {
          const fullPersona = generatePersona(savedPersonaType);
          setFullPersona(fullPersona);
        }
        
        alert('저장된 페르소나를 불러왔습니다!');
      } else {
        alert('저장된 페르소나가 없습니다.');
      }
    } catch (error) {
      console.error('페르소나 불러오기 실패:', error);
      alert('페르소나 불러오기에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 페르소나 저장
  const savePersona = () => {
    if (!businessName.trim()) {
      alert('챗봇 이름을 입력해주세요.');
      return;
    }
    if (!persona.trim()) {
      alert('페르소나를 입력해주세요.');
      return;
    }
    
    // 내부적으로는 fullPersona (태그 연동 포함)를 저장
    const personaToSave = fullPersona || persona;
    
    // 로컬 스토리지에 저장 (실제 구현 시 서버 API로 교체)
    localStorage.setItem('savedPersona', persona);
    localStorage.setItem('savedBusinessName', businessName);
    localStorage.setItem('savedGreeting', greeting);
    localStorage.setItem('savedPersonaType', selectedPersonaType);
    
    alert('페르소나가 저장되었습니다!');
    console.log('저장된 페르소나 (태그 연동 포함):', personaToSave);
    // 여기에 실제 저장 로직 구현
  };

  // 파일 업로드 처리
  const handleFileUpload = (file: File, type: 'default' | 'tag') => {
    // 이용약관 동의 확인
    if (!checkTermsAccepted()) {
      return;
    }
    
    if (type === 'default') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDefaultMedia({
          file,
          preview: e.target?.result as string,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        });
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewTagPreview(e.target?.result as string);
        setNewTagFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // 기본 미디어 삭제
  const removeDefaultMedia = () => {
    setDefaultMedia({ file: null, preview: null, type: null });
  };

  // 태그 추가
  const addCustomTag = () => {
    if (!newTagName.trim()) {
      alert('⚠️ 오류: 태그 이름을 입력해주세요.');
      return;
    }
    
    if (!newTagFile) {
      alert('⚠️ 오류: 이미지나 동영상을 첨부해주세요.\n\n태그를 추가하기 위해서는 반드시 미디어 파일이 필요합니다.');
      return;
    }
    
    const newTag: TagItem = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      hasMedia: true,
      isActive: true,
      isCustom: true,
      mediaUrl: newTagPreview || '',
      mediaType: newTagFile.type.startsWith('image/') ? 'image' : 'video'
    };
    
    const updatedTags = [...customTags, newTag];
    setCustomTags(updatedTags);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('savedCustomTags', JSON.stringify(updatedTags));
    
    // 입력 필드 초기화
    setNewTagName('');
    setNewTagFile(null);
    setNewTagPreview(null);
    
    console.log('사용자 태그가 추가되고 저장되었습니다:', newTag.name);
    alert('✅ 태그가 성공적으로 추가되었습니다!');
  };

  // 추천 태그를 내 태그로 추가
  const addRecommendedTag = (tagName: string, index: number) => {
    // 해당 업종의 태그 정보 찾기
    const industryTag = industryTags[industry as keyof typeof industryTags]?.find(tag => tag.name === tagName);
    
    // 미디어 파일이 없는 경우 오류 표시
    if (!industryTag?.mediaUrl) {
      alert('⚠️ 오류: 해당 태그에 등록된 동영상이나 이미지가 없습니다.\n\n태그를 추가하기 전에 먼저 미디어 파일을 등록해주세요.');
      return;
    }
    
    const newTag: TagItem = {
      id: Date.now().toString() + '_' + index,
      name: tagName,
      hasMedia: true,
      isActive: true,
      isCustom: false,
      mediaUrl: industryTag.mediaUrl,
      mediaType: industryTag.mediaType
    };
    
    const updatedTags = [...customTags, newTag];
    setCustomTags(updatedTags);
    
    // 추가된 태그를 추적하여 추천 목록에서 숨김
    const updatedAddedTags = new Set([...addedTags, tagName]);
    setAddedTags(updatedAddedTags);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('savedCustomTags', JSON.stringify(updatedTags));
    localStorage.setItem('savedAddedTags', JSON.stringify([...updatedAddedTags]));
    
    console.log('추천 태그가 추가되고 저장되었습니다:', tagName);
  };

  // 태그 활성화/비활성화
  const toggleTagActive = (tagId: string) => {
    const updatedTags = customTags.map(tag => 
      tag.id === tagId ? { ...tag, isActive: !tag.isActive } : tag
    );
    setCustomTags(updatedTags);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('savedCustomTags', JSON.stringify(updatedTags));
    
    console.log('태그 상태가 변경되고 저장되었습니다:', tagId);
  };

  // 태그 삭제
  const removeTag = (tagId: string) => {
    const tagToRemove = customTags.find(tag => tag.id === tagId);
    if (tagToRemove && !tagToRemove.isCustom) {
      // 추천 태그인 경우 추천 목록에서 다시 표시
      const updatedAddedTags = new Set(addedTags);
      updatedAddedTags.delete(tagToRemove.name);
      setAddedTags(updatedAddedTags);
      
      // 로컬 스토리지에 저장
      localStorage.setItem('savedAddedTags', JSON.stringify([...updatedAddedTags]));
    }
    
    const updatedTags = customTags.filter(tag => tag.id !== tagId);
    setCustomTags(updatedTags);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('savedCustomTags', JSON.stringify(updatedTags));
    
    console.log('태그가 삭제되고 저장되었습니다:', tagId);
  };

  // 태그 직접등록 (미디어 변경)
  const handleTagMediaChange = (tagId: string) => {
    // 태그 미디어 변경을 위한 파일 선택 다이얼로그 열기
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // 태그의 미디어를 업데이트
          const newMediaUrl = e.target?.result as string;
          const newMediaType = file.type.startsWith('image/') ? 'image' : 'video';
          
          // 업데이트된 미디어 정보를 표시 (실제로는 서버에 저장해야 함)
          const tag = customTags.find(t => t.id === tagId);
          if (tag) {
            alert(`${tag.name} 태그의 미디어가 업데이트되었습니다!\n파일명: ${file.name}\n타입: ${newMediaType}`);
            
            // 여기서 실제로는 서버 API를 호출하여 미디어를 업데이트해야 함
            // 예: updateTagMedia(tagId, file, newMediaUrl, newMediaType);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 추천 태그 직접등록 (미디어 변경)
  const handleRecommendedTagMediaChange = (tagName: string, index: number) => {
    // 해당 추천 태그의 미디어를 변경할 수 있도록 파일 선택 다이얼로그 열기
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // 추천 태그의 미디어를 업데이트
          const newMediaUrl = e.target?.result as string;
          const newMediaType = file.type.startsWith('image/') ? 'image' : 'video';
          
          // 업데이트된 미디어 정보를 표시 (실제로는 서버에 저장해야 함)
          alert(`${tagName} 태그의 미디어가 업데이트되었습니다!\n파일명: ${file.name}\n타입: ${newMediaType}`);
          
          // 여기서 실제로는 서버 API를 호출하여 미디어를 업데이트해야 함
          // 예: updateRecommendedTagMedia(tagName, file, newMediaUrl, newMediaType);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 파일 업로드 영역 클릭
  const handleUploadClick = (type: 'default' | 'tag') => {
    if (type === 'default') {
      fileInputRef.current?.click();
    } else {
      tagFileInputRef.current?.click();
    }
  };

  // 미리보기 모달 열기
  const openPreviewModal = (mediaUrl: string, mediaType: 'image' | 'video', tagName: string) => {
    setPreviewModal({ isOpen: true, mediaUrl, mediaType, tagName });
  };

  return (
    <main className="addon-container" style={{ paddingTop: 24, paddingBottom: 24, flex:1 }}>
      <div className="addon-inner">
        <div className="addon-card" style={{ padding: 16, marginBottom: 16, display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <strong>페르소나</strong>
          <Link className="addon-btn addon-btn-primary" href="/chat">내 챗봇 대화하기</Link>
        </div>
      </div>

      {/* 이용약관 동의 - 제일 위로 이동 */}
      <div className="addon-inner" style={{ marginBottom: 24 }}>
        <section className="addon-card" style={{ padding: 20, gridColumn:'span 12' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: '1px solid #E2E8F0'
          }}>
            <div style={{ 
              width: 24, 
              height: 24, 
              backgroundColor: '#8B5CF6', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontSize: 14,
              fontWeight: 'bold'
            }}>
              !
            </div>
            <span style={{ 
              fontWeight: 700, 
              color: '#1E293B', 
              fontSize: 16 
            }}>
              이용약관 동의
            </span>
          </div>
          
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 16, cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              style={{ 
                marginTop: 2, 
                width: 20, 
                height: 20,
                accentColor: '#8B5CF6'
              }}
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <div style={{ 
              fontSize: 14, 
              lineHeight: 1.6, 
              color: '#475569',
              textAlign: 'justify'
            }}>
              본인은 만 18세(또는 거주 국가의 법적 연령) 이상이며, 사용된 사진 및 동영상의 소유권이 본인에게 있거나 본인을 대표하는 개인으로부터 명시적인 허가를 받았음을 확인합니다. 본인이 업로드하는 콘텐츠에 대한 책임은 전적으로 본인에게 있으며, 이미지 및 동영상 사용은 모든 관련 법률 및 규정을 준수해야 함을 이해합니다. 또한, 타인의 권리를 침해하거나 사용 허가를 받지 않은 사진 및 동영상은 업로드하지 않을 것에 동의합니다. 계속 진행함으로써{' '}
              <a href="#" style={{ color: '#8B5CF6', textDecoration: 'underline', fontWeight: 600 }}>서비스 약관</a>
              {' '}및{' '}
              <a href="#" style={{ color: '#8B5CF6', textDecoration: 'underline', fontWeight: 600 }}>개인정보처리방침</a>
              에 동의합니다.
            </div>
          </label>
        </section>
      </div>

      <div className="addon-grid-12 addon-inner" style={{ gap: 16 }}>
        {/* 채팅방 기본 동영상/이미지 - 웹에서는 2열, 모바일에서는 전체 너비 */}
        <section className="addon-card addon-col-6" style={{ padding: 16 }}>
          <h3 style={{ fontWeight:700, marginBottom: 8 }}>채팅방 기본 동영상/이미지</h3>
          
          {/* 파일 업로드 영역 */}
          <div 
            onClick={() => handleUploadClick('default')}
            style={{
              border: '2px dashed #D1D5DB',
              borderRadius: 20,
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: defaultMedia.preview ? '#F9FAFB' : '#FAFAFA',
              minHeight: 240,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
          >
            {defaultMedia.preview ? (
              <div style={{ width: '100%', textAlign: 'center' }}>
                {/* PreviewModal과 동일한 iPhone 프레임 스타일 */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16
                }}>
                  {/* iPhone 프레임 - PreviewModal과 동일한 크기와 스타일 */}
                  <div style={{
                    width: 280,
                    height: 560,
                    backgroundColor: '#1F2937',
                    borderRadius: 40,
                    padding: 8,
                    border: '4px solid #374151',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 15px 35px rgba(0, 0, 0, 0.15)',
                    position: 'relative'
                  }}>
                    {/* iPhone 상단 노치 - PreviewModal과 동일 */}
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 120,
                      height: 25,
                      backgroundColor: '#111827',
                      borderRadius: '0 0 20px 20px',
                      zIndex: 2
                    }} />
                    
                    {/* iPhone 화면 - PreviewModal과 동일 */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#000000',
                      borderRadius: 36,
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      {/* 미디어 표시 - PreviewModal과 동일 */}
                      {defaultMedia.type === 'image' ? (
                        <img 
                          src={defaultMedia.preview} 
                          alt="미리보기"
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <video 
                          src={defaultMedia.preview} 
                          controls 
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* 파일명 - PreviewModal과 동일한 스타일 */}
                  <div style={{
                    color: '#6B7280',
                    fontSize: 12,
                    textAlign: 'center',
                    maxWidth: 280,
                    wordBreak: 'break-word'
                  }}>
                    {defaultMedia.file?.name}
                  </div>
                  
                  {/* 액션 버튼들 */}
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
                    <button 
                      className="addon-btn addon-btn-outline" 
                      onClick={(e) => { e.stopPropagation(); handleUploadClick('default'); }}
                      style={{ 
                        fontSize: 14, 
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: '2px solid #8B5CF6',
                        color: '#8B5CF6',
                        backgroundColor: 'white',
                        fontWeight: 600,
                        minWidth: 100,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      변경하기
                    </button>
                    <button 
                      className="addon-btn" 
                      onClick={(e) => { e.stopPropagation(); removeDefaultMedia(); }}
                      style={{ 
                        fontSize: 14, 
                        padding: '10px 20px',
                        backgroundColor: '#EF4444', 
                        color: 'white',
                        borderRadius: 10,
                        fontWeight: 600,
                        minWidth: 100,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      삭제하기
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                {/* 업로드 아이콘 */}
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  backgroundColor: '#8B5CF6', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
                }}>
                  <svg 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))' }}
                  >
                    {/* U자형 상자 */}
                    <path 
                      d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7Z" 
                      stroke="white" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    {/* 위쪽 화살표 */}
                    <path 
                      d="M12 3L12 15M12 3L8 7M12 3L16 7" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                
                {/* 메인 텍스트 */}
                <div style={{ 
                  color: '#374151', 
                  fontWeight: 700, 
                  marginBottom: 12, 
                  fontSize: 18,
                  lineHeight: 1.5
                }}>
                  채팅의 기본 배경화면으로 사용되며,<br />
                  고객 질문에 관련 태그가 없을 경우<br />
                  자동 노출됩니다
                </div>
                
                {/* 서브 텍스트 */}
                <div style={{ 
                  color: '#6B7280', 
                  fontSize: 15, 
                  lineHeight: 1.5, 
                  marginBottom: 32,
                  padding: '0 20px'
                }}>
                  동영상은 5M이하의<br />
                  숏폼을 등록해주세요
                </div>
                

                
                {/* 추가 안내 */}
                <div style={{ 
                  marginTop: 20, 
                  padding: '12px 16px', 
                  backgroundColor: '#F0F9FF', 
                  borderRadius: 12,
                  border: '1px solid #BAE6FD'
                }}>
                  <div style={{ 
                    color: '#0369A1', 
                    fontSize: 13, 
                    lineHeight: 1.4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: 16 }}>💡</span>
                    <span>JPG, PNG, MP4, MOV 파일 지원</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'default')}
            style={{ display: 'none' }}
          />
        </section>

                 {/* 페르소나 설정 */}
         <section className="addon-card addon-col-6" style={{ padding: 16, minHeight: 'fit-content', marginTop: '-20px' }}>
           <h3 style={{ fontWeight:700, marginBottom: 8 }}>페르소나 설정</h3>
          
                    {/* 챗봇 이름 */}
           <div style={{ marginBottom: 16 }}>
             <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#374151' }}>
              챗봇 이름 *
             </label>
             <input 
               className="addon-input" 
               placeholder="사용자와 대화할 챗봇의 이름을 정해주세요" 
               style={{ width: '100%' }}
               value={businessName}
               onChange={(e) => setBusinessName(e.target.value)}
             />
           </div>

                     {/* 인사말 */}
           <div style={{ marginBottom: 16 }}>
             <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#374151' }}>
               인사말 * (200자 이내)
             </label>
             <textarea 
               className="addon-input" 
               placeholder="채팅방 입장 시 보여줄 인사말을 입력하세요"
               style={{ 
                 width: '100%', 
                 minHeight: 80, 
                 resize: 'vertical',
                 fontFamily: 'inherit'
               }}
               maxLength={200}
               value={greeting}
               onChange={(e) => setGreeting(e.target.value)}
             />
             <div style={{ 
               textAlign: 'right', 
               marginTop: 4, 
               fontSize: 12, 
               color: '#6B7280' 
             }}>
               {greeting.length}/200
             </div>
           </div>

          {/* 페르소나 섹션 - 하나의 div로 묶음 */}
          <div style={{ marginBottom: 0 }}>
            {/* 페르소나 타이틀과 현재페르소나 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                페르소나 * (1000자 이내)
              </label>
              <button
                onClick={loadCurrentPersona}
                disabled={isLoading}
                style={{
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 500,
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoading ? '로딩중...' : '현재페르소나'}
              </button>
            </div>
            
            {/* 업종 선택 버튼들 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  '요가센터', '네일샵', '커피숍', '뷰티샵', '피트니스센터',
                  '베이커리', '펫샵/동물병원', '인테리어샵', '패션샵', '요리학원'
                ].map((business, index) => (
                  <div 
                    key={index}
                    className="addon-badge"
                    style={{
                      padding: '8px 12px',
                      backgroundColor: selectedPersonaType === business ? '#8B5CF6' : '#F3F4F6',
                      color: selectedPersonaType === business ? 'white' : '#374151',
                      borderRadius: 16,
                      fontSize: 12,
                      fontWeight: 500,
                      border: `1px solid ${selectedPersonaType === business ? '#8B5CF6' : '#E5E7EB'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedPersonaType === business ? '0 2px 8px rgba(139, 92, 246, 0.3)' : 'none'
                    }}
                    onClick={() => handlePersonaClick(business)}
                    onMouseEnter={(e) => {
                      if (selectedPersonaType !== business) {
                        e.currentTarget.style.backgroundColor = '#8B5CF6';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = '#8B5CF6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedPersonaType !== business) {
                        e.currentTarget.style.backgroundColor = '#F3F4F6';
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.borderColor = '#E5E7EB';
                      }
                    }}
                  >
                    {business}
                  </div>
                ))}
              </div>
            </div>
            
            {/* 페르소나 입력창 */}
            <textarea 
              className="addon-input" 
              placeholder="아바타의 성격, 특징, 대화 스타일 등을 자세히 설명해주세요"
              style={{ 
                width: '100%', 
                minHeight: 150, 
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: '13px'
              }}
              maxLength={1000}
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
            />
            <div style={{ 
              textAlign: 'right', 
              marginTop: 4, 
              fontSize: 12, 
              color: '#6B7280' 
            }}>
              {persona.length}/1000
            </div>
          </div>

          {/* 페르소나 저장 버튼 */}
          <div style={{ marginTop: 16 }}>
            <button 
              className="addon-btn addon-btn-primary" 
              onClick={savePersona}
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                fontSize: 16, 
                fontWeight: 600,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
            >
              💾 페르소나 저장
            </button>
          </div>
        </section>
      </div>

      {/* 두 번째 그리드: 업종선택 + 직접태그추가 + 내 태그 */}
      <div className="addon-grid-12 addon-inner" style={{ gap: 16, marginTop: 16 }}>
        {/* 업종 선택 및 추천 태그/소재 */}
        <section className="addon-card addon-col-6" style={{ padding: 16 }}>
          <h3 style={{ fontWeight:700, marginBottom: 8 }}>업종 선택</h3>
          <select 
            className="addon-select" 
            value={industry} 
            onChange={(e) => setIndustry(e.target.value)}
            style={{ marginBottom: 16 }}
          >
            <option value="">업종 선택</option>
            <option value="yoga">요가센터</option>
            <option value="nail">네일샵</option>
            <option value="coffee">커피숍</option>
            <option value="beauty">뷰티샵</option>
            <option value="fitness">피트니스센터</option>
            <option value="bakery">베이커리</option>
            <option value="pet">펫샵/동물병원</option>
            <option value="interior">인테리어샵</option>
            <option value="fashion">패션샵</option>
            <option value="cooking">요리학원</option>
          </select>
          
          {/* 추천 태그 표시 */}
          {industry && industryTags[industry as keyof typeof industryTags] && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, color: '#374151' }}>추천 태그</div>
              <div className="addon-scroll">
                <div className="addon-scroll-inner">
                {industryTags[industry as keyof typeof industryTags]
                  .filter(tag => !addedTags.has(tag.name)) // 추가된 태그는 숨김
                  .map((tag, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8, 
                    padding: 8, 
                    backgroundColor: '#F9FAFB', 
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ flex: 1, fontSize: 14, minWidth: '120px' }}>{tag.name}</span>
                      <button 
                        className="addon-btn" 
                        style={{ padding: '4px 8px', fontSize: 12, border: '1px solid #A78BFA', background:'#EEF2FF' }}
                      onClick={() => openPreviewModal(tag.mediaUrl, tag.mediaType, tag.name)}
                    >
                      미리보기
                    </button>
                    <button 
                      className="addon-btn addon-btn-outline" 
                      style={{ padding: '4px 8px', fontSize: 12 }}
                      onClick={() => handleRecommendedTagMediaChange(tag.name, index)}
                    >
                      직접등록
                    </button>
                    <button 
                      className="addon-btn" 
                      style={{ padding: '4px 8px', fontSize: 12, backgroundColor: '#10B981', color: 'white' }}
                      onClick={() => addRecommendedTag(tag.name, index)}
                    >
                      +태그추가
                    </button>
                  </div>
                ))}
                
                {/* 추가된 태그가 모두 숨겨졌을 때 메시지 */}
                {industryTags[industry as keyof typeof industryTags].every(tag => addedTags.has(tag.name)) && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: 16, 
                    color: '#9CA3AF', 
                    backgroundColor: '#F9FAFB', 
                    borderRadius: 8,
                    border: '1px dashed #D1D5DB',
                    marginTop: 8
                  }}>
                    모든 추천 태그가 추가되었습니다
                  </div>
                )}
                </div>
              </div>
            </div>
          )}

          {/* 직접 태그 추가 (추천 태그 하단에 고정) */}
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 16 }}>
            <h4 style={{ fontWeight: 600, marginBottom: 12, color: '#374151' }}>직접 태그 추가</h4>
            
            {/* 새 태그 입력 */}
            <div style={{ marginBottom: 16 }}>
              <input 
                className="addon-input" 
                placeholder="태그 이름을 입력하세요" 
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                style={{ marginBottom: 8 }}
              />
              
              {/* 파일 업로드 영역 */}
              <div 
                onClick={() => handleUploadClick('tag')}
                style={{
                  border: '2px dashed #D1D5DB',
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: newTagPreview ? '#F9FAFB' : '#FAFAFA',
                  marginBottom: 8
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
              >
                {newTagPreview ? (
                  <div>
                    <img 
                      src={newTagPreview} 
                      alt="태그 미디어" 
                      style={{ maxWidth: '100%', maxHeight: 100, borderRadius: 6, marginBottom: 8 }}
                    />
                    <div style={{ color: '#6B7280', fontSize: 12 }}>
                      {newTagFile?.name} • 클릭하여 변경
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>📎</div>
                    <div style={{ color: '#6B7280', fontSize: 12 }}>
                      이미지 또는 동영상 첨부
                    </div>
                  </div>
                )}
              </div>
              
              <input
                ref={tagFileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'tag')}
                style={{ display: 'none' }}
              />
              
              <button 
                className="addon-btn addon-btn-primary" 
                onClick={addCustomTag}
                disabled={!newTagName.trim() || !newTagFile}
                style={{ width: '100%' }}
              >
                추가
              </button>
            </div>
          </div>
        </section>

        {/* 내 태그 */}
        <section className="addon-card addon-col-6" style={{ padding: 16 }}>
          <h3 style={{ fontWeight:700, marginBottom: 8 }}>내 태그</h3>
          
          {customTags.length > 0 ? (
            <div className="addon-scroll" style={{ marginBottom: 16 }}>
              <div className="addon-scroll-inner">
              {customTags.map((tag) => (
                <div key={tag.id} className="addon-card-clickable" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  padding: 12, 
                  background: tag.isActive ? 'linear-gradient(180deg,#F0F9FF,#FFFFFF)' : 'linear-gradient(180deg,#F8FAFC,#FFFFFF)', 
                  borderRadius: 12,
                  border: `1px solid ${tag.isActive ? '#93C5FD' : '#E2E8F0'}`,
                  flexWrap: 'wrap',
                  position: 'relative'
                }}>
                  {/* 상태 표시 아이콘 */}
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: tag.isActive ? '#10B981' : '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                    flexShrink: 0
                  }}>
                    {tag.isActive ? (
                      <span style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</span>
                    ) : (
                      <span style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>○</span>
                    )}
                  </div>
                  
                  {/* 태그명과 상태 표시 */}
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <div style={{ 
                      fontSize: 14, 
                      fontWeight: 800,
                      letterSpacing: '-0.01em',
                      color: tag.isActive ? '#1D4ED8' : '#111827',
                      marginBottom: 2
                    }}>
                      {tag.name}
                    </div>
                    <div style={{ 
                      fontSize: 12, 
                      color: tag.isActive ? '#3B82F6' : '#9CA3AF',
                      fontWeight: 500
                    }}>
                      {tag.isActive ? '활성 상태' : '비활성 상태'}
                    </div>
                  </div>
                  
                  {/* 액션 버튼들 */}
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {/* 미리보기 버튼 - 미디어가 있는 경우에만 표시 */}
                    {tag.mediaUrl && tag.mediaType && (
                      <button 
                        className="addon-btn" 
                        style={{ 
                          padding: '4px 8px', 
                          fontSize: 11,
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          borderRadius: 12,
                          fontWeight: 500,
                          minWidth: 'auto',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={() => openPreviewModal(tag.mediaUrl!, tag.mediaType!, tag.name)}
                      >
                        👁️ 미리보기
                      </button>
                    )}
                    
                    <button 
                      className="addon-btn" 
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: 11,
                        backgroundColor: tag.isActive ? '#EF4444' : '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: 12,
                        fontWeight: 500,
                        minWidth: 'auto',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                      }}
                      onClick={() => toggleTagActive(tag.id)}
                    >
                      {tag.isActive ? (
                        <>
                          <span>⏸️</span>
                          일시정지
                        </>
                      ) : (
                        <>
                          <span>▶️</span>
                          활성화
                        </>
                      )}
                    </button>
                    
                    <button 
                      className="addon-btn addon-btn-outline" 
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: 11,
                        border: '1px solid #8B5CF6',
                        color: '#8B5CF6',
                        backgroundColor: 'white',
                        borderRadius: 12,
                        fontWeight: 500,
                        minWidth: 'auto',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => handleTagMediaChange(tag.id)}
                    >
                      📁 변경
                    </button>
                    
                    <button 
                      className="addon-btn" 
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: 11, 
                        backgroundColor: '#EF4444', 
                        color: 'white',
                        border: 'none',
                        borderRadius: 12,
                        fontWeight: 500,
                        minWidth: 'auto',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => removeTag(tag.id)}
                    >
                      🗑️ 삭제
                    </button>
                  </div>
                  
                  {/* 상태별 배경 효과 */}
                  {tag.isActive && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)',
                      borderRadius: 8,
                      pointerEvents: 'none'
                    }} />
                  )}
                </div>
              ))}
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: 24, 
              color: '#9CA3AF', 
              backgroundColor: '#F9FAFB', 
              borderRadius: 8,
              border: '1px dashed #D1D5DB',
              marginBottom: 16
            }}>
              추가된 태그가 없습니다
            </div>
          )}

          {/* 상태별 요약 정보 */}
          {customTags.length > 0 && (
            <div style={{ 
              marginBottom: 16, 
              padding: 12, 
              backgroundColor: '#F8FAFC', 
              borderRadius: 8,
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: 14,
                fontWeight: 600
              }}>
                <span style={{ color: '#374151' }}>태그 현황</span>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ 
                      width: 12, 
                      height: 12, 
                      backgroundColor: '#10B981', 
                      borderRadius: '50%' 
                    }} />
                    <span style={{ color: '#10B981' }}>
                      활성: {customTags.filter(tag => tag.isActive).length}개
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ 
                      width: 12, 
                      height: 12, 
                      backgroundColor: '#9CA3AF', 
                      borderRadius: '50%' 
                    }} />
                    <span style={{ color: '#9CA3AF' }}>
                      비활성: {customTags.filter(tag => !tag.isActive).length}개
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 저장 버튼 */}
          <button 
            className="addon-btn addon-btn-primary" 
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              fontSize: 16, 
              fontWeight: 600,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
            onClick={() => {
              // 저장 로직 구현
              alert('태그가 저장되었습니다!');
            }}
          >
            💾 태그 저장
          </button>
        </section>


      </div>

      {/* 미리보기 모달 */}
      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ ...previewModal, isOpen: false })}
        mediaUrl={previewModal.mediaUrl}
        mediaType={previewModal.mediaType}
        tagName={previewModal.tagName}
      />
    </main>
  );
}


