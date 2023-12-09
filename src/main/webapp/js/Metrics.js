/**
 * In this variable, we'll store all the necessary columns and the new information.
 * @type {Matrix<String>}
 */
let classesMatrix = [];

/**
 * In this variable, we'll preload all the information from the classrooms.
 * @type {Matrix<String>}
 */
let classroomsSpecs = loadAndParseCSV("/src/main/webapp/files/CaracterizaçãoDasSalas.csv");

function init(){
    for (let i = 0; i < parsedData.value().length; i++) {
        classesMatrix[i] = [];

        // Initialize each element in the row to zero
        for (let j = 0; j < parsedData.value()[0].length; j++) {
            classesMatrix[i][j] = 0;
        }
    }
}


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
    classesMatrix[0][next] = chooseColumn(2);
    next++;
    classesMatrix[0][next] = chooseColumn(5);
    next++;
    classesMatrix[0][next] = chooseColumn(7);
    next++;
    classesMatrix[0][next] = chooseColumn(8);
    next++;
    classesMatrix[0][next] = chooseColumn(9);
    next++;
    classesMatrix[0][next] = chooseColumn(11);
    next++;
}

function checkNumberOfStudents(){
    for(i = 1; i < classesMatrix.length; i++){
        let classroom = classesMatrix[i][5];
        let numberofStudents = classesMatrix[i][1];
        for(j=1; j < classroomsSpecs.length; j++){
            if(classroom == classroomsSpecs[j][1]){
                classesMatrix[i][6] = classroomsSpecs[j][2] - numberofStudents;
            }
        }
    }
}

function checkSobrelotation(){
    let nAulasEmSobr = 0;
        for(i = 1; i < classesMatrix.length; i++){
            let sobrelotation = Boolean(false);
            let classroom = classesMatrix[i][5];
            let numberofStudents = classesMatrix[i][1];
            for(j=1; j < classroomsSpecs.length; j++){
                if(classroom == classroomsSpecs[j][1]){
                    if(numberofStudents > classroomsSpecs[j][2]){
                        sobrelotation = true;
                            nAulasEmSobr ++;
                    }
                }
            }
           classesMatrix[i][7] = sobrelotation;
        }
    return nAulasEmSobr;
}

function numberOfClassesWtClassroom () {
    let nAulasSemSala = 0;
        for(i = 1; i < classesMatrix.length; i++){
            let classRoom = classesMatrix[i][5]
                if( classRoom == NULL){
                   nAulasSemSala ++;
            }
        }
    return nAulasSemSala;
}