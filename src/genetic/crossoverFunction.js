export default function crossoverFunction(phenotypeA, phenotypeB) {
    const index = Math.round(Math.random() * phenotypeA.length);
    const phenotypeAB = phenotypeA.slice(0, index).concat(phenotypeA.slice(index));
    const phenotypeBA = phenotypeB.slice(0, index).concat(phenotypeB.slice(index));
    return [phenotypeAB, phenotypeBA]
}
