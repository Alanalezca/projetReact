const getRandomUniqueNumbers = (nombreElements, intervalMax) => {
    const result = new Set();

    while (result.size < nombreElements) {
        const n = Math.floor(Math.random() * (intervalMax + 1));
        result.add(n);
    }

    return [...result];
}

export default getRandomUniqueNumbers;