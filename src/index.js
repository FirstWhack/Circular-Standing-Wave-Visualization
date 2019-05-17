import React from 'react';
import { render } from 'react-dom';
import { Layer, Stage } from 'react-konva';

import Grower from './Grower';

const canvasSize = 1200;

class App extends React.Component {
    static displayName = 'Main';
    constructor(props) {
        super(props);
        this.state = {
            numberOfPeaks: 3.14,
            amplitudeAsPercentage: 30,
            pathRadius: canvasSize / 4,
            percentageDrawn: 50,
            resolutionReduction: 1
        };
    }
    handleInputChange = ({ target: { value, name } }) => this.setState({ [name]: value });
    render() {
        const parameterInputs = Object.entries(this.state).map(([key, value]) => {
            return (
                <label
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: 350
                    }}
                >
                    {key}:
                    <input onChange={this.handleInputChange} min='1' type="number" name={key} value={value} />
                </label>
            );
        });

        return (
            <React.Fragment>
                {parameterInputs}
                <Stage width={canvasSize} height={canvasSize}>
                    <Layer>
                        <Grower height={10} width={10} {...this.state} centerOffset={canvasSize / 2} />
                    </Layer>
                </Stage>
            </React.Fragment>
        );
    }
}

render(<App />, document.getElementById('root'));
