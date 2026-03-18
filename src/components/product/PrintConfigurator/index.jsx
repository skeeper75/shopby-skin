// @MX:NOTE: PrintConfigurator - 인쇄 옵션 컨피규레이터 메인 컴포넌트
// SPEC-SKIN-003 TAG-001: 8단계 종속옵션 엔진

import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';
import { Checkbox } from '../../ui/Checkbox';
import { Field, FieldLabel, FieldDescription } from '../../ui/Field';
import { Skeleton } from '../../ui/Skeleton';
import { Divider } from '../../ui/Divider';
import { usePrintOptions } from '../../../hooks/usePrintOptions';
import { OPTION_STEPS } from '../../../types/print-options';

/**
 * PrintConfigurator Props
 */
interface PrintConfiguratorProps {
  productType: 'business-card' | 'flyer' | 'poster' | 'envelope';
  productNo: number;
  onOptionsChange?: (options: Record<string, string>) => void;
}

/**
 * 용지종류 옵션 단계
 */
const PaperTypeStep = ({ options, selection, onSelect, disabled }) => (
  <Field>
    <FieldLabel required>용지종류</FieldLabel>
    <FieldDescription>원하시는 용지 종류를 선택해주세요</FieldDescription>
    <RadioGroup value={selection} onValueChange={onSelect}>
      <div className="grid grid-cols-2 gap-3">
        {options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={option.id}
              disabled={disabled || option.disabled}
            />
            <label
              htmlFor={option.id}
              className={`flex-1 cursor-pointer rounded-md border p-3 ${
                selection === option.value
                  ? 'border-[--huni-stroke-brand] bg-[--huni-bg-brand-subtle]'
                  : 'border-[--huni-stroke-default]'
              }`}
            >
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          </div>
        ))}
      </div>
    </RadioGroup>
  </Field>
);

/**
 * 용지두께 옵션 단계
 */
