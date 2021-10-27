import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';
import infoIcon from '../../images/info-icon.svg'

const ServiceToolTip = (props) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <>
            <img src={infoIcon} alt="infoIcon" href="#" id="servicetip" />
            <Tooltip placement="right" isOpen={tooltipOpen} target="servicetip" toggle={toggle}>
                Home Delivery + Buffet system is arranged from our side
      </Tooltip>
        </>
    );
}

export default ServiceToolTip;