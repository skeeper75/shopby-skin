/* eslint-disable new-cap */
/* eslint-disable camelcase */
import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

import cookie from 'js-cookie';
import PropTypes from 'prop-types';

const skinId = 'netfunnel-skin-id';

const Netfunnel = ({ tc, activeNetfunnel, setActiveNetfunnel, children }) => {
  const { TS_COOKIE_ID } = window.NetFunnel;
  const enableNetfunnel = tc?.use && tc?.id;
  const isActiveNetfunnel = enableNetfunnel && activeNetfunnel;

  const handleNetFunnelError = (e, ret) => {
    console.log('error', e, ret);
    sessionStorage.removeItem(TS_COOKIE_ID);
    cookie.remove(TS_COOKIE_ID);
  };

  const aliveNetFunnel = ({ actionId }) => {
    window.NetFunnel_AliveNotice(
      {
        action_id: actionId,
      },
      {
        continued: () => {
          //
        },
        error: (e, ret) => {
          handleNetFunnelError(e, ret);

          location.reload();
        },
      }
    );
  };

  const activeNetFunnel = ({ actionId }) => {
    window.NetFunnel_Action(
      {
        action_id: actionId,
        skinid: skinId,
      },
      {
        success: () => {
          setActiveNetfunnel(false);
          aliveNetFunnel({ actionId });
        },
        error: (e, ret) => {
          handleNetFunnelError(e, ret);

          // Action is not exist (액션 ID가 존재하지 않을 경우 통과)
          if (ret.code === 501) {
            setActiveNetfunnel(false);

            return;
          }

          location.reload();
        },
      }
    );
  };

  useEffect(() => {
    window.NetFunnel.SkinUtil.add(
      skinId,
      {
        htmlStr: `
        <div class="netfunnel-wrapper">
          <div id="NetFunnel_Skin_Top" class="netfunnel">
            <img src="https://shopby-skin.cdn-nhncommerce.com/assets/images/img-area.gif" alt="대기중 안내 이미지" />
            <section id="netfunnel_loading" class="netfunnel" role="alert">
              <strong class="netfunnel__header">사용자가 많아 접속 대기중이에요</strong>
              <div class="netfunnel__waiting-info">
                <p>
                  대기자 수 : <span class="netfunnel__waiting-count"><strong id="NetFunnel_Loading_Popup_Count"></strong></span>
                </p>
                <p>
                  남은 시간 : <span class="netfunnel__waiting-count"><strong id="NetFunnel_Loading_Popup_TimeLeft"></strong></span>
                </p>
              </div>
              <p class="netfunnel__message">
                잠시만 기다리시면 순서에 따라 자동 접속됩니다.<br />새로고침하면 대기시간이 길어질 수 있어요.
              </p>
            </section>
          </div>
        </div>
      `,
        prepareCallback() {
          const mpopupBg = document.getElementById('mpopup_bg');

          if (mpopupBg) {
            mpopupBg.style.backgroundColor = 'rgba(255, 255, 255)';
          }
        },
      },
      isMobile ? 'mobile' : 'normal'
    );
  }, []);

  useEffect(() => {
    const actionId = tc?.id;
    if (!actionId) return;

    const netFunnelKey = cookie.get(TS_COOKIE_ID);

    // 넷퍼넬 키가 있을 경우 자원 리소스 유지 활성화
    if (netFunnelKey) {
      setActiveNetfunnel(false);
      aliveNetFunnel({ actionId });

      return;
    }

    // 넷퍼넬 키가 없을 경우 넷퍼넬 리소스 요청 활성화
    activeNetFunnel({ actionId });
  }, []);

  if (!isActiveNetfunnel) {
    return children;
  }

  return <div></div>;
};

export default Netfunnel;

Netfunnel.propTypes = {
  tc: PropTypes.shape({
    use: PropTypes.bool,
    id: PropTypes.string,
  }),
  activeNetfunnel: PropTypes.bool,
  setActiveNetfunnel: PropTypes.func.isRequired,
  children: PropTypes.node,
};
