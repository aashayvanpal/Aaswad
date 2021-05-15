import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';
import infoIcon from '../../images/info-icon.svg'

const HDToolTip = (props) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <>
            <img src={infoIcon} alt="infoIcon" href="#" id="HDtip" />
            <Tooltip placement="right" isOpen={tooltipOpen} target="HDtip" toggle={toggle}>
                Door step delivery provided from our side
      </Tooltip>
        </>
    );
}

export default HDToolTip;