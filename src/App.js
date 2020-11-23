import React from 'react';
import './App.css';
import GeneticAlgorithmConstructor from 'geneticalgorithm';
import {crossoverFunction, mutationFunction, fitnessFunction} from './genetic'

const config = {
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessFunction,
    population: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    populationSize: 200
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.ga = GeneticAlgorithmConstructor(config)
    }

    evolve = () => {
        this.ga.evolve();
        console.log(this.ga.best())
        console.log(this.ga.bestScore() * -1 + "s")
    }

    render() {
        return (
            <div>
                <button onClick={this.evolve}>
                    EVOLVE
                </button>
            </div>
        )
    }
}

export default App;
