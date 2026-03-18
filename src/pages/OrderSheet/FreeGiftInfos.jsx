import { useTranslation } from 'react-i18next';

import { Accordion, useOrderSheetStateContext, VisibleComponent } from '@shopby/react-components';

import FreeGiftCaution from './FreeGiftCaution';
import FreeGiftDescription from './FreeGiftDescription';
import FreeGiftThumbList from './FreeGiftThumbList';

const FreeGiftInfos = () => {
  const { t } = useTranslation(['common', 'order']);
  const { freeGiftInfos } = useOrderSheetStateContext();

  if (freeGiftInfos?.length === 0) return <></>;

  return (
    <section className="l-panel">
      <Accordion className="order-sheet__free-gift-info" title={t('freeGift', { ns: 'order' })} isOpen={true}>
        <VisibleComponent
          shows={freeGiftInfos.length > 0}
          TruthyComponent={
            <>
              {freeGiftInfos.map(
                ({
                  giveConditionName,
                  giveStartYmdt,
                  giveEndYmdt,
                  freeGiftConditionNo,
                  freeGiftOptionCountType,
                  freeGiftOptionCount,
                  freeGifts,
                  freeGiftConditionId,
                }) => (
                  <>
                    <FreeGiftDescription
                      giveConditionName={giveConditionName}
                      freeGiftOptionCount={freeGiftOptionCount}
                      freeGiftOptionCountType={freeGiftOptionCountType}
                      giveStartYmdt={giveStartYmdt}
                      giveEndYmdt={giveEndYmdt}
                    />
                    <FreeGiftThumbList
                      freeGiftConditionId={freeGiftConditionId}
                      freeGiftConditionNo={freeGiftConditionNo}
                      freeGifts={freeGifts}
                      freeGiftOptionCountType={freeGiftOptionCountType}
                      freeGiftOptionCount={freeGiftOptionCount}
                    />
                  </>
                )
              )}
              <FreeGiftCaution />
            </>
          }
          FalsyComponent={<></>}
        />
      </Accordion>
    </section>
  );
};

export default FreeGiftInfos;
