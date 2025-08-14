'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Settings, 
  LogOut, 
  Edit3, 
  Save, 
  X, 
  Heart, 
  ThumbsDown, 
  Users,
  Sparkles,
  MapPin,
  Clock,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { authAPI } from '@/lib/api';

interface UserData {
  user_id: number;
  email: string;
  nickname: string;
  title?: string;
  introduction?: string;
  icon_url?: string;
  likes: number;
  dislikes: number;
  followers: number;
  country_name?: string;
  city?: string;
  language_code: string;
  timezone: string;
  created_at: string;
  login_at?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nickname: '',
    title: '',
    introduction: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await authAPI.getProfile();
        if (response.success) {
          setUser(response.data.user);
          setEditData({
            nickname: response.data.user.nickname || '',
            title: response.data.user.title || '',
            introduction: response.data.user.introduction || ''
          });
        }
      } catch (error) {
        console.error('프로필 로드 실패:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await authAPI.updateProfile(editData);
      if (response.success) {
        setUser(response.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      nickname: user?.nickname || '',
      title: user?.title || '',
      introduction: user?.introduction || ''
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  FaceOn
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                <Settings className="w-4 h-4 mr-2" />
                설정
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-800">
                        {isEditing ? '프로필 편집' : '내 프로필'}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {isEditing ? '정보를 수정해보세요' : '프로필 정보를 확인하고 관리하세요'}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={isSaving}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {isSaving ? '저장 중...' : '저장'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          <X className="w-4 h-4 mr-1" />
                          취소
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        편집
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이메일
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-600">
                      {user.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      닉네임
                    </label>
                    {isEditing ? (
                      <Input
                        value={editData.nickname}
                        onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
                        className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                        {user.nickname}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      타이틀
                    </label>
                    {isEditing ? (
                      <Input
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        placeholder="예: 개발자, 디자이너, 창업가..."
                        className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                        {user.title || '타이틀이 없습니다.'}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      자기소개
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editData.introduction}
                        onChange={(e) => setEditData({ ...editData, introduction: e.target.value })}
                        placeholder="자신을 소개해보세요..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 min-h-[100px]">
                        {user.introduction || '아직 자기소개가 없습니다.'}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Info Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">활동 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">좋아요</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">{user.likes}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ThumbsDown className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">싫어요</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">{user.dislikes}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">팔로워</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{user.followers}</span>
                </div>
              </CardContent>
            </Card>

            {/* Location & Info Card */}
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">위치 & 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">위치</p>
                    <p className="text-gray-800 font-medium">
                      {user.city && user.country_name 
                        ? `${user.city}, ${user.country_name}`
                        : '위치 정보 없음'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">언어</p>
                    <p className="text-gray-800 font-medium">
                      {user.language_code === 'ko' ? '한국어' : 
                       user.language_code === 'en' ? 'English' : user.language_code}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">가입일</p>
                    <p className="text-gray-800 font-medium">
                      {new Date(user.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>

                {user.login_at && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">최근 로그인</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(user.login_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
