import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  useBoardConfigurationContextState,
  VisibleComponent,
  useAuthStateContext,
  useBoardConfigurationContextAction,
} from '@shopby/react-components';

import { NOTICE_BOARD_ID } from '../../constants/board';

const Cs = () => {
  const {
    boardConfig: { boardConfigs },
  } = useBoardConfigurationContextState();
  const { checkDisplayableState } = useBoardConfigurationContextAction();
  const { profile } = useAuthStateContext();

  const [displayableStatus, setDisplayableStatus] = useState(false);

  const notice = boardConfigs.find(({ boardId }) => boardId === NOTICE_BOARD_ID);

  useEffect(() => {
    const { data } = checkDisplayableState({
      profile,
      boardId: NOTICE_BOARD_ID,
    });

    setDisplayableStatus(data);
  }, [notice]);

  return (
    <div className="cs">
      <VisibleComponent
        shows={displayableStatus}
        TruthyComponent={
          <Link className="cs__link" to="/notice">
            {notice?.name}
          </Link>
        }
      />
      <Link className="cs__link" to="/customer-center">
        고객센터
      </Link>
    </div>
  );
};

export default Cs;
