import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { string, number, arrayOf, object } from 'prop-types';

import {
  ThumbList,
  useOrderSheetActionContext,
  useOrderSheetStateContext,
  useModalActionContext,
} from '@shopby/react-components';
import { FREE_GIFT_OPTION_COUNT_TYPE, THUMB_LIST_TYPE } from '@shopby/shared';

import FreeGiftThumbItem from './FreeGiftThumbItem';

const FreeGiftThumbList = ({
  freeGiftConditionId,
  freeGiftConditionNo,
  freeGifts,
  freeGiftOptionCountType,
  freeGiftOptionCount,
}) => {
  const { t } = useTranslation('order');
  const { selectedFreeGiftInfoMap, noSelectFreeGiftConditionIds } = useOrderSheetStateContext();
  const { updateSelectedFreeGiftInfoMap, updateNoSelectFreeGiftConditionIds } = useOrderSheetActionContext();
  const { openAlert } = useModalActionContext();

  const selectedFreeGift = selectedFreeGiftInfoMap.get(freeGiftConditionId);

  const isNoSelect = useMemo(
    () => noSelectFreeGiftConditionIds.includes(freeGiftConditionId),
    [noSelectFreeGiftConditionIds, freeGiftConditionId]
  );

  const gifts = freeGifts.map((gift) => ({
    ...gift,
    checked:
      selectedFreeGift?.freeGifts.some(
        (selected) => selected.mallOptionNo === gift.mallOptionNo && selected.mallProductNo === gift.mallProductNo
      ) ?? false,
  }));

  const uncheckNoSelectOption = useCallback(() => {
    updateNoSelectFreeGiftConditionIds((prev) =>
      prev.filter((noSelectFreeGiftConditionId) => noSelectFreeGiftConditionId !== freeGiftConditionId)
    );
  }, [freeGiftConditionId, updateNoSelectFreeGiftConditionIds]);

  const addSelectedFreeGift = useCallback(
    (mallOptionNo, mallProductNo) => {
      const newSelectedFreeGiftMap = new Map(selectedFreeGiftInfoMap);
      const selectedFreeGiftCondition = newSelectedFreeGiftMap.get(freeGiftConditionId);

      if (!selectedFreeGiftCondition) {
        const newSelectedFreeGift = {
          freeGiftConditionNo,
          freeGifts: [{ mallOptionNo, mallProductNo }],
        };

        newSelectedFreeGiftMap.set(freeGiftConditionId, newSelectedFreeGift);
      } else {
        const updatedFreeGifts = [...selectedFreeGiftCondition.freeGifts, { mallOptionNo, mallProductNo }];

        newSelectedFreeGiftMap.set(freeGiftConditionId, {
          ...selectedFreeGiftCondition,
          freeGifts: updatedFreeGifts,
        });
      }

      updateSelectedFreeGiftInfoMap(newSelectedFreeGiftMap);

      uncheckNoSelectOption();
    },
    [
      freeGiftConditionNo,
      freeGiftConditionId,
      selectedFreeGiftInfoMap,
      updateSelectedFreeGiftInfoMap,
      uncheckNoSelectOption,
    ]
  );

  const removeSelectedFreeGift = useCallback(
    (mallOptionNo, mallProductNo) => {
      const newSelectedFreeGiftMap = new Map(selectedFreeGiftInfoMap || new Map());
      const selectedFreeGiftCondition = newSelectedFreeGiftMap.get(freeGiftConditionId);

      if (!selectedFreeGiftCondition) {
        return;
      }

      const filteredGifts = selectedFreeGiftCondition.freeGifts.filter(
        (gift) => gift.mallOptionNo !== mallOptionNo || gift.mallProductNo !== mallProductNo
      );

      if (filteredGifts.length > 0) {
        newSelectedFreeGiftMap.set(freeGiftConditionId, {
          ...selectedFreeGiftCondition,
          freeGifts: filteredGifts,
        });
      } else {
        newSelectedFreeGiftMap['delete'](freeGiftConditionId);
      }
      updateSelectedFreeGiftInfoMap(newSelectedFreeGiftMap);
    },
    [freeGiftConditionId, selectedFreeGiftInfoMap, updateSelectedFreeGiftInfoMap]
  );

  const clearSelectedFreeGiftsByCondition = useCallback(() => {
    const newSelectedFreeGiftMap = new Map(selectedFreeGiftInfoMap);

    newSelectedFreeGiftMap['delete'](freeGiftConditionId);

    updateSelectedFreeGiftInfoMap(newSelectedFreeGiftMap);
  }, [freeGiftConditionId, selectedFreeGiftInfoMap, updateSelectedFreeGiftInfoMap]);

  const validateSelectableCount = useCallback(() => {
    const selectedFreeGiftCondition = selectedFreeGiftInfoMap?.get(freeGiftConditionId);
    const isAllType = freeGiftOptionCountType === FREE_GIFT_OPTION_COUNT_TYPE.ALL;

    if (!selectedFreeGiftCondition || isAllType || !freeGiftOptionCount) {
      return true;
    }

    const selectedFreeGiftCount = selectedFreeGiftCondition.freeGifts.length;
    const isSelectableCount = selectedFreeGiftCount < freeGiftOptionCount;

    if (isSelectableCount) {
      return true;
    }

    openAlert({
      message: t('freeGiftMaxSelectionAlert', { count: freeGiftOptionCount }),
    });

    return false;
  }, [freeGiftConditionId, selectedFreeGiftInfoMap, freeGiftOptionCountType, freeGiftOptionCount]);

  const handleGiftSelect = useCallback(
    (e, mallOptionNo, mallProductNo) => {
      const { checked } = e.target;

      if (!checked) {
        removeSelectedFreeGift(mallOptionNo, mallProductNo);

        return;
      }

      if (!validateSelectableCount()) {
        e.target.checked = false;

        return;
      }

      addSelectedFreeGift(mallOptionNo, mallProductNo);
      uncheckNoSelectOption();
    },
    [addSelectedFreeGift, removeSelectedFreeGift, uncheckNoSelectOption, validateSelectableCount]
  );

  const handleNoSelect = useCallback(
    (e) => {
      const { checked } = e.target;

      if (!checked) {
        uncheckNoSelectOption();

        return;
      }

      clearSelectedFreeGiftsByCondition();

      const updatedNoSelectFreeGiftConditionIds = [...noSelectFreeGiftConditionIds, freeGiftConditionId];

      updateNoSelectFreeGiftConditionIds(updatedNoSelectFreeGiftConditionIds);
    },
    [
      freeGiftConditionId,
      noSelectFreeGiftConditionIds,
      updateNoSelectFreeGiftConditionIds,
      clearSelectedFreeGiftsByCondition,
      uncheckNoSelectOption,
    ]
  );

  return (
    <ThumbList displayType={THUMB_LIST_TYPE.GALLERY} key={freeGiftConditionId}>
      {gifts.map(
        ({ productName, optionName, optionValue, mallProductMainImageUrl, mallProductNo, mallOptionNo, checked }) => (
          <FreeGiftThumbItem
            key={mallOptionNo}
            mallProductNo={mallProductNo}
            mallOptionNo={mallOptionNo}
            mallProductMainImageUrl={mallProductMainImageUrl}
            productName={productName}
            optionName={optionName}
            optionValue={optionValue}
            freeGiftOptionCountType={freeGiftOptionCountType}
            onChange={handleGiftSelect}
            checked={checked}
          />
        )
      )}
      {freeGiftOptionCountType === FREE_GIFT_OPTION_COUNT_TYPE.SELECT && (
        <FreeGiftThumbItem
          productName={t('freeGiftNoSelect')}
          mallProductMainImageUrl=""
          className="order-sheet__free-gift-info__no-select"
          freeGiftOptionCountType={freeGiftOptionCountType}
          onChange={handleNoSelect}
          checked={isNoSelect}
        />
      )}
    </ThumbList>
  );
};

export default FreeGiftThumbList;

FreeGiftThumbList.propTypes = {
  freeGiftConditionId: string.isRequired,
  freeGiftConditionNo: number.isRequired,
  freeGifts: arrayOf(object).isRequired,
  freeGiftOptionCountType: string.isRequired,
  freeGiftOptionCount: number,
};
