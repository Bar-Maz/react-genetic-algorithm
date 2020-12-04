import React from "react";
import "./App.css";
import GeneticAlgorithmConstructor from "geneticalgorithm";
import {
    crossoverFunction,
    mutationFunction,
    fitnessFunction,
    seed,
    processesCount,
    processorsCount,
} from "./genetic";
import {
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Line,
    BarChart,
    Bar,
} from "recharts";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

const colors = scaleOrdinal(schemeCategory10).range();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.table = seed(processesCount, processorsCount);
        this.config = {
            mutationFunction: mutationFunction,
            crossoverFunction: crossoverFunction,
            fitnessFunction: (phenotype) =>
                fitnessFunction(phenotype, this.table, processorsCount),
            population: [
                [...Array(processesCount)].map((_) =>
                    Math.floor(Math.random() * processorsCount)
                ),
            ],
            populationSize: 100,
        };
        this.ga = GeneticAlgorithmConstructor(this.config);
        this.state = {
            stop: false,
            best: [],
            bestScore: 0,
            data: [],
            processors: new Array(processorsCount).fill(0),
            iter: 0,
        };
        this.data = [];
        this.inc = 0;
    }

    evolve = () => {
        this.setState({ stop: false });
        this.ga.evolve();
        this.setState({ bestScore: this.ga.bestScore() });
        this.setState({ best: this.ga.best() });
        const population = this.ga.scoredPopulation().map((x) => x.score);
        let processors = new Array(processorsCount).fill(0);
        this.ga.best().forEach((el, i) => {
            processors[el] += this.table[el][i];
        });
        this.setState({
            data: [
                {
                    best: -this.ga.bestScore(),
                    average:
                        -population.reduce((x, y) => x + y, 0) /
                        population.length,
                },
            ],
            processors: processors,
        });
        const loop = () => {
            this.inc++;
            this.ga.evolve();
            if (this.inc % 10 === 0) {
                const population = this.ga
                    .scoredPopulation()
                    .map((x) => x.score);
                this.data.push({
                    iteration: this.state.iter + this.inc,
                    best: -this.ga.bestScore(),
                    average:
                        -population.reduce((x, y) => x + y, 0) /
                        population.length,
                });
                if (this.inc === 100) {
                    this.inc = 0;
                    let best = this.ga.best();
                    let processors = new Array(processorsCount).fill(0);
                    best.forEach((el, i) => {
                        processors[el] += this.table[el][i];
                    });
                    this.setState((prevState) => ({
                        data: prevState.data.concat(this.data),
                        iter: this.state.iter + 100,
                        bestScore: this.ga.bestScore(),
                        stop: prevState.best === best,
                        best: best,
                        processors: processors,
                    }));
                    this.data = [];
                }
            }

            if (!this.state.stop) {
                setTimeout(loop, 0);
            }
        };
        loop();
    };

    render() {
        return (
            <div>
                <p>{JSON.stringify(this.table)}</p>
                <button
                    onClick={() => this.setState({ stop: false }, this.evolve)}
                >
                    EVOLVE
                </button>
                <button onClick={() => this.setState({ stop: true })}>
                    STOP
                </button>
                <p>{JSON.stringify(this.state.best)}</p>
                <h4>{this.state.bestScore * -1 + "s"}</h4>
                <h4>{"iteration: " + this.state.iter}</h4>
                <LineChart
                    width={1600}
                    height={900}
                    data={this.state.data}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                    <XAxis dataKey="iteration" />
                    <YAxis dataKey="best" />
                    <Tooltip />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Line
                        type="monotone"
                        dataKey="best"
                        stroke="#ff7300"
                        yAxisId={0}
                    />
                    <Line
                        type="monotone"
                        dataKey="average"
                        stroke="#0073ff"
                        yAxisId={0}
                    />
                </LineChart>
                <BarChart
                    width={1100}
                    height={250}
                    barGap={100 / processorsCount}
                    barSize={1000 / processorsCount}
                    data={[this.state.processors]}
                    margin={{ top: 20, right: 60, bottom: 0, left: 20 }}
                >
                    <XAxis dataKey="name" />
                    <YAxis tickCount={7} />
                    <Tooltip />
                    <CartesianGrid />
                    {this.state.processors.map((proc, i) => (
                        <Bar dataKey={i.toString()} fill={colors[i % 10]} />
                    ))}
                </BarChart>
            </div>
        );
    }
}

export default App;
