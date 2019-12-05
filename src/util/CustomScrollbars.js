import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars';

const CustomScrollbars = React.forwardRef((props, ref) =>
    < Scrollbars ref={ref}  {...props} autoHide
        renderTrackHorizontal={props => <div {...props}
            style={{ display: 'none' }}
            className="track-horizontal" />} />)
export default CustomScrollbars;