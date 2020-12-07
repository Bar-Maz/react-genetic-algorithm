const mutationFunction = processorsCount => phenotype => {
    const geneIndex = Math.floor(Math.random() * phenotype.length);
    phenotype[geneIndex] = Math.floor(Math.random() * processorsCount);
    return phenotype;
};

export default mutationFunction;
