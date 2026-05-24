import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import infoIcon from '../../images/info-icon.svg'
import './ServiceToolTip.scss'

const ServiceToolTip = () => {
  return (
    <Tooltip title="Home Delivery + Buffet system is arranged from our side" placement="right">
      <img src={infoIcon} alt="infoIcon" className="service-tooltip-icon" />
    </Tooltip>
  );
}

export default ServiceToolTip;
