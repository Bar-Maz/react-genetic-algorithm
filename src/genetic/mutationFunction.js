import {processorsCount} from './config'

export default function mutationFunction(phenotype) {
    const geneIndex = Math.floor(Math.random() * phenotype.length);
    phenotype[geneIndex] = Math.floor(Math.random() * processorsCount);
    return phenotype;
}
