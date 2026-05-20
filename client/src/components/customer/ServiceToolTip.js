import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import infoIcon from '../../images/info-icon.svg'

const ServiceToolTip = () => {
  return (
    <Tooltip title="Home Delivery + Buffet system is arranged from our side" placement="right">
      <img src={infoIcon} alt="infoIcon" style={{ cursor: 'pointer' }} />
    </Tooltip>
  );
}

export default ServiceToolTip;
