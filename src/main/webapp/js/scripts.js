
// ---------------- Global Varables -------------------------------


// -------------------------------------- CSV RELATED --------------------------------------


// ---------------- CSV Input ----------------

// Adicione um evento de mudança para o dropdown menu
const importTypeDropdownSchedule = document.getElementById("csv-import-schedule");
const csvFileInputSchedule = document.getElementById("csv-file-schedule");
const csvUrlInputSchedule = document.getElementById("csv-url-schedule");
let scheduleData = '';


const importTypeDropdownClassroom = document.getElementById("csv-import-classroom");
const csvFileInputClassroom = document.getElementById("csv-file-classroom");
const csvUrlInputClassroom = document.getElementById("csv-url-classroom");
let classroomData = '';

const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));
const classroomModal = new bootstrap.Modal(document.getElementById('classroomModal'));
const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));

// Define the event handler function
/**
 * Handles the change event of the import type dropdown menu.
 * Shows or hides input fields based on the user's choice.
 */
function handleImportTypeChange() {


    const selectedOptionSchedule = importTypeDropdownSchedule.value;
    const selectedOptionClassroom = importTypeDropdownClassroom.value

    // Exibir ou ocultar os campos apropriados com base na escolha do usuário
    if (selectedOptionSchedule === "file" || selectedOptionClassroom === "file") {
        csvFileInputSchedule.style.display = "block";
        csvUrlInputSchedule.style.display = "none";

        csvFileInputClassroom.style.display = "block";
        csvUrlInputClassroom.style.display = "none";
    } else if (selectedOptionSchedule === "url" || selectedOptionClassroom === "url") {
        csvFileInputSchedule.style.display = "none";
        csvUrlInputSchedule.style.display = "block";

        csvFileInputClassroom.style.display = "none";
        csvUrlInputClassroom.style.display = "block";
    }
}

window.addEventListener("load", handleImportTypeChange);

importTypeDropdownSchedule.addEventListener("change", handleImportTypeChange);

importTypeDropdownClassroom.addEventListener("change", handleImportTypeChange);



// Lógica para processar o envio do formulário

const csvFormSchedule = document.getElementById("schedule-form-js");
const csvFormClassroom = document.getElementById("classroom-form-js");



