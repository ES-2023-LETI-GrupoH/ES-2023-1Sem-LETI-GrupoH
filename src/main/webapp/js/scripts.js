
// ---------------- Global Varables -------------------------------
/**
 * The 'startDate' is the reference point for the start of the current week during week navigation.
 * It is updated as weeks are navigated, and its initial value is based on 'startDate'.
 * @type {Date}
 */
let startDate;

/**
 * The 'lastDate' represents the final date of the data range and helps limit week navigation to stay within the dataset.
 * @type {Date}
 */
let lastDate;

/**
 * The 'WeekStart' is the reference point for the start of the current week during week navigation.
 * It is updated as weeks are navigated, and its initial value is based on 'startDate'.
 * @type {Date}
 */
let WeekStart;


// -------------------------------------- CSV RELATED --------------------------------------


// ---------------- CSV Input ----------------

// Adicione um evento de mudança para o dropdown menu
const importTypeDropdown = document.getElementById("csv-import");
const csvFileInput = document.getElementById("csv-file");
const csvUrlInput = document.getElementById("csv-url");
const csvDataDisplay = document.getElementById("csv-data");
const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));

// Define the event handler function
/**
 * Handles the change event of the import type dropdown menu.
 * Shows or hides input fields based on the user's choice.
 */
function handleImportTypeChange() {

    const selectedOption = importTypeDropdown.value;

    // Exibir ou ocultar os campos apropriados com base na escolha do usuário
    if (selectedOption === "file") {
        csvFileInput.style.display = "block";
        csvUrlInput.style.display = "none";
    } else if (selectedOption === "url") {
        csvFileInput.style.display = "none";
        csvUrlInput.style.display = "block";
    } else {
        // Lógica de tratamento adicional, se necessário
    }
}

window.addEventListener("load", handleImportTypeChange);

importTypeDropdown.addEventListener("change", handleImportTypeChange);



// Lógica para processar o envio do formulário

const csvForm = document.getElementById("csv-form-js");


csvForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (importTypeDropdown.value === "file" && csvFileInput.files.length > 0) {
        loadAndParseCSV(csvFileInput.files[0], false)
            .then(data => {
                createTabulatorTable(data);
                resetForm(); // Reset the form after successful file processing
            })
            .catch(error => {
                console.error(error);
            });
    } else if (importTypeDropdown.value === "url" && csvUrlInput.value) {
        loadAndParseCSV(csvUrlInput.value, true)
            .then(data => {
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
    csvForm.reset();
}


// ---------------- CSV Processing ----------------


/**
 * The parsed data variable corresponds to a matrix which holds the data that is loaded from a csv file or URL.
 * @type
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
                //assignEvent(3,4, formatDate(startDate)); // Rewrite the table content
                //assignEvent(3,5, formatDate(lastDate)); // Rewrite the table content
                //print(parsedData);
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

    return result;
}


// -------------------------- TABULATOR --------------------------


// CRIAÇÂO DO FILTRO HTML

// Seleciona o elemento div existente onde queres associar os elementos de filtro
const filterContainer = document.getElementById('filter');
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
updateFilter();

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
function customFilter(data){
    return data.car && data.rating < 3;
}

//Trigger setFilter function with correct parameters
function updateTableByFilter(){

    var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
    var typeVal = typeEl.options[typeEl.selectedIndex].value;

    console.log("Valor do filtro: " + filterVal);
    console.log("Tipo do filtro: " + typeVal);

    var filter = filterVal === "function" ? customFilter : filterVal;

    if(filterVal === "function" ){
        typeEl.disabled = true;
        valueEl.disabled = true;
    }else{
        typeEl.disabled = false;
        valueEl.disabled = false;
    }

    if(filterVal){
        table.setFilter(filter,typeVal, valueEl.value);
    }
}

//Update filters on value change
document.getElementById("filter-field").addEventListener("change", updateTableByFilter);
document.getElementById("filter-field").addEventListener("change", function(){
});
document.getElementById("filter-type").addEventListener("change", updateTableByFilter);
document.getElementById("filter-value").addEventListener("keyup", updateTableByFilter);

//Clear filters on "Clear Filters" button click
document.getElementById("filter-clear").addEventListener("click", function(){
    fieldEl.value = "";
    typeEl.value = "=";
    valueEl.value = "";

    table.clearFilter();
});

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
            //headerFilter: "input", // Adiciona filtro de cabeçalho para todas as colunas
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
    updateFilter();
}

function updateFilter() {

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


// -------------------------- Auxiliary Functions --------------------------

// This function sets any date in the format DD/MM/YYYY

/**
 * Formats a given date in the "DD/MM/YYYY" format.
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} The formatted date string.
 */
function formatDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1; // Os meses são indexados a partir de 0 em JavaScript
    var year = date.getFullYear();

    // Adicione um zero à frente se o dia ou o mês for menor que 10
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    return day + '/' + month + '/' + year;
}

/**
 * Extracts the start and last dates from the parsed CSV data and sets them in global variables.
 *
 * @param {Matrix<String>} data - The parsed CSV data.
 * @returns {{WeekStart: Date, startDate: Date, lastDate: Date}} The start date.
 * @returns {Date} The last date.
 * @returns {Date} The week start date.
 */
function getStartAndLastDate(data) {
    if (data !== null) {
        let csvFirstDate = new Date(); // Inicializa com a data atual
        let csvLastDate = new Date(0); // Inicializa com a data mínima

        for (let i = 0; i < data.totalNumberOfLines; i++) {
            // Obtenha a data da 8ª coluna do CSV e divida-a em dia, mês e ano
            let [day, month, year] = data.data[i][8].split("/").map(Number);

            // Crie um objeto Date com base nos valores do CSV
            let currentDate = new Date(year, month - 1, day);

            if (currentDate < csvFirstDate) {
                csvFirstDate = currentDate;
            }
            if (currentDate > csvLastDate) {
                csvLastDate = currentDate;
            }
        }

        let startDate = new Date(csvFirstDate);
        let lastDate = new Date(csvLastDate);
        let WeekStart = new Date(csvFirstDate);

        return { startDate, lastDate, WeekStart };
    }

    return { startDate: null, lastDate: null, WeekStart: null };

}

//Prints to HTML footer the current year
document.getElementById("year").innerHTML = new Date().getFullYear();