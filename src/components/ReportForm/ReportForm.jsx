import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { func } from 'prop-types';

import { Button, SelectBox, CharacterCounter, useModalActionContext } from '@shopby/react-components';

const ReportForm = ({ onClose, onSubmit }) => {
  const [reportType, setReportType] = useState('');
  const [reportContent, setReportContent] = useState('');
  const { openAlert } = useModalActionContext();
  const { t } = useTranslation(['board', 'common']);

  const handleReportTypeSelect = ({ currentTarget }) => {
    setReportType(currentTarget.value);
  };

  const handleReportContentChange = ({ character }) => {
    setReportContent(character.value);
  };

  const handleReportSubmit = () => {
    if (!reportType) {
      openAlert({
        message: t('reportTypeRequired', { ns: 'board' }),
      });

      return;
    }

    if (reportType === 'ETC' && !reportContent) {
      openAlert({
        message: t('reportContentRequired', { ns: 'board' }),
      });

      return;
    }

    onSubmit({
      reportType,
      reportContent,
    });
  };

  return (
    <div className="report-form">
      <div
        className="report-form__description"
        dangerouslySetInnerHTML={{ __html: t('reportDescription1', { ns: 'board' }) }}
      />

      <div className="report-form__section">
        <label className="required">{t('reportTypeLabel', { ns: 'board' })}</label>
        <SelectBox
          className="product-inquiry-form__type"
          value={reportType}
          options={[
            { label: t('reportTypeSelectPlaceholder', { ns: 'board' }), value: '' },
            { label: t('reportTypeSelectOption1', { ns: 'board' }), value: 'COPYRIGHT' },
            { label: t('reportTypeSelectOption2', { ns: 'board' }), value: 'SLANDER' },
            { label: t('reportTypeSelectOption3', { ns: 'board' }), value: 'ETC' },
          ]}
          onSelect={handleReportTypeSelect}
        />
      </div>

      <div className="report-form__section">
        <label className={`${reportType === 'ETC' && 'required'}`}>{t('reportContentLabel', { ns: 'board' })}</label>
        <CharacterCounter
          id="product-inquiry-form__text"
          counterType="CHARACTER"
          textType="TEXT_AREA"
          placeholder={t('reportContentPlaceholder', { ns: 'board' })}
          className="product-inquiry-form__text"
          onChange={handleReportContentChange}
          value={reportContent}
          cols="30"
          rows="10"
          valid="NO_COMMON_SPECIAL"
          limitCount={{
            character: 1000,
          }}
        />
      </div>

      <div className="report-form__description">{t('reportDescription2', { ns: 'board' })}</div>

      <div className="board-form__button-group">
        <Button
          className="board-form__cancel-btn board-form__btn"
          theme="default"
          label={t('cancel', { ns: 'common' })}
          onClick={onClose}
        />
        <Button
          className="board-form__modify-btn board-form__btn"
          theme="dark"
          label={t('confirm', { ns: 'common' })}
          onClick={handleReportSubmit}
        />
      </div>
    </div>
  );
};

ReportForm.propTypes = {
  onClose: func,
  onSubmit: func,
};

export default ReportForm;
