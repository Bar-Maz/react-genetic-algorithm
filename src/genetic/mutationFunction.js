const mutationFunction = (processorsCount, processesCount, mutationFactor) => phenotype => {
    const geneIndexes =   [...Array(Math.floor(processesCount*mutationFactor))].map((_) =>
                            Math.floor(
                                Math.random() * phenotype.length
                            )
                        )
    geneIndexes.forEach(geneIndex => {
        phenotype[geneIndex] = Math.floor(Math.random() * processorsCount);
    });
    return phenotype;
};

export default mutationFunction;
