import { unescapeHTML, sanitizeHTMLToNoTags } from '@shopby/shared';

export const getOptionLabels = ({ optionName, optionValue, optionInputs }) => {
  const optionNameTokens = optionName?.split('|') ?? [];
  const optionValueTokens = optionValue?.split('|') ?? [];
  const normalOptionLabels = optionNameTokens.map(
    (optionNameToken, idx) =>
      `${idx + 1}) ${sanitizeHTMLToNoTags(unescapeHTML(optionNameToken))}: ${sanitizeHTMLToNoTags(
        unescapeHTML(optionValueTokens[idx])
      )}`
  );
  const textOptionLabels =
    optionInputs?.map(
      ({ inputLabel, inputValue }) =>
        `${sanitizeHTMLToNoTags(unescapeHTML(inputLabel))}: ${sanitizeHTMLToNoTags(unescapeHTML(inputValue))}`
    ) ?? [];

  return {
    normalOptionLabels,
    textOptionLabels,
  };
};
