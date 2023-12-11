// ---------------- CSV Input ----------------

// Adicione um evento de mudança para o dropdown menu

/**
 * Represents the dropdown element for selecting import type for schedule.
 * @type {HTMLSelectElement}
 */
const importTypeDropdownSchedule = document.getElementById("csv-import-schedule");

/**
 * Represents the file input element for uploading CSV for schedule.
 * @type {HTMLInputElement}
 */
const csvFileInputSchedule = document.getElementById("csv-file-schedule");

/**
 * Represents the URL input element for importing CSV for schedule.
 * @type {HTMLInputElement}
 */
const csvUrlInputSchedule = document.getElementById("csv-url-schedule");

/**
 * Array to store schedule data.
 * @type {Array}
 */
let scheduleData = [];

/**
 * Represents the dropdown element for selecting import type for classroom.
 * @type {HTMLSelectElement}
 */
const importTypeDropdownClassroom = document.getElementById("csv-import-classroom");

/**
 * Represents the file input element for uploading CSV for classroom.
 * @type {HTMLInputElement}
 */
const csvFileInputClassroom = document.getElementById("csv-file-classroom");
/**
 * Represents the URL input element for importing CSV for classroom.
 * @type {HTMLInputElement}
 */
const csvUrlInputClassroom = document.getElementById("csv-url-classroom");
/**
 * Array to store classroom data.
 * @type {Array}
 */
let classroomData = [];

/**
 * Bootstrap modal for the schedule.
 * @type {bootstrap.Modal}
 */
const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));
/**
 * Bootstrap modal for the classroom.
 * @type {bootstrap.Modal}
 */
const classroomModal = new bootstrap.Modal(document.getElementById('classroomModal'));
/**
 * Bootstrap modal for errors.
 * @type {bootstrap.Modal}
 */
const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
/**
 * Flag to track if schedule is uploaded.
 * @type {boolean}
 */
let isScheduleUploaded = false;

// Define the event handler function
/**
 * Handles the change event of the import type dropdown menu.
 * Shows or hides input fields based on the user's choice.
 */
function handleImportTypeChange() {
    const selectedOptionSchedule = importTypeDropdownSchedule.value;
    const selectedOptionClassroom = importTypeDropdownClassroom.value

    csvFileInputClassroom.style.display = "block";
    csvUrlInputClassroom.style.display = "none";

    // Exibir ou ocultar os campos apropriados com base na escolha do usuário
    if (selectedOptionSchedule === "file" && isScheduleUploaded === false) {
        csvFileInputSchedule.style.display = "block";
        csvUrlInputSchedule.style.display = "none";
    } else if(selectedOptionClassroom === "file" && isScheduleUploaded === true){
        csvFileInputClassroom.style.display = "block";
        csvUrlInputClassroom.style.display = "none";
    } else if (selectedOptionSchedule === "url"  && isScheduleUploaded === false) {
        csvFileInputSchedule.style.display = "none";
        csvUrlInputSchedule.style.display = "block";
    } else if (selectedOptionClassroom === "url" && isScheduleUploaded === true){
        csvFileInputClassroom.style.display = "none";
        csvUrlInputClassroom.style.display = "block";
    }
}

// Trigger handleImportTypeChange on page load
window.addEventListener("load", handleImportTypeChange);

// Add event listeners for import type dropdown changes
importTypeDropdownSchedule.addEventListener("change", handleImportTypeChange);
importTypeDropdownClassroom.addEventListener("change", handleImportTypeChange);



// Lógica para processar o envio do formulário

const csvFormSchedule = document.getElementById("schedule-form-js");
const csvFormClassroom = document.getElementById("classroom-form-js");


/**
 * Handles the form submission for schedule CSV.
 * @param {Event} event - The form submission event.
 */
