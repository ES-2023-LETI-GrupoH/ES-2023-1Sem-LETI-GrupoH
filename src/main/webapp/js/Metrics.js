function chooseColumn(number) {
    let workingData = parsedData;
    let chosenColumn;
    try {
        for (let currentLine = 0; currentLine < workingData.length; currentLine++) {
            // Checks if the number of the requested column isn't greater than the number of columns
            if (workingData[0].length >= number) {
                let j;
                while (j < number) {
                    workingData[0].length.shift();
                    j++;
                }
                console.log('Row Number: ' + (currentLine));
                console.log('Row Value: ' + chosenColumn);
                return chosenColumn = workingData[currentLine].shift().trim();
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}