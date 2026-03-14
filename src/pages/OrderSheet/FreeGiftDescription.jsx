import { useTranslation } from 'react-i18next';

import dayjs from 'dayjs';
import { string, number } from 'prop-types';

import { FREE_GIFT_OPTION_COUNT_TYPE } from '@shopby/shared';

const FreeGiftDescription = ({
  giveConditionName,
  freeGiftOptionCount,
  freeGiftOptionCountType,
  giveStartYmdt,
  giveEndYmdt,
}) => {
  const { t } = useTranslation('order');
  const giveStartDate = dayjs(giveStartYmdt).format('YYYY-MM-DD');
  const giveEndDate = dayjs(giveEndYmdt).format('YYYY-MM-DD');

  return (
    <div className="order-sheet__free-gift-info__description">
      <div className="order-sheet__free-gift-info__description__top">
        <div className="order-sheet__free-gift-info__description__title">{giveConditionName}</div>
        <div className="order-sheet__free-gift-info__description__date">
          {giveStartDate} ~ {giveEndDate}
        </div>
      </div>
      {freeGiftOptionCountType === FREE_GIFT_OPTION_COUNT_TYPE.SELECT && (
        <div className="order-sheet__free-gift-info__description__count">
          {t('freeGiftMaxSelectionDescription', { count: freeGiftOptionCount })}
        </div>
      )}
    </div>
  );
};

export default FreeGiftDescription;

FreeGiftDescription.propTypes = {
  giveConditionName: string.isRequired,
  freeGiftOptionCount: number.isRequired,
  freeGiftOptionCountType: string.isRequired,
  giveStartYmdt: string.isRequired,
  giveEndYmdt: string.isRequired,
};
