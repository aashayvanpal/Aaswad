import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import infoIcon from '../../images/info-icon.svg'
import './ServiceToolTip.scss'

const HDToolTip = () => {
  return (
    <Tooltip title="Door step delivery provided from our side" placement="right">
      <img src={infoIcon} alt="infoIcon" className="service-tooltip-icon" />
    </Tooltip>
  );
}

export default HDToolTip;