csvFormSchedule.addEventListener("submit", function (event) {
    event.preventDefault();
    if (importTypeDropdownSchedule.value === "file" && csvFileInputSchedule.files.length > 0) {
        loadAndParseCSV(csvFileInputSchedule.files[0], false)
            .then(data => {
                createTabulatorTable(data,scheduleMetadata,'schedule');
                scheduleModal.hide();
                classroomModal.show();
                isScheduleUploaded = true;
            })
            .catch(error => {
                console.error(error);
            });
    } else if (importTypeDropdownSchedule.value === "url" && csvUrlInputSchedule.value) {
        loadAndParseCSV(csvUrlInputSchedule.value, true)
            .then(data => {
                //scheduleData = data;
                createTabulatorTable(data,scheduleMetadata,'schedule');
                scheduleModal.hide();
                classroomModal.show();
                isScheduleUploaded = true;
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        console.log("Nenhum arquivo selecionado ou URL inserido");
        isScheduleUploaded = false;
        scheduleModal.hide();
        classroomModal.hide();
        errorModal.show();
    }
});

/**
 * Handles the form submission for classroom CSV.
 * @param {Event} event - The form submission event.
 */
csvFormClassroom.addEventListener("submit", function (event) {
    event.preventDefault();
    if (importTypeDropdownClassroom.value === "file" && csvFileInputClassroom.files.length > 0) {
        loadAndParseCSV(csvFileInputClassroom.files[0], false)
            .then(data => {
                createTabulatorTable(data,classroomMetadata,'classroom');
                createTabulatorTable(data);
                resetForm(); // Reset the form after successful file processing
            })
            .catch(error => {
                console.error(error);
            });
    } else if (importTypeDropdownClassroom.value === "url" && csvUrlInputClassroom.value) {
        loadAndParseCSV(csvUrlInputClassroom.value, true)
            .then(data => {
                createTabulatorTable(data,classroomMetadata,'classroom')
                createTabulatorTable(data);
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

/**
 * Resets the schedule and classroom forms.
 */
function resetForm() {
    csvFormSchedule.reset();
    csvFormClassroom.reset();
}


// ---------------- CSV Processing ----------------


/**
 * The parsed data variable corresponds to a matrix which holds the data that is loaded from a csv file or URL.
 * @type {Array}
 */
let parsedData;

/**
 * The usedDelimiter is used to specify the delimiter used in the CSV file.
 * @type {string}
 */
var usedDelimiter = ';';



/**
 * Loads and parses CSV data from either a file or a URL.
 *
 * @param {File|string} fileData - The CSV file or URL to be loaded and parsed.
 * @param {boolean} isURL - Indicates whether the input is a URL (true) or a file (false).
 * @returns {Promise<Array>} A promise that resolves with the parsed CSV data or rejects with an error message.
 */
function loadAndParseCSV(fileData, isURL) {
    return new Promise((resolve, reject) => {
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

/**
 * Parses the given data into a two-dimensional array, splitting lines and fields.
 *
 * @param {string} data - The input data to be parsed.
 * @returns {Array<Array<string>>} - A two-dimensional array representing the parsed data.
 */
function parse(data) {
    const dataList = [];
    let maximumNumberOfFields = 0;

    const lines = data.split('\n');
    lines.forEach((line) => {
        const fields = line.split(usedDelimiter);
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

    return result;
}


// -------------------------- TABULATOR --------------------------


// CRIAÇÂO DO FILTRO HTML

/**
     * Flag to track if schedule table initialization has already been touched.
     * @type {boolean}
     */
let scheduleAlreadyTouched = false;

 /**
     * Flag to track if classroom table initialization has already been touched.
     * @type {boolean}
     */
let classroomAlreadyTouched = false;


/**
 * Metadata array to store filter field and its options for the schedule table.
 * @type {Array}
 */
scheduleMetadata = [];

/**
 * Metadata array to store filter field and its options for the classroom table.
 * @type {Array}
 */
classroomMetadata = [];


document.addEventListener('DOMContentLoaded', function() {

    if(scheduleAlreadyTouched){
        return;
    } else scheduleAlreadyTouched = true;






});

document.addEventListener('DOMContentLoaded', function() {

    if(classroomAlreadyTouched){
        return;
    } else classroomAlreadyTouched = true;





});

// Seleciona o elemento div existente onde queres associar os elementos de filtro
const filterContainerSchedule = document.getElementById('scheduleFilter');
filterContainerSchedule.classList.add('container-sm', 'row', 'justify-content-center', 'align-items-center', 'mb-3');

const filterRowSchedule = document.createElement('div');
filterRowSchedule.classList.add('container-sm', 'row', 'justify-content-center', 'align-items-center'); // Adiciona a classe container para diminuir o tamanho dos elementos

// Cria os elementos do filtro
const filterFieldSchedule = document.createElement('select');
filterFieldSchedule.id = "filter-field-schedule";
filterFieldSchedule.classList.add('form-select', 'col');

const filterTypeSchedule = document.createElement('select');
filterTypeSchedule.id = "filter-type-schedule";
filterTypeSchedule.classList.add('form-select', 'col');

const filterValueSchedule = document.createElement('input');
filterValueSchedule.classList.add('form-control', 'col');
filterValueSchedule.id = "filter-value-schedule";
filterValueSchedule.type = "text";
filterValueSchedule.placeholder = "Valor a filtrar";

const filterClearSchedule = document.createElement('button');
filterClearSchedule.classList.add('btn', 'btn-secondary', 'col-1');
filterClearSchedule.id = "filter-clear-schedule";
filterClearSchedule.textContent = "Limpar Filtro";

// Adiciona opções aos selects
const fieldsSchedule = []
scheduleMetadata.push(filterFieldSchedule);
scheduleMetadata.push(fieldsSchedule);

updateFilter(filterFieldSchedule,fieldsSchedule);

const types = ["=", "<", "<=", ">", ">=", "!=", "like"];
types.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    filterTypeSchedule.appendChild(option);
});

// Adiciona os elementos ao div da linha
filterRowSchedule.appendChild(filterFieldSchedule);
filterRowSchedule.appendChild(filterTypeSchedule);
filterRowSchedule.appendChild(filterValueSchedule);
filterRowSchedule.appendChild(filterClearSchedule);

// Adiciona a linha de filtro ao container existente
filterContainerSchedule.appendChild(filterRowSchedule);


// Defines the waiting table
var scheduleTable = new Tabulator("#scheduleTable", {
    layout: "fitColumns",
    autoColumns: true,
    placeholder: "Pronto para receber os dados. Importe o ficheiro CSV",
})


// FUNCIONALIDADE DO FILTRO

//Define variables for input elements
var fieldElSchedule = document.getElementById("filter-field-schedule");
var typeElSchedule = document.getElementById("filter-type-schedule");
var valueElSchedule = document.getElementById("filter-value-schedule");


//Trigger setFilter function with correct parameters
function updateTableByFilterSchedule() {

    var filterVal = fieldElSchedule.options[fieldElSchedule.selectedIndex].value;
    var typeVal = typeElSchedule.options[typeElSchedule.selectedIndex].value;

    //console.log("Valor do filtro: " + filterVal);
    //console.log("Tipo do filtro: " + typeVal);

    var filter = filterVal === "function" ? customFilter : filterVal;

    if (filterVal === "function") {
        typeElSchedule.disabled = true;
        valueElSchedule.disabled = true;
    } else {
        typeElSchedule.disabled = false;
        valueElSchedule.disabled = false;
    }

    if (filterVal) {
        classroomTable.setFilter(filter, typeVal, valueElSchedule.value);
    }
}


    //Update filters on value change
    document.getElementById("filter-field-schedule").addEventListener("change", updateTableByFilterSchedule);
    document.getElementById("filter-field-schedule").addEventListener("change", function () {
    });
    document.getElementById("filter-type-schedule").addEventListener("change", updateTableByFilterSchedule);
    document.getElementById("filter-value-schedule").addEventListener("keyup", updateTableByFilterSchedule);

    //Clear filters on "Clear Filters" button click
    document.getElementById("filter-clear-schedule").addEventListener("click", function () {
        fieldElSchedule.value = "";
        typeElSchedule.value = "=";
        valueElSchedule.value = "";

        classroomTable.clearFilter();
    });









// Seleciona o elemento div existente onde queres associar os elementos de filtro
const filterContainerClassroom = document.getElementById('classroomFilter');
filterContainerClassroom.classList.add('container', 'row', 'justify-content-center', 'align-items-center', 'mb-3');

const filterRowClassroom = document.createElement('div');
filterRowClassroom.classList.add( 'container','row', 'justify-content-center', 'align-items-center'); // Adiciona a classe container para diminuir o tamanho dos elementos

// Cria os elementos do filtro
const filterFieldClassroom = document.createElement('select');
filterFieldClassroom.id = "filter-field-classroom";
filterFieldClassroom.classList.add('form-select', 'col');

const filterTypeClassroom = document.createElement('select');
filterTypeClassroom.id = "filter-type-classroom";
filterTypeClassroom.classList.add('form-select', 'col');

const filterValueClassroom = document.createElement('input');
filterValueClassroom.classList.add('form-control', 'col');
filterValueClassroom.id = "filter-value-classroom";
filterValueClassroom.type = "text";
filterValueClassroom.placeholder = "Valor a filtrar";

const filterClearClassroom = document.createElement('button');
filterClearClassroom.classList.add('btn', 'btn-secondary', 'col-1');
filterClearClassroom.id = "filter-clear-classroom";
filterClearClassroom.textContent = "Limpar Filtro";

// Adiciona opções aos selects
const fieldsClassroom = []
classroomMetadata.push(filterFieldClassroom);
classroomMetadata.push(fieldsClassroom);
updateFilter(filterFieldClassroom,fieldsClassroom);


types.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    filterTypeClassroom.appendChild(option);
});

// Adiciona os elementos ao div da linha
filterRowClassroom.appendChild(filterFieldClassroom);
filterRowClassroom.appendChild(filterTypeClassroom);
filterRowClassroom.appendChild(filterValueClassroom);
filterRowClassroom.appendChild(filterClearClassroom);

// Adiciona a linha de filtro ao container existente
filterContainerClassroom.appendChild(filterRowClassroom);

// FUNCIONALIDADE DO FILTRO

//Define variables for input elements
var fieldElClassroom = document.getElementById("filter-field-classroom");
var typeElClassroom = document.getElementById("filter-type-classroom");
var valueElClassroom = document.getElementById("filter-value-classroom");

//Custom filter example
function customFilter(data) {
    return data.car && data.rating < 3;
}

//Trigger setFilter function with correct parameters
function updateTableByFilterClassroom() {

    var filterVal = fieldElClassroom.options[fieldElClassroom.selectedIndex].value;
    var typeVal = typeElClassroom.options[typeElClassroom.selectedIndex].value;

    var filter = filterVal === "function" ? customFilter : filterVal;

    if (filterVal === "function") {
        typeElClassroom.disabled = true;
        valueElClassroom.disabled = true;
    } else {
        typeElClassroom.disabled = false;
        valueElClassroom.disabled = false;
    }

    if (filterVal) {
        classroomTable.setFilter(filter, typeVal, valueElClassroom.value);
    }
}

//Update filters on value change
document.getElementById("filter-field-classroom").addEventListener("change", updateTableByFilterClassroom);
document.getElementById("filter-field-classroom").addEventListener("change", function () {
});
document.getElementById("filter-type-classroom").addEventListener("change", updateTableByFilterClassroom);
document.getElementById("filter-value-classroom").addEventListener("keyup", updateTableByFilterClassroom);

//Clear filters on "Clear Filters" button click
document.getElementById("filter-clear-classroom").addEventListener("click", function () {
    fieldElClassroom.value = "";
    typeElClassroom.value = "=";
    valueElClassroom.value = "";

    classroomTable.clearFilter();
});

// Defines the waiting table
var classroomTable = new Tabulator("#classroomTable", {
    layout: "fitColumns",
    autoColumns: true,
    placeholder: "Pronto para receber os dados. Importe o ficheiro CSV",
})



document.addEventListener("DOMContentLoaded", function () {
    // Defines the waiting table
    var metricsTable = new Tabulator("#metricsTable", {
        layout: "fitColumns",
        autoColumns: true,
        placeholder: "Pronto para receber os dados. Importe o ficheiro CSV",
    })
})

/**
 * Updates the filter options based on the parsed data for the given filter field.
 *
 * @param {HTMLSelectElement} filterField - The filter field select element.
 * @param {Array} fields - The array to store filter options.
 */
function updateFilter(filterField,fields) {

    const currentValue = filterField.value; // Armazena o valor selecionado atualmente
    fields.length = 0; // Limpar o array fields antes de adicionar novas opções

    filterField.innerHTML = '';
    if (parsedData != null && parsedData.length > 0) {
        parsedData[0].forEach((value, index) => {
            if (value !== undefined && value !== null && value !== '') {
                fields.push(value);
            }
        });
    }
    fields.forEach(field => {
        const option = document.createElement('option');
        option.value = field;
        option.textContent = field.charAt(0).toUpperCase() + field.slice(1);
        filterField.appendChild(option);
    });
    filterField.value = currentValue; // Restaura o valor selecionado após atualizar as opções
}

/**
 * Creates a Tabulator table and populates it with data from a CSV file.
 *
 * @param {Array} data - An array of data to populate the Tabulator table.
 * @param {Array} metadata - The metadata array containing filter field and options.
 * @param {string} type - The type of table ('schedule' or 'classroom').
 */

scheduleTable = null;
classroomTable = null;
metricsTable = null;
function createTabulatorTable(data,metadata,type) {

    if (type === "schedule") {
        scheduleTable = new Tabulator("#scheduleTable", {
            data: data,
            delimiter: usedDelimiter,
            columns: Object.keys(data[0]).map(key => ({
                title: key,
                field: key,
                //headerFilter: "input", // Adiciona filtro de cabeçalho para todas as colunas
            })),
            layout: "fitColumns",      //fit columns to width of table
            responsiveLayout: "hide",  //hide columns that don't fit on the table
            addRowPos: "top",          //when adding a new row, add it to the top of the table
            history: true,             //allow undo and redo actions on the table
            pagination: "local",       //paginate the data
            paginationSize: 8,         //allow 7 rows per page of data
            paginationCounter: "rows", //display count of paginated rows in footer
            movableColumns: true,      //allow column order to be changed
            initialSort: [             //set the initial sort order of the data
                {column: "name", dir: "asc"},
            ],
            columnDefaults: {
                tooltip: true,         //show tool tips on cells
            },
        });
        updateFilter(metadata.at(0), metadata.at(1));
    } else if (type === 'classroom') {
        classroomTable = new Tabulator("#classroomTable", {
            data: data,
            delimiter: usedDelimiter,
            columns: Object.keys(data[0]).map(key => ({
                title: key,
                field: key,
                //headerFilter: "input", // Adiciona filtro de cabeçalho para todas as colunas
            })),
            layout: "fitColumns",      //fit columns to width of table
            responsiveLayout: "hide",  //hide columns that don't fit on the table
            addRowPos: "top",          //when adding a new row, add it to the top of the table
            history: true,             //allow undo and redo actions on the table
            pagination: "local",       //paginate the data
            paginationSize: 8,         //allow 7 rows per page of data
            paginationCounter: "rows", //display count of paginated rows in footer
            movableColumns: true,      //allow column order to be changed
            initialSort: [             //set the initial sort order of the data
                {column: "name", dir: "asc"},
            ],
            columnDefaults: {
                tooltip: true,         //show tool tips on cells
            },
        });
        updateFilter(metadata.at(0), metadata.at(1));
    } else {
        metricsTable = new Tabulator("#metricsTable", {
            data: data,
            columns: [
                {title: "Métrica", field: "metricLabel"},
                {title: "Valor", field: "metricValue"},
            ],
            layout: "fitColumns",      //fit columns to width of table
            responsiveLayout: "hide",  //hide columns that don't fit on the table
            addRowPos: "top",          //when adding a new row, add it to the top of the table
            history: true,             //allow undo and redo actions on the table
            pagination: "local",       //paginate the data
            paginationSize: 8,         //allow 7 rows per page of data
            paginationCounter: "rows", //display count of paginated rows in footer
            movableColumns: true,      //allow column order to be changed
            initialSort: [             //set the initial sort order of the data
                {column: "name", dir: "asc"},
            ],
            columnDefaults: {
                tooltip: true,         //show tool tips on cells
            }
        });
    }





// -------------------------- Auxiliary Functions --------------------------


//Prints to HTML footer the current year
    document.getElementById("year").innerHTML = new Date().getFullYear();
}