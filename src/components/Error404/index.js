import React from 'react';
import { Link } from 'react-router-dom';
import IntlMessages from 'util/IntlMessages';

const Error404 = () => (
    <div className="app-wrapper page-error-container animated slideInUpTiny animation-duration-3">
        <div className="page-error-content">
            <div className="error-code mb-4 animated zoomInDown">404</div>
            <h2 className="text-center fw-regular title bounceIn animation-delay-10 animated " style={{ color: 'black' }}>
                <IntlMessages id="extraPages.404Msg" />
            </h2>
            <p className="text-center zoomIn animation-delay-20 animated">
                <Link className="btn btn-primary" to="/app/bot-config">Quay lại trang chủ</Link>
            </p>
        </div>
    </div>
);

export default Error404;