csvFormSchedule.addEventListener("submit", function (event) {
    event.preventDefault();

    if (importTypeDropdownSchedule.value === "file" && csvFileInputSchedule.files.length > 0) {
        loadAndParseCSV(csvFileInputSchedule.files[0], false)
            .then(data => {
                scheduleData = data;
                scheduleModal.hide();
                classroomModal.show();
            })
            .catch(error => {
                console.error(error);
            });
    } else if (importTypeDropdownSchedule.value === "url" && csvUrlInputClassroom.value) {
        loadAndParseCSV(csvUrlInputClassroom.value, true)
            .then(data => {
                scheduleData = data;
                scheduleModal.hide();
                classroomModal.show();
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        console.log("Nenhum arquivo selecionado ou URL inserido");
        scheduleModal.hide();
        classroomModal.hide();
        errorModal.show();
    }
});

csvFormClassroom.addEventListener("submit", function (event) {
    event.preventDefault();

    if (importTypeDropdownClassroom.value === "file" && csvFileInputClassroom.files.length > 0) {
        loadAndParseCSV(csvFileInputClassroom.files[0], false)
            .then(data => {
                classroomData = data;
                createTabulatorTable(scheduleData);
                resetForm(); // Reset the form after successful file processing
            })
            .catch(error => {
                console.error(error);
            });
    } else if (importTypeDropdownClassroom.value === "url" && csvUrlInputClassroom.value) {
        loadAndParseCSV(csvUrlInputClassroom.value, true)
            .then(data => {
                classroomData = data;
                createTabulatorTable(scheduleData);
                resetForm(); // Reset the form after successful URL processing
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        console.log("Nenhum arquivo selecionado ou URL inserido");
        errorModal.toggle();
    }
});

// Function to reset the form
function resetForm() {
    csvFormSchedule.reset();
    csvFormClassroom.reset();
}


// ---------------- CSV Processing ----------------


/**
 * The parsed data variable corresponds to a matrix which holds the data that is loaded from a csv file or URL.
 * @type {Matrix<String>}
 */
let parsedData;

/**
 * The delimiter is used to specify the delimiter used in the CSV file.
 * @type {string}
 */
var delimiter = ';';



/**
 * Sets the delimiter used for parsing the CSV data.
 *
 * @param {string} s - The delimiter character.
 */
function setDelimiter(s) {
    delimiter = s;
}


/**
 * Loads and parses CSV data from either a file or a URL.
 *
 * @param {File|string} fileData - The CSV file or URL to be loaded and parsed.
 * @param {boolean} isURL - Indicates whether the input is a URL (true) or a file (false).
 * @returns {Promise<Array>} A promise that resolves with the parsed CSV data or rejects with an error message.
 */
function loadAndParseCSV(fileData, isURL) {
    return new Promise((resolve, reject) => {
        parsedData = null;
        if (isURL) {
            // Se for uma URL, faça uma solicitação para obter o conteúdo do CSV
            fetch(fileData)
                .then(response => response.text())
                .then(csvData => {
                    // To define the tabulator table content
                    const data = Papa.parse(csvData, { header: true, skipEmptyLines: true });
                    if (data.errors.length === 0) {
                        resolve(data.data);
                    } else {
                        reject("Erro ao analisar o arquivo CSV.");
                    }

                    // To define the schedule table content
                    parsedData = parse(csvData);

                })
                .catch(error => console.error(error));
        } else if (fileData instanceof File) {
            // Se for um arquivo local, leia o conteúdo e processe diretamente
            const reader = new FileReader();
            reader.onload = function (e) {
                // To define the tabulator table content
                const csvContent = e.target.result;
                const data = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
                if (data.errors.length === 0) {
                    resolve(data.data);
                } else {
                    reject("Erro ao analisar o arquivo CSV.");
                }

                // To define the schedule table content
                parsedData = parse(csvContent);

            };
            reader.readAsText(fileData);
        }
    });
}


function parse(data) {
    const dataList = [];
    let maximumNumberOfFields = 0;

    const lines = data.split('\n');
    lines.forEach((line) => {
        const fields = line.split(delimiter);
        maximumNumberOfFields = Math.max(maximumNumberOfFields, fields.length);
        dataList.push(fields);
    });

    const totalNumberOfLines = dataList.length;
    const result = new Array(totalNumberOfLines);
    for (let i = 0; i < totalNumberOfLines; i++) {
        result[i] = new Array(maximumNumberOfFields);
        const fields = dataList[i];
        for (let j = 0; j < fields.length; j++) {
            result[i][j] = fields[j];
        }
    }

    return { totalNumberOfLines, maximumNumberOfFields, data: result };
}




// -------------------------- TABULATOR --------------------------


// Defines the waiting table
var table = new Tabulator("#example-table", {
    layout:"fitColumns",
    autoColumns:true,
    placeholder:"Pronto para receber os dados. Importe o ficheiro CSV",
})

/**
 * Creates a Tabulator table and populates it with data from a CSV file.
 *
 * @param {Array} data - An array of data to populate the Tabulator table.
 */
function createTabulatorTable(data) {

    table = new Tabulator("#example-table", {
        data: data,
        delimiter: ";",
        columns: Object.keys(data[0]).map(key => ({
            title: key,
            field: key,
        })),
        layout:"fitColumns",      //fit columns to width of table
        responsiveLayout:"hide",  //hide columns that don't fit on the table
        addRowPos:"top",          //when adding a new row, add it to the top of the table
        history:true,             //allow undo and redo actions on the table
        pagination:"local",       //paginate the data
        paginationSize:8,         //allow 7 rows per page of data
        paginationCounter:"rows", //display count of paginated rows in footer
        movableColumns:true,      //allow column order to be changed
        initialSort:[             //set the initial sort order of the data
            {column:"name", dir:"asc"},
        ],
        columnDefaults:{
            tooltip:true,         //show tool tips on cells
        },
    });
}




// -------------------------- Auxiliary Functions --------------------------



//Prints to HTML footer the current year
document.getElementById("year").innerHTML = new Date().getFullYear();

