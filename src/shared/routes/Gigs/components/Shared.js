import React from 'react';
import Tooltip from 'components/Tooltip';
import { InfoPill } from 'components/Blocks';

export const UsingBookingLinkPill = () => (
    <Tooltip text="This request is from your booking link. You don't pay commission, and contact information is visible.">
        {({ ref, close, open }) => (
            <InfoPill
                active
                ref={ref}
                onMouseEnter={open}
                onMouseLeave={close}
                style={{
                    marginBottom: 0,
                    minWidth: 0,
                }}
            >
                Using booking link
            </InfoPill>
        )}
    </Tooltip>
);
