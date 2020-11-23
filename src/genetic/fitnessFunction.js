import {table, processorsCount} from './config'

export default function fitnessFunction(phenotype) {
    let fitness = [];
    for (let i = 0; i < processorsCount; i++) {
        fitness[i] = 0;
    }
    phenotype.forEach((gene, index) => {
        fitness[gene] += table[gene][index];
    })

    return Math.max(...fitness) * -1;
}
