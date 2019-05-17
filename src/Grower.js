import { Circle } from 'react-konva';
import React from 'react';
import PropTypes from 'prop-types';

export default class CircularOrbit extends React.Component {
    static displayName = 'CircularOrbit';
    static propTypes = {
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        pathRadius: PropTypes.number.isRequired,
        centerOffset: PropTypes.number.isRequired,
        numberOfPeaks: PropTypes.number.isRequired,
        resolutionReduction: PropTypes.number
    };
    constructor(props) {
        super(props);

        this.state = {
            color: 'green',
            height: props.height,
            width: props.width,
            angle: 0
        };
    }
    componentDidMount() {
        this.startAnimation();
    }
    rAFID = null;
    startAnimation = () => {
        this.rAFID = window.requestAnimationFrame(this.renderNewFrame.bind(this, this.startAnimation));
    };
    getRadianIncrement = resolutionReduction => Math.PI * 0.001 * (resolutionReduction || 1);
    calculatePositionOnCircle(angle) {
        const polarToCartesian = (radius, radian) => ({
            x: radius * Math.cos(radian),
            y: radius * Math.sin(radian)
        });
        const makeWave = t => Math.sin(t) / (100 / this.props.amplitudeAsPercentage) + 1;
        const { x, y } = polarToCartesian(this.props.pathRadius * makeWave(angle * this.props.numberOfPeaks), angle);

        return { x, y };
    }
    renderNewFrame = cb => {
        this.setState(
            {
                angle: this.state.angle + this.getRadianIncrement(this.props.resolutionReduction) * 10
            },
            cb
        );
    };
    handleClick = () => {
        if (this.rAFID) {
            window.cancelAnimationFrame(this.rAFID);
            this.rAFID = null;
        } else {
            this.startAnimation();
        }
    };
    render() {
        const rects = [];
        const  {percentageDrawn, resolutionReduction, centerOffset, width, height} = this.props;
        const radiusDivider = 100 / Math.max(1, Math.min(percentageDrawn, 100));
        for (let i = 0; i < (Math.PI * 2) / radiusDivider; i += this.getRadianIncrement(resolutionReduction)) {
            const { x, y } = this.calculatePositionOnCircle(this.state.angle + i);
            rects.push(
                <Circle
                    onClick={this.handleClick}
                    x={x + centerOffset}
                    y={y + centerOffset}
                    width={width}
                    height={height}
                    fill={`rgba(${-i + 200}, ${i * 75}, ${i > 2 ? 255 : 0}, ${i / 8})`}
                />
            );
        }

        return <React.Fragment>{rects}</React.Fragment>;
    }
}
