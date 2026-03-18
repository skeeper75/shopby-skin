// @MX:NOTE: 카테고리 트리 컴포넌트 - 드래그앤드롭 지원 (SPEC-SKIN-006)
// @MX:WARN: HTML5 드래그앤드롭 API 직접 사용 - 복잡한 상태 관리 주의
// @MX:REASON: 카테고리 트리 재정렬이 중첩 드래그를 포함하여 상태 일관성 유지 어려움
// @MX:SPEC: SPEC-SKIN-006

import * as React from 'react';

const MOCK_CATEGORIES = [
  { id: 1, name: '인쇄', parentId: null, sortOrder: 1 },
  { id: 2, name: '명함', parentId: 1, sortOrder: 1 },
  { id: 3, name: '전단지', parentId: 1, sortOrder: 2 },
  { id: 4, name: '브로슈어', parentId: 1, sortOrder: 3 },
  { id: 5, name: '제본', parentId: null, sortOrder: 2 },
  { id: 6, name: '스프링', parentId: 5, sortOrder: 1 },
  { id: 7, name: '무선', parentId: 5, sortOrder: 2 },
  { id: 8, name: '굿즈', parentId: null, sortOrder: 3 },
];

const buildTree = (categories) => {
  const map = {};
  const roots = [];
  categories.forEach((c) => { map[c.id] = { ...c, children: [] }; });
  categories.forEach((c) => {
    if (c.parentId) map[c.parentId]?.children.push(map[c.id]);
    else roots.push(map[c.id]);
  });
  return roots;
};

/**
 * CategoryTree - 카테고리 트리
 * @param {object[]} categories - 카테고리 배열
 * @param {number|null} selectedId - 선택된 카테고리 ID
 * @param {function} onSelect - 선택 콜백
 * @param {function} onReorder - 재정렬 콜백
 */
const CategoryTree = ({ categories = MOCK_CATEGORIES, selectedId, onSelect, onReorder }) => {
  const [tree, setTree] = React.useState(() => buildTree(categories));
  const [draggedId, setDraggedId] = React.useState(null);
  const [dropTargetId, setDropTargetId] = React.useState(null);
  const [expanded, setExpanded] = React.useState(new Set([1, 5]));

  React.useEffect(() => {
    setTree(buildTree(categories));
  }, [categories]);

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetId(id);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      onReorder?.({ draggedId, targetId });
    }
    setDraggedId(null);
    setDropTargetId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTargetId(null);
  };

  const renderNode = (node, depth = 0) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expanded.has(node.id);
    const isSelected = selectedId === node.id;
    const isDragging = draggedId === node.id;
    const isDropTarget = dropTargetId === node.id;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer select-none transition-colors ${
            isSelected ? 'bg-[--huni-bg-brand] text-white' : 'hover:bg-[--huni-bg-subtle]'
          } ${isDragging ? 'opacity-50' : ''} ${isDropTarget ? 'border-2 border-dashed border-[--huni-stroke-brand]' : ''}`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => onSelect?.(node.id)}
          draggable
          onDragStart={(e) => handleDragStart(e, node.id)}
          onDragOver={(e) => handleDragOver(e, node.id)}
          onDrop={(e) => handleDrop(e, node.id)}
          onDragEnd={handleDragEnd}
        >
          {/* 토글 버튼 */}
          <button
            className={`w-4 h-4 flex items-center justify-center text-xs flex-shrink-0 ${isSelected ? 'text-white' : 'text-[--huni-fg-muted]'}`}
            onClick={(e) => { e.stopPropagation(); if (hasChildren) toggleExpand(node.id); }}
          >
            {hasChildren ? (isExpanded ? '▾' : '▸') : ''}
          </button>

          {/* 드래그 핸들 */}
          <span className={`text-xs flex-shrink-0 cursor-grab ${isSelected ? 'text-white opacity-70' : 'text-[--huni-fg-muted]'}`}>⠿</span>

          {/* 이름 */}
          <span className="text-sm truncate">{node.name}</span>

          {/* 자식 수 */}
          {hasChildren && (
            <span className={`ml-auto text-xs ${isSelected ? 'text-white opacity-70' : 'text-[--huni-fg-muted]'}`}>
              {node.children.length}
            </span>
          )}
        </div>

        {/* 자식 노드 */}
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border border-[--huni-stroke-default] rounded overflow-hidden">
      <div className="px-3 py-2 bg-[--huni-bg-subtle] border-b border-[--huni-stroke-default] flex items-center justify-between">
        <span className="text-xs font-semibold text-[--huni-fg-muted]">카테고리</span>
        <button className="text-xs text-[--huni-fg-brand] hover:underline">+ 추가</button>
      </div>
      <div className="p-1">
        {tree.map((node) => renderNode(node))}
      </div>
    </div>
  );
};

export { CategoryTree };
