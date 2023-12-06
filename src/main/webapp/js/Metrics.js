/**
 * In this variable, we'll store all the necessary columns and the new information.
 * @type {Matrix<String>}
 */
let MatrixTable;

/**
 * In this variable, we'll preload all the information from the classrooms.
 * @type {Matrix<String>}
 */
let classroomsSpecs = loadAndParseCSV("/src/main/webapp/files/CaracterizaçãoDasSalas.csv");


function chooseColumn(number,matrix) {
    let workingData = matrix;
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

function LoadClasses(){
    next = 0;
    MatrixTable[0][next] = chooseColumn(2);
    next++;
    MatrixTable[0][next] = chooseColumn(5);
    next++;
    MatrixTable[0][next] = chooseColumn(7);
    next++;
    MatrixTable[0][next] = chooseColumn(8);
    next++;
    MatrixTable[0][next] = chooseColumn(9);
    next++;
    MatrixTable[0][next] = chooseColumn(11);
    next++;
}

function checkNumberOfStudents(){
    for(i = 1; i < MatrixTable.length; i++){
        let classroom = MatrixTable[i][5];
        let numberofStudents = MatrixTable[i][1];
        for(j=1; j < classroomsSpecs.length; j++){
            if(classroom == classroomsSpecs[j][1]){
                MatrixTable[i][6] = classroomsSpecs[j][2] - numberofStudents;
            }
        }
    }
}

function checkSobrelotation(){
    let sobrelotation = new Boolean(false);
        for(i = 1; i < MatrixTable.length; i++){
            let classroom = MatrixTable[i][5];
            let numberofStudents = MatrixTable[i][1];
            for(j=1; j < classroomsSpecs.length; j++){
                if(classroom == classroomsSpecs[j][1]){
                    if(numberofStudents > classroomsSpecs[j][2]){
                        sobrelotation = true;
                    }
                }
            }
        }
        return sobrelotation;
}