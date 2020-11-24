export default function seed(processesCount, processorsCount) {

    let table = []

    for (let i = 0; i < processorsCount; i++) {
        table[i] = [];
        for (let j = 0; j < processesCount; j++) {
            table[i][j] = Math.ceil(Math.random() * 50);
        }
    }

    return table
}
