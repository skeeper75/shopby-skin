import { Helmet } from 'react-helmet';

import { useMallStateContext } from '@shopby/react-components';

const getGoogleAnalyticsScriptTag = (externalServiceConfig) => {
  const id = externalServiceConfig?.googleAnalytics;
  const GOOGLE_TAG_MANAGER_URL = '//www.googletagmanager.com';

  if (!id) return <></>;

  return (
    <>
      <Helmet>
        <script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https:${GOOGLE_TAG_MANAGER_URL}/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);console.log('google test');
})(window,document,'script','dataLayer','${id}')`}</script>
      </Helmet>
      <Helmet>
        <iframe
          src={`https:${GOOGLE_TAG_MANAGER_URL}/ns.html?id=${id}`}
          height="0"
          width="0"
          style="display:none;visibility:hidden"
        ></iframe>
      </Helmet>
      <Helmet>
        <script type="text/javascript" async={true} src={`${GOOGLE_TAG_MANAGER_URL}/gtag/js?id=${id}`}></script>
      </Helmet>
      <Helmet>
        <script type="text/javascript">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(...args) {
              window.dataLayer.push(args);
            }
            gtag('js', new Date());
            gtag('config', "${id}");`}
        </script>
      </Helmet>
    </>
  );
};

const ExternalServiceConfig = () => {
  const { externalServiceConfig } = useMallStateContext();

  return <>{getGoogleAnalyticsScriptTag(externalServiceConfig)}</>;
};

export default ExternalServiceConfig;
