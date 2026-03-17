// @MX:NOTE: [AUTO] StoreBoardPage - 매장게시판 페이지 (거래처별 비공개)
// @MX:SPEC: SPEC-SKIN-008

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getVendor, getBoardPosts, createBoardPost } from '../../../../services/admin/vendor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../../components/ui';
import { Field, FieldLabel, TextField } from '../../../../components/ui';

/**
 * 매장게시판 페이지
 */
const StoreBoardPage = () => {
  const navigate = useNavigate();
  const { id: vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPostForm, setNewPostForm] = useState({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [vendorData, postsData] = await Promise.all([
          getVendor(vendorId),
          getBoardPosts(vendorId),
        ]);
        setVendor(vendorData);
        setPosts(postsData);
      } catch (err) {
        console.error('데이터 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [vendorId]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostForm.title.trim() || !newPostForm.content.trim()) return;

    setIsSubmitting(true);
    try {
      const newPost = await createBoardPost({
        ...newPostForm,
        vendorId: Number(vendorId),
      });
      setPosts((prev) => [newPost, ...prev]);
      setNewPostForm({ title: '', content: '' });
      setIsDialogOpen(false);
    } catch (err) {
      console.error('게시글 등록 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5" style={{ minWidth: 900 }}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/admin/vendor/${vendorId}`)}
            className="text-[--huni-fg-muted] hover:text-[--huni-fg-default] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-semibold text-[#424242]">매장게시판</h2>
            {vendor && (
              <p className="text-sm text-[--huni-fg-muted] mt-0.5">{vendor.name}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:bg-[--huni-bg-brand]/90 transition-colors"
        >
          + 게시글 작성
        </button>
      </div>

      {/* 비공개 안내 */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#EDE9FA] rounded-lg text-sm text-[--huni-bg-brand]">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>이 게시판은 해당 거래처만 볼 수 있는 비공개 게시판입니다.</span>
      </div>

      {/* 게시글 목록 */}
      <div className="bg-white rounded-lg border border-[--huni-stroke-default] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-[--huni-fg-muted] text-sm">로딩 중...</div>
        ) : posts.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-[--huni-fg-muted] text-sm">
            게시글이 없습니다.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F6F6] border-b border-[--huni-stroke-default]">
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-16">번호</th>
                <th className="text-left px-4 py-3 font-medium text-[--huni-fg-default]">제목</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-24">작성자</th>
                <th className="text-center px-4 py-3 font-medium text-[--huni-fg-default] w-28">작성일</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, idx) => (
                <tr
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="border-b border-[--huni-stroke-default]/50 hover:bg-[#F6F6F6]/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-center text-[--huni-fg-muted]">{posts.length - idx}</td>
                  <td className="px-4 py-3 text-[--huni-fg-default] font-medium">{post.title}</td>
                  <td className="px-4 py-3 text-center text-[--huni-fg-muted]">{post.author}</td>
                  <td className="px-4 py-3 text-center text-[--huni-fg-muted] text-xs">{post.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 게시글 작성 Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>게시글 작성</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <Field>
              <FieldLabel required>제목</FieldLabel>
              <TextField
                value={newPostForm.title}
                onChange={(e) => setNewPostForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="제목을 입력하세요"
                disabled={isSubmitting}
              />
            </Field>
            <Field>
              <FieldLabel required>내용</FieldLabel>
              <textarea
                value={newPostForm.content}
                onChange={(e) => setNewPostForm((p) => ({ ...p, content: e.target.value }))}
                placeholder="내용을 입력하세요"
                disabled={isSubmitting}
                rows={6}
                className="w-full px-3 py-2 rounded border border-[--huni-stroke-default] text-sm text-[--huni-fg-default] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[--huni-bg-brand]/40 focus:border-[--huni-bg-brand]"
              />
            </Field>
            <DialogFooter>
              <button type="button" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}
                className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm hover:bg-[--huni-bg-muted] transition-colors">
                취소
              </button>
              <button type="submit" disabled={isSubmitting}
                className="px-4 py-2 rounded bg-[--huni-bg-brand] text-white text-sm font-medium hover:bg-[--huni-bg-brand]/90 transition-colors disabled:opacity-50">
                {isSubmitting ? '등록 중...' : '등록'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 게시글 상세 Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={(v) => !v && setSelectedPost(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-[--huni-fg-muted]">
              <span>작성자: {selectedPost?.author}</span>
              <span>작성일: {selectedPost?.createdAt}</span>
            </div>
            <div className="border-t border-[--huni-stroke-default] pt-4">
              <p className="text-sm text-[--huni-fg-default] whitespace-pre-wrap">{selectedPost?.content}</p>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setSelectedPost(null)}
              className="px-4 py-2 rounded border border-[--huni-stroke-default] text-sm hover:bg-[--huni-bg-muted] transition-colors">
              닫기
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreBoardPage;
