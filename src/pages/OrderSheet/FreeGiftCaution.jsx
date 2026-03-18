import { useTranslation } from 'react-i18next';

const FreeGiftCaution = () => {
  const { t } = useTranslation(['common', 'order']);

  const cautionText = t('freeGiftCautionText', { ns: 'order' });
  const cautionTextLines = cautionText.split('\n');

  return (
    <div className="order-sheet__free-gift-info__caution">
      <div className="order-sheet__free-gift-info__caution__title">{t('freeGiftCaution', { ns: 'order' })}</div>
      <div className="order-sheet__free-gift-info__caution__text">
        <ul>
          {cautionTextLines.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FreeGiftCaution;