const PaperThicknessStep = ({ options, selection, onSelect, disabled }) => (
  <Field>
    <FieldLabel required>용지두께</FieldLabel>
    <RadioGroup value={selection} onValueChange={onSelect}>
      <div className="flex flex-wrap gap-2">
        {options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={option.id}
              disabled={disabled || option.disabled}
            />
            <label
              htmlFor={option.id}
              className={`cursor-pointer rounded-md border px-4 py-2 text-sm ${
                selection === option.value
                  ? 'border-[--huni-stroke-brand] bg-[--huni-bg-brand-subtle]'
                  : 'border-[--huni-stroke-default]'
              }`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </RadioGroup>
  </Field>
);

/**
 * 사이즈 옵션 단계
 */
const SizeStep = ({ options, selection, onSelect, disabled }) => (
  <Field>
    <FieldLabel required>사이즈</FieldLabel>
    <RadioGroup value={selection} onValueChange={onSelect}>
      <div className="grid grid-cols-3 gap-2">
        {options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={option.id}
              disabled={disabled || option.disabled}
            />
            <label
              htmlFor={option.id}
              className={`cursor-pointer rounded-md border px-3 py-2 text-center text-sm ${
                selection === option.value
                  ? 'border-[--huni-stroke-brand] bg-[--huni-bg-brand-subtle]'
                  : 'border-[--huni-stroke-default]'
              }`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </RadioGroup>
  </Field>
);

/**
 * 수량 옵션 단계
 */
const QuantityStep = ({ options, selection, onSelect, disabled }) => (
  <Field>
    <FieldLabel required>수량</FieldLabel>
    <FieldDescription>선택한 수량에 따라 단가가 달라집니다</FieldDescription>
    <RadioGroup value={selection} onValueChange={onSelect}>
      <div className="grid grid-cols-5 gap-2">
        {options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={option.id}
              disabled={disabled || option.disabled}
            />
            <label
              htmlFor={option.id}
              className={`cursor-pointer rounded-md border px-3 py-2 text-center text-sm ${
                selection === option.value
                  ? 'border-[--huni-stroke-brand] bg-[--huni-bg-brand-subtle]'
                  : 'border-[--huni-stroke-default]'
              }`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </RadioGroup>
  </Field>
);

/**
 * 인쇄면수 옵션 단계
 */
const PrintSidesStep = ({ options, selection, onSelect, disabled }) => (
  <Field>
    <FieldLabel required>인쇄면수</FieldLabel>
    <RadioGroup value={selection} onValueChange={onSelect}>
      <div className="flex gap-3">
        {options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={option.id}
              disabled={disabled || option.disabled}
            />
            <label
              htmlFor={option.id}
              className={`flex-1 cursor-pointer rounded-md border p-3 text-center ${
                selection === option.value
                  ? 'border-[--huni-stroke-brand] bg-[--huni-bg-brand-subtle]'
                  : 'border-[--huni-stroke-default]'
              }`}
            >
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          </div>
        ))}
      </div>
    </RadioGroup>
  </Field>
);

/**
 * 후가공 옵션 단계 (다중선택 - Checkbox)
 */
const FinishingStep = ({ options, selections, onSelect, disabled }) => (
  <Field>
    <FieldLabel>후가공</FieldLabel>
    <FieldDescription>여러 후가공 옵션을 선택할 수 있습니다</FieldDescription>
    <div className="grid grid-cols-2 gap-3">
      {options?.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox
            id={option.id}
            checked={selections?.includes(option.value)}
            onCheckedChange={(checked) => onSelect(option.value, checked)}
            disabled={disabled || option.disabled}
          />
          <label
            htmlFor={option.id}
            className={`flex-1 cursor-pointer rounded-md border p-3 text-sm ${
              selections?.includes(option.value)
                ? 'border-[--huni-stroke-brand] bg-[--huni-bg-brand-subtle]'
                : 'border-[--huni-stroke-default]'
            }`}
          >
            {option.label}
            {option.price && (
              <span className="ml-2 text-xs text-[--huni-fg-muted]">
                (+{option.price.toLocaleString()}원)
              </span>
            )}
          </label>
        </div>
      ))}
    </div>
  </Field>
);

/**
 * 코팅 옵션 단계
 */
const CoatingStep = ({ options, selection, onSelect, disabled }) => (
  <Field>
    <FieldLabel>코팅</FieldLabel>
    <FieldDescription>코팅 옵션을 선택해주세요 (선택사항)</FieldDescription>
    <RadioGroup value={selection} onValueChange={onSelect}>
      <div className="flex gap-3">
        {options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={option.id}
              disabled={disabled || option.disabled}
            />
            <label
              htmlFor={option.id}
              className={`flex-1 cursor-pointer rounded-md border p-3 text-center ${
                selection === option.value
                  ? 'border-[--huni-stroke-brand] bg-[--huni-bg-brand-subtle]'
                  : 'border-[--huni-stroke-default]'
              }`}
            >
              <span className="text-sm font-medium">{option.label}</span>
              {option.price && (
                <span className="ml-2 text-xs text-[--huni-fg-muted]">
                  (+{option.price.toLocaleString()}원)
                </span>
              )}
            </label>
          </div>
        ))}
      </div>
    </RadioGroup>
  </Field>
);

/**
 * 납기일 옵션 단계
 */
