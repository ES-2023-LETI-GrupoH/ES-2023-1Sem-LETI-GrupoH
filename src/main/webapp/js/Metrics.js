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


function addColumntoWorkingMatrix(number,matrix) {
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
                chosenColumn = workingData[currentLine].shift().trim();
                return chosenColumn;
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

//Setting required columns. Later on, this will allow us to easily set columns when the file is in a different structure.
/**
 * In these variables, we'll store all the necessary columns and the new information.
 * @type {List<String>}
 * */
let UC ; //Column 1 (starting from zero)
let Turno;//Column 2
let NumberofStudents; //Column 4
let StartingHour; //Column 6
let EndingHour; //Column 7
let classDate; //Column 8
let classroomType; //Column 9
let classroom; //Column 10

function LoadClasses(){
    next = 0;
    classesMatrix[0][next] = addColumntoWorkingMatrix(2,parsedData);
    next++;
    classesMatrix[0][next] = addColumntoWorkingMatrix(5,parsedData);
    next++;
    classesMatrix[0][next] = addColumntoWorkingMatrix(7,parsedData);
    next++;
    classesMatrix[0][next] = addColumntoWorkingMatrix(8,parsedData);
    next++;
    classesMatrix[0][next] = addColumntoWorkingMatrix(9,parsedData);
    next++;
    classesMatrix[0][next] = addColumntoWorkingMatrix(11,parsedData);
    next++;
}

function imprimirMatriz(matriz) {
    for (let i = 0; i < matriz.length; i++) {
        let linha = "";
        for (let j = 0; j < matriz[i].length; j++) {
            linha += matriz[i][j] + "\t";
        }
        console.log(linha);
    }
}

function test() {
    LoadClasses();
    imprimirMatriz(classesMatrix);
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