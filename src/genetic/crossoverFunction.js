export default function crossoverFunction(phenotypeA, phenotypeB) {
    let index = Math.round(Math.random() * phenotypeA.length);
    let index2 = Math.round(Math.random() * phenotypeA.length);
    if (index < index2) {
        [index2, index] = [index, index2]
    }
    const phenotypeAB = phenotypeA.slice(0, index).concat(phenotypeB.slice(index, index2)).concat(phenotypeA.slice(index2));
    const phenotypeBA = phenotypeB.slice(0, index).concat(phenotypeA.slice(index, index2)).concat(phenotypeB.slice(index2));
    return [phenotypeAB, phenotypeBA]
}
