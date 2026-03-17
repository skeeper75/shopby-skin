// @MX:NOTE: 사업자정보 관리 신규 페이지 (SPEC-SKIN-002, A-3-15)
// @MX:SPEC: SPEC-SKIN-002 REQ-MIG-002-013
import { useState } from 'react';

import { Button } from '@shopby/react-components';

import useLayoutChanger from '../../../hooks/useLayoutChanger';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Field,
  FieldLabel,
  TextField,
} from '../../../components/ui';

// 사업자 정보 폼 초기값
const EMPTY_BUSINESS_INFO = {
  businessNo: '',
  companyName: '',
  ownerName: '',
  businessType: '',
  businessCategory: '',
  address: '',
  taxEmail: '',
};

// 사업자 정보 폼 컴포넌트
const BusinessInfoForm = ({ form, onChange, onVerify }) => (
  <div className="business-info-form">
    {/* @MX:NOTE: Huni Field+TextField 구조 (SPEC-SKIN-002) */}
    <Field>
      <FieldLabel htmlFor="business-no" required>사업자번호</FieldLabel>
      <div className="business-info-form__row">
        <TextField
          id="business-no"
          placeholder="000-00-00000"
          value={form.businessNo}
          onChange={(e) => onChange('businessNo', e.target.value)}
        />
        <Button label="검증" onClick={onVerify} />
      </div>
    </Field>

    <Field>
      <FieldLabel htmlFor="company-name" required>상호명</FieldLabel>
      <TextField
        id="company-name"
        placeholder="상호명을 입력하세요"
        value={form.companyName}
        onChange={(e) => onChange('companyName', e.target.value)}
      />
    </Field>

    <Field>
      <FieldLabel htmlFor="owner-name" required>대표자명</FieldLabel>
      <TextField
        id="owner-name"
        placeholder="대표자명을 입력하세요"
        value={form.ownerName}
        onChange={(e) => onChange('ownerName', e.target.value)}
      />
    </Field>

    <Field>
      <FieldLabel htmlFor="business-type">업태</FieldLabel>
      <TextField
        id="business-type"
        placeholder="업태를 입력하세요"
        value={form.businessType}
        onChange={(e) => onChange('businessType', e.target.value)}
      />
    </Field>

    <Field>
      <FieldLabel htmlFor="business-category">종목</FieldLabel>
      <TextField
        id="business-category"
        placeholder="종목을 입력하세요"
        value={form.businessCategory}
        onChange={(e) => onChange('businessCategory', e.target.value)}
      />
    </Field>

    <Field>
      <FieldLabel htmlFor="business-address">사업장 주소</FieldLabel>
      <TextField
        id="business-address"
        placeholder="사업장 주소를 입력하세요"
        value={form.address}
        onChange={(e) => onChange('address', e.target.value)}
      />
    </Field>

    <Field>
      <FieldLabel htmlFor="tax-email">세금계산서 수신 이메일</FieldLabel>
      <TextField
        id="tax-email"
        type="email"
        placeholder="example@email.com"
        value={form.taxEmail}
        onChange={(e) => onChange('taxEmail', e.target.value)}
      />
    </Field>
  </div>
);

// 사업자 정보 카드 컴포넌트
const BusinessInfoCard = ({ info, onEdit, onDelete }) => (
  <article className="business-info-card">
    <div className="business-info-card__header">
      <h3 className="business-info-card__company-name">{info.companyName}</h3>
      <div className="business-info-card__actions">
        <Button label="수정" onClick={() => onEdit(info)} />
        <Button label="삭제" onClick={() => onDelete(info)} />
      </div>
    </div>
    <dl className="business-info-card__details">
      <div className="business-info-card__detail-row">
        <dt>사업자번호</dt>
        <dd>{info.businessNo}</dd>
      </div>
      <div className="business-info-card__detail-row">
        <dt>대표자명</dt>
        <dd>{info.ownerName}</dd>
      </div>
      {info.taxEmail && (
        <div className="business-info-card__detail-row">
          <dt>이메일</dt>
          <dd>{info.taxEmail}</dd>
        </div>
      )}
    </dl>
  </article>
);

// 삭제 확인 다이얼로그
const DeleteConfirmDialog = ({ open, onOpenChange, target, onConfirm }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>사업자정보 삭제</DialogTitle>
        <DialogDescription>
          {target?.companyName} 사업자정보를 삭제하시겠습니까?
          삭제 후 복구가 불가능합니다.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button label="취소" onClick={() => onOpenChange(false)} />
        <Button label="삭제" theme="caution" onClick={onConfirm} />
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// 메인 컴포넌트
const BusinessInfo = () => {
  const [businessList, setBusinessList] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_BUSINESS_INFO);

  useLayoutChanger({
    title: '사업자정보 관리',
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleVerifyBusinessNo = () => {
    // 실제 사업자번호 검증 API 연동 시 구현 필요
  };

  const handleOpenNew = () => {
    setForm(EMPTY_BUSINESS_INFO);
    setEditTarget(null);
    setIsFormOpen(true);
  };

  const handleEdit = (info) => {
    setForm({ ...info });
    setEditTarget(info);
    setIsFormOpen(true);
  };

  const handleDelete = (info) => {
    setDeleteTarget(info);
    setIsDeleteOpen(true);
  };

  const handleSave = () => {
    if (editTarget) {
      setBusinessList((prev) =>
        prev.map((item) => (item.businessNo === editTarget.businessNo ? form : item))
      );
    } else {
      setBusinessList((prev) => [...prev, form]);
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    setBusinessList((prev) =>
      prev.filter((item) => item.businessNo !== deleteTarget?.businessNo)
    );
    setIsDeleteOpen(false);
  };

  return (
    <div className="business-info-page">
      <div className="business-info-page__header">
        <Button
          className="business-info-page__add-btn"
          label="사업자정보 등록"
          theme="dark"
          onClick={handleOpenNew}
        />
      </div>

      {businessList.length === 0 ? (
        <p className="business-info-page__empty">등록된 사업자정보가 없습니다.</p>
      ) : (
        <div className="business-info-page__list">
          {businessList.map((info) => (
            <BusinessInfoCard
              key={info.businessNo}
              info={info}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* 등록/수정 다이얼로그 */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="business-info-form-dialog">
          <DialogHeader>
            <DialogTitle>
              {editTarget ? '사업자정보 수정' : '사업자정보 등록'}
            </DialogTitle>
          </DialogHeader>
          <BusinessInfoForm
            form={form}
            onChange={handleFormChange}
            onVerify={handleVerifyBusinessNo}
          />
          <DialogFooter>
            <Button label="취소" onClick={() => setIsFormOpen(false)} />
            <Button label={editTarget ? '수정' : '등록'} theme="dark" onClick={handleSave} />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        target={deleteTarget}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default BusinessInfo;
