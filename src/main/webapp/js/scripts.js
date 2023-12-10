// ---------------- CSV Input ----------------

// Adicione um evento de mudança para o dropdown menu
const importTypeDropdownSchedule = document.getElementById("csv-import-schedule");
const csvFileInputSchedule = document.getElementById("csv-file-schedule");
const csvUrlInputSchedule = document.getElementById("csv-url-schedule");
let scheduleData = [];


const importTypeDropdownClassroom = document.getElementById("csv-import-classroom");
const csvFileInputClassroom = document.getElementById("csv-file-classroom");
const csvUrlInputClassroom = document.getElementById("csv-url-classroom");
let classroomData = [];

const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));
const classroomModal = new bootstrap.Modal(document.getElementById('classroomModal'));
const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));

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

csvFormClassroom.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log(importTypeDropdownClassroom.value);
    console.log(csvUrlInputClassroom.value);



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

// Function to reset the form
function resetForm() {
    csvFormSchedule.reset();
    csvFormClassroom.reset();
}


// ---------------- CSV Processing ----------------


/**
 * The parsed data variable corresponds to a matrix which holds the data that is loaded from a csv file or URL.
 * @type
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

let scheduleAlreadyTouched,classroomAlreadyTouched = false;



scheduleMetadata = [];
classroomMetadata = [];

document.addEventListener('DOMContentLoaded', function() {

    if(scheduleAlreadyTouched){
        return;
    } else scheduleAlreadyTouched = true;


    // Seleciona o elemento div existente onde queres associar os elementos de filtro
    const filterContainer = document.getElementById('scheduleFilter');
    filterContainer.classList.add('container-sm', 'row', 'justify-content-center', 'align-items-center', 'mb-3');

    const filterRow = document.createElement('div');
    filterRow.classList.add('container-sm', 'row', 'justify-content-center', 'align-items-center'); // Adiciona a classe container para diminuir o tamanho dos elementos

    // Cria os elementos do filtro
    const filterField = document.createElement('select');
    filterField.id = "filter-field";
    filterField.classList.add('form-select', 'col');

    const filterType = document.createElement('select');
    filterType.id = "filter-type";
    filterType.classList.add('form-select', 'col');

    const filterValue = document.createElement('input');
    filterValue.classList.add('form-control', 'col');
    filterValue.id = "filter-value";
    filterValue.type = "text";
    filterValue.placeholder = "Valor a filtrar";

    const filterClear = document.createElement('button');
    filterClear.classList.add('btn', 'btn-secondary', 'col-1');
    filterClear.id = "filter-clear";
    filterClear.textContent = "Limpar Filtro";

    // Adiciona opções aos selects
    const fields = []
    scheduleMetadata.push(filterField);
    scheduleMetadata.push(fields);

    updateFilter(filterField,fields);

    const types = ["=", "<", "<=", ">", ">=", "!=", "like"];
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        filterType.appendChild(option);
    });

    // Adiciona os elementos ao div da linha
    filterRow.appendChild(filterField);
    filterRow.appendChild(filterType);
    filterRow.appendChild(filterValue);
    filterRow.appendChild(filterClear);

    // Adiciona a linha de filtro ao container existente
    filterContainer.appendChild(filterRow);


    // FUNCIONALIDADE DO FILTRO

    //Define variables for input elements
    var fieldEl = document.getElementById("filter-field");
    var typeEl = document.getElementById("filter-type");
    var valueEl = document.getElementById("filter-value");

    //Custom filter example
    function customFilter(data) {
        return data.car && data.rating < 3;
    }

    //Trigger setFilter function with correct parameters
    function updateTableByFilter() {

        var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
        var typeVal = typeEl.options[typeEl.selectedIndex].value;

        console.log("Valor do filtro: " + filterVal);
        console.log("Tipo do filtro: " + typeVal);

        var filter = filterVal === "function" ? customFilter : filterVal;

        if (filterVal === "function") {
            typeEl.disabled = true;
            valueEl.disabled = true;
        } else {
            typeEl.disabled = false;
            valueEl.disabled = false;
        }

        if (filterVal) {
            table.setFilter(filter, typeVal, valueEl.value);
        }
    }

    //Update filters on value change
    document.getElementById("filter-field").addEventListener("change", updateTableByFilter);
    document.getElementById("filter-type").addEventListener("change", updateTableByFilter);
    document.getElementById("filter-value").addEventListener("keyup", updateTableByFilter);

    //Clear filters on "Clear Filters" button click
    document.getElementById("filter-clear").addEventListener("click", function () {
        fieldEl.value = "";
        typeEl.value = "=";
        valueEl.value = "";

        table.clearFilter();
    });

    // Defines the waiting table
    var table = new Tabulator("#scheduleTable", {
        layout: "fitColumns",
        autoColumns: true,
        placeholder: "Pronto para receber os dados. Importe o ficheiro CSV",
    })

});

document.addEventListener('DOMContentLoaded', function() {

    if(classroomAlreadyTouched){
        return;
    } else classroomAlreadyTouched = true;

    // Seleciona o elemento div existente onde queres associar os elementos de filtro
    const filterContainer = document.getElementById('classroomFilter');
    filterContainer.classList.add('container', 'row', 'justify-content-center', 'align-items-center', 'mb-3');

    const filterRow = document.createElement('div');
    filterRow.classList.add( 'container','row', 'justify-content-center', 'align-items-center'); // Adiciona a classe container para diminuir o tamanho dos elementos

    // Cria os elementos do filtro
    const filterField = document.createElement('select');
    filterField.id = "filter-field";
    filterField.classList.add('form-select', 'col');

    const filterType = document.createElement('select');
    filterType.id = "filter-type";
    filterType.classList.add('form-select', 'col');

    const filterValue = document.createElement('input');
    filterValue.classList.add('form-control', 'col');
    filterValue.id = "filter-value";
    filterValue.type = "text";
    filterValue.placeholder = "Valor a filtrar";

    const filterClear = document.createElement('button');
    filterClear.classList.add('btn', 'btn-secondary', 'col-1');
    filterClear.id = "filter-clear";
    filterClear.textContent = "Limpar Filtro";

    // Adiciona opções aos selects
    const fields = []
    classroomMetadata.push(filterField);
    classroomMetadata.push(fields);
    updateFilter(filterField,fields);

    const types = ["=", "<", "<=", ">", ">=", "!=", "like"];
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        filterType.appendChild(option);
    });

    // Adiciona os elementos ao div da linha
    filterRow.appendChild(filterField);
    filterRow.appendChild(filterType);
    filterRow.appendChild(filterValue);
    filterRow.appendChild(filterClear);

    // Adiciona a linha de filtro ao container existente
    filterContainer.appendChild(filterRow);


    // FUNCIONALIDADE DO FILTRO

    //Define variables for input elements
    var fieldEl = document.getElementById("filter-field");
    var typeEl = document.getElementById("filter-type");
    var valueEl = document.getElementById("filter-value");

    //Custom filter example
    function customFilter(data) {
        return data.car && data.rating < 3;
    }

    //Trigger setFilter function with correct parameters
    function updateTableByFilter() {

        var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
        var typeVal = typeEl.options[typeEl.selectedIndex].value;

        console.log("Valor do filtro: " + filterVal);
        console.log("Tipo do filtro: " + typeVal);

        var filter = filterVal === "function" ? customFilter : filterVal;

        if (filterVal === "function") {
            typeEl.disabled = true;
            valueEl.disabled = true;
        } else {
            typeEl.disabled = false;
            valueEl.disabled = false;
        }

        if (filterVal) {
            table.setFilter(filter, typeVal, valueEl.value);
        }
    }

    //Update filters on value change
    document.getElementById("filter-field").addEventListener("change", updateTableByFilter);
    document.getElementById("filter-field").addEventListener("change", function () {
    });
    document.getElementById("filter-type").addEventListener("change", updateTableByFilter);
    document.getElementById("filter-value").addEventListener("keyup", updateTableByFilter);

    //Clear filters on "Clear Filters" button click
    document.getElementById("filter-clear").addEventListener("click", function () {
        fieldEl.value = "";
        typeEl.value = "=";
        valueEl.value = "";

        table.clearFilter();
    });

    // Defines the waiting table
    var table = new Tabulator("#classroomTable", {
        layout: "fitColumns",
        autoColumns: true,
        placeholder: "Pronto para receber os dados. Importe o ficheiro CSV",
    })


});

document.addEventListener("DOMContentLoaded", function () {
    // Defines the waiting table
    var table = new Tabulator("#metricsTable", {
        layout: "fitColumns",
        autoColumns: true,
        placeholder: "Pronto para receber os dados. Importe o ficheiro CSV",
    })
})

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
 */
function createTabulatorTable(data,metadata,type) {

    if (type === "schedule") {
        table = new Tabulator("#scheduleTable", {
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
        table = new Tabulator("#classroomTable", {
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
        table = new Tabulator("#metricsTable", {
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

    //Calculo de sobrelotação




// -------------------------- Auxiliary Functions --------------------------


//Prints to HTML footer the current year
    document.getElementById("year").innerHTML = new Date().getFullYear();
}
module.exports = { loadAndParseCSV, parse };