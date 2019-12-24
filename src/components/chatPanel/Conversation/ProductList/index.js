import React, { Component } from "react";
import Slider from "react-slick";
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons'
import Button from '@material-ui/core/Button';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { parseNumberToMoney } from '../../../../services/util'

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: 'none', right: -25, color: 'black' }}
            onClick={onClick}>
        </div>
    );
}

const getStyle = (product) => {
    const styles = {}
    if (product.contentType && product.contentType === 'collection') styles.minHeight = 30
    return styles
}

const getPrice = (product) => {
    const price = product.price ? product.price : product.variants[0].price;
    return price
}

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "none", left: -25, color: 'black' }}
            onClick={onClick}>
            {/* <KeyboardArrowLeft /> */}
        </div>
    );
}
class ProductList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { attachment } = this.props
        const settings = {
            //dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />,

        };
        return (
            <div className="slick-container">
                <div className="chat-element-slider">
                    <Slider {...settings}>
                        {attachment.map(product =>
                            <div className="product-wrapper">
                                <div className="mutiple">
                                    {product.note ? <div className="product-note">{product.note}</div> : null}
                                    <a target="_blank" href={product.buttons[0].type === 'open-url' ? 'https://' + product.buttons[0].value : '#'} >
                                        <div className="image-container">
                                            <img className="product-image" src={product.image}></img>
                                        </div>
                                    </a>
                                    <div className="chat-element-info">
                                        <div className="chat-element-text" style={getStyle(product)} >
                                            <div className="chat-element-title">{product.title}</div>
                                            {product.contentType === 'product' && <div className="chat-element-subtitle">{parseNumberToMoney(getPrice(product))} {product.currencyCode}</div>}
                                        </div>
                                        <div className="chat-element-button-group">
                                            {/* {product.buttons.map(button =>
                                                <Button target="_blank" href={button.type === 'open-url' ? 'https://' + button.value : ''} className="chat-element-button">
                                                    {button.title}
                                                </Button>
                                            )} */}
                                            <Button target="_blank" href={product.buttons[0].type === 'open-url' ? 'https://' + product.buttons[0].value : ''} className="chat-element-button">
                                                {product.buttons[0].title}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Slider>
                </div>
            </div>
        );
    }
}
export default ProductList