import React from 'react';
import './App.css';
import GeneticAlgorithmConstructor from 'geneticalgorithm';
import {crossoverFunction, mutationFunction, fitnessFunction, seed, processesCount, processorsCount} from './genetic'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.table = seed(processesCount, processorsCount)
        this.config = {
            mutationFunction: mutationFunction,
            crossoverFunction: crossoverFunction,
            fitnessFunction: (phenotype) => fitnessFunction(phenotype, this.table, processorsCount),
            population: [new Array(processesCount).fill(0)],
            populationSize: 100
        }
        this.ga = GeneticAlgorithmConstructor(this.config)
        this.state = {
            stop: false,
            best: [],
            bestScore: 0,
            iter: 0,
        }
    }

    evolve = () => {
        this.setState({stop: false})
        this.ga.evolve();
        this.setState({bestScore: this.ga.bestScore()});
        this.setState({best: this.ga.best()});
        const loop = () => {
            this.ga.evolve();
            this.setState({
                iter: this.state.iter + 1
            })
            if (this.ga.bestScore() > this.state.bestScore) {
                this.setState({bestScore: this.ga.bestScore()});
                this.setState({best: this.ga.best()});
            }
            if (!this.state.stop) {
                setTimeout(loop, 0);
            }
        }
        loop();
    }

    render() {
        return (
            <div>
                <p>{JSON.stringify(this.table)}</p>
                <button onClick={() => this.setState({stop: false}, this.evolve)}>
                    EVOLVE
                </button>
                <button onClick={() => this.setState({stop: true})}>
                    STOP
                </button>
                <p>{JSON.stringify(this.state.best)}</p>
                <h4>{this.state.bestScore * -1 + "s"}</h4>
                <h4>{"iteracja: " + this.state.iter}</h4>
            </div>
        )
    }
}

export default App;
