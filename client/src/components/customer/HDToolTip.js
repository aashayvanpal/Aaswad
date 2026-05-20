import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import infoIcon from '../../images/info-icon.svg'

const HDToolTip = () => {
  return (
    <Tooltip title="Door step delivery provided from our side" placement="right">
      <img src={infoIcon} alt="infoIcon" style={{ cursor: 'pointer' }} />
    </Tooltip>
  );
}

export default HDToolTip;