const DeliveryDateStep = ({ options, selection, onSelect, disabled }) => (
  <Field>
    <FieldLabel required>납기일</FieldLabel>
    <FieldDescription>희망 납기일을 선택해주세요</FieldDescription>
    <RadioGroup value={selection} onValueChange={onSelect}>
      <div className="flex flex-col gap-2">
        {options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={option.id}
              disabled={disabled || option.disabled}
            />
            <label
              htmlFor={option.id}
              className={`flex-1 cursor-pointer rounded-md border p-3 ${
                selection === option.value
                  ? 'border-[--huni-stroke-brand] bg-[--huni-bg-brand-subtle]'
                  : 'border-[--huni-stroke-default]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {option.price && (
                  <span className="text-xs text-[--huni-fg-brand]">
                    급행할증 +{option.price.toLocaleString()}원
                  </span>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>
    </RadioGroup>
  </Field>
);

/**
 * PrintConfigurator 메인 컴포넌트
 */
const PrintConfigurator = ({
  productType,
  productNo,
  onOptionsChange,
}: PrintConfiguratorProps) => {
  const {
    state,
    selectOption,
    selectFinishing,
    getAvailableOptions,
    isStepDisabled,
  } = usePrintOptions(productType, productNo);

  const { selections, availableOptions, loading } = state;

  // 옵션 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    if (onOptionsChange) {
      const optionsMap = Object.entries(selections).reduce((acc, [step, selection]) => {
        acc[step] = selection.value;
        return acc;
      }, {} as Record<string, string>);
      onOptionsChange(optionsMap);
    }
  }, [selections, onOptionsChange]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-24 w-full" variant="card" />
        ))}
      </div>
    );
  }

  // 상품별 옵션 범위 필터링
  const shouldShowFinishing = productType !== 'poster'; // 포스터는 후가공 미지원
  const shouldShowCoating = productType !== 'envelope'; // 봉투는 코팅 미지원

  return (
    <div className="space-y-6">
      {/* 1단계: 용지종류 */}
      <PaperTypeStep
        options={availableOptions[OPTION_STEPS.PAPER_TYPE]}
        selection={selections[OPTION_STEPS.PAPER_TYPE]?.value}
        onSelect={(value) => selectOption(OPTION_STEPS.PAPER_TYPE, value)}
        disabled={false}
      />
      <Divider />

      {/* 2단계: 용지두께 */}
      <PaperThicknessStep
        options={availableOptions[OPTION_STEPS.PAPER_THICKNESS]}
        selection={selections[OPTION_STEPS.PAPER_THICKNESS]?.value}
        onSelect={(value) => selectOption(OPTION_STEPS.PAPER_THICKNESS, value)}
        disabled={isStepDisabled(OPTION_STEPS.PAPER_THICKNESS)}
      />
      <Divider />

      {/* 3단계: 사이즈 */}
      <SizeStep
        options={availableOptions[OPTION_STEPS.SIZE]}
        selection={selections[OPTION_STEPS.SIZE]?.value}
        onSelect={(value) => selectOption(OPTION_STEPS.SIZE, value)}
        disabled={isStepDisabled(OPTION_STEPS.SIZE)}
      />
      <Divider />

      {/* 4단계: 수량 */}
      <QuantityStep
        options={availableOptions[OPTION_STEPS.QUANTITY]}
        selection={selections[OPTION_STEPS.QUANTITY]?.value}
        onSelect={(value) => selectOption(OPTION_STEPS.QUANTITY, value)}
        disabled={isStepDisabled(OPTION_STEPS.QUANTITY)}
      />
      <Divider />

      {/* 5단계: 인쇄면수 */}
      <PrintSidesStep
        options={availableOptions[OPTION_STEPS.PRINT_SIDES]}
        selection={selections[OPTION_STEPS.PRINT_SIDES]?.value}
        onSelect={(value) => selectOption(OPTION_STEPS.PRINT_SIDES, value)}
        disabled={isStepDisabled(OPTION_STEPS.PRINT_SIDES)}
      />
      <Divider />

      {/* 6단계: 후가공 (포스터 제외) */}
      {shouldShowFinishing && (
        <>
          <FinishingStep
            options={availableOptions[OPTION_STEPS.FINISHING]}
            selections={selections[OPTION_STEPS.FINISHING]?.value?.split(',')}
            onSelect={(value, checked) => selectFinishing(value, checked)}
            disabled={isStepDisabled(OPTION_STEPS.FINISHING)}
          />
          <Divider />
        </>
      )}

      {/* 7단계: 코팅 (봉투 제외) */}
      {shouldShowCoating && (
        <>
          <CoatingStep
            options={availableOptions[OPTION_STEPS.COATING]}
            selection={selections[OPTION_STEPS.COATING]?.value}
            onSelect={(value) => selectOption(OPTION_STEPS.COATING, value)}
            disabled={isStepDisabled(OPTION_STEPS.COATING)}
          />
          <Divider />
        </>
      )}

      {/* 8단계: 납기일 */}
      <DeliveryDateStep
        options={availableOptions[OPTION_STEPS.DELIVERY_DATE]}
        selection={selections[OPTION_STEPS.DELIVERY_DATE]?.value}
        onSelect={(value) => selectOption(OPTION_STEPS.DELIVERY_DATE, value)}
        disabled={isStepDisabled(OPTION_STEPS.DELIVERY_DATE)}
      />
    </div>
  );
};

export default PrintConfigurator;
