import React from "react";
import "./App.css";
import GeneticAlgorithmConstructor from "geneticalgorithm";
import {
    crossoverFunction,
    mutationFunction,
    fitnessFunction,
    seed,
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
    Cell,
} from "recharts";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

const colors = scaleOrdinal(schemeCategory10).range();
const initialState = {
    stop: true,
    best: [],
    data: [],
    processors: [],
    iter: 0,
    table: [],
    processesCount: 50,
    processorsCount: 10,
    mutationFactor: 0.1,
    gensToStop: 2000,
    showTable: false,
};
class App extends React.Component {
    constructor(props) {
        super(props);
        this.ga = null;
        this.state = initialState;
        this.data = [];
        this.inc = 0;
    }

    init = (resetTable = true) => {
        this.data = [];
        this.inc = 0;
        this.setState(
            {
                ...initialState,
                processesCount: this.state.processesCount,
                processorsCount: this.state.processorsCount,
                mutationFactor: this.state.mutationFactor,
                gensToStop: this.state.gensToStop,
                showTable: this.state.showTable,
                table: resetTable
                    ? seed(
                          this.state.processesCount,
                          this.state.processorsCount
                      )
                    : this.state.table,
                processors: this.labelProcessors(
                    new Array(this.state.processorsCount).fill(0)
                ),
            },
            () => {
                const config = {
                    mutationFunction: mutationFunction(
                        this.state.processorsCount,
                        this.state.processesCount,
                        this.state.mutationFactor
                    ),
                    crossoverFunction: crossoverFunction,
                    fitnessFunction: fitnessFunction(
                        this.state.processorsCount,
                        this.state.table
                    ),
                    population: [
                        [...Array(this.state.processesCount)].map((_) =>
                            Math.floor(
                                Math.random() * this.state.processorsCount
                            )
                        ),
                    ],
                    populationSize: 100,
                };
                this.ga = GeneticAlgorithmConstructor(config);
            }
        );
    };

    evolve = () => {
        this.setState({ stop: false });
        this.ga.evolve();
        this.setState({ bestScore: this.ga.bestScore() });
        this.setState({ best: this.ga.best() });
        const population = this.ga.scoredPopulation().map((x) => x.score);
        let processors = new Array(this.state.processorsCount).fill(0);
        this.ga.best().forEach((el, i) => {
            processors[el] += this.state.table[el][i];
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
            processors: this.labelProcessors(processors),
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
                    let bestScore = this.ga.bestScore();
                    let processors = new Array(this.state.processorsCount).fill(
                        0
                    );
                    best.forEach((el, i) => {
                        processors[el] += this.state.table[el][i];
                    });
                    this.setState((prevState) => ({
                        data: prevState.data.concat(this.data),
                        iter: this.state.iter + 100,
                        bestScore: bestScore,
                        stop:
                            this.state.iter > this.state.gensToStop &&
                            -bestScore ===
                                this.state.data[
                                    this.state.iter / 10 -
                                        Math.floor(
                                            (this.state.gensToStop - 100) / 10
                                        )
                                ].best,
                        best: best,
                        processors: this.labelProcessors(processors),
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

    setProcessorsCount = (e) => {
        this.setState({ processorsCount: parseInt(e.target.value) });
    };

    setProcessesCount = (e) => {
        this.setState({ processesCount: parseInt(e.target.value) });
    };

    setMutationFactor = (e) => {
        this.setState({ mutationFactor: parseFloat(e.target.value) });
    };

    setGensToStop = (e) => {
        this.setState({ gensToStop: parseInt(e.target.value) });
    };

    startEvolution = () => {
        this.setState({ stop: false }, this.evolve);
    };

    stopEvolution = () => {
        this.setState({ stop: true });
    };

    toggleTable = () => {
        this.setState((prevState) => ({
            showTable: !prevState.showTable,
        }));
    };

    reset = () => this.init(false);

    labelProcessors = (processors) =>
        processors.map((proc, i) => ({ label: i, value: proc }));

    render() {
        return (
            <div>
                <label for="processors">Processors: </label>
                <input
                    id={"processors"}
                    value={this.state.processorsCount}
                    onChange={this.setProcessorsCount}
                    type="number"
                    min="0"
                    disabled={!this.state.stop}
                />
                <br />
                <label for="processes">Processes: </label>
                <input
                    id={"processes"}
                    value={this.state.processesCount}
                    onChange={this.setProcessesCount}
                    type="number"
                    min="0"
                    disabled={!this.state.stop}
                />
                <br />
                <label for="mutationFactor">Mutation Factor: </label>
                <input
                    id={"mutationFactor"}
                    value={this.state.mutationFactor}
                    onChange={this.setMutationFactor}
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    disabled={!this.state.stop}
                />
                <br />
                <label for="gensToStop">Generations to Stop: </label>
                <input
                    id={"gensToStop"}
                    value={this.state.gensToStop}
                    onChange={this.setGensToStop}
                    type="number"
                    min="0"
                    disabled={!this.state.stop}
                />
                <br />
                <button onClick={this.toggleTable}>
                    {this.state.showTable ? "HIDE TABLE" : "SHOW TABLE"}
                </button>
                <br />
                {this.state.showTable && this.state.table[0] ? (
                    <table>
                        <tbody>
                            <tr>
                                <td></td>
                                {this.state.table[0].map((app, i) => (
                                    <td>{"A" + i}</td>
                                ))}
                            </tr>
                            {this.state.table.map((row, i) => (
                                <tr>
                                    <td>{"P" + i}</td>
                                    {row.map((cell) => (
                                        <td>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : null}
                <button onClick={this.init}>INIT</button>
                <button onClick={this.startEvolution}>EVOLVE</button>
                <br />
                <button onClick={this.stopEvolution}>STOP</button>
                <button onClick={this.reset}>RESET</button>
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
                    <YAxis dataKey="average" />
                    <Tooltip />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Line
                        type="monotone"
                        dot={false}
                        dataKey="best"
                        stroke="#ff7300"
                        yAxisId={0}
                        strokeWidth={2}
                    />
                    <Line
                        type="monotone"
                        dot={false}
                        dataKey="average"
                        stroke="#0073ff"
                        yAxisId={0}
                        strokeWidth={2}
                    />
                </LineChart>
                <BarChart
                    width={1100}
                    height={250}
                    barGap={100 / this.state.processorsCount}
                    barSize={1000 / this.state.processorsCount}
                    data={this.state.processors}
                    margin={{ top: 20, right: 60, bottom: 0, left: 20 }}
                >
                    <XAxis dataKey={"label"} />
                    <YAxis tickCount={7} />
                    <Tooltip />
                    <CartesianGrid />
                    <Bar dataKey={"value"}>
                        {this.state.processors.map((proc, i) => (
                            <Cell key={i} fill={colors[i % 10]} />
                        ))}
                    </Bar>
                </BarChart>
            </div>
        );
    }
}

export default App;
