
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
        // Processar CSV por arquivo
        loadAndParseCSV(csvFileInput.files[0],false)
            .then(data=> {
                createTabulatorTable(data);
            })
            .catch(error => {
                console.error(error);
            })// Call a function to download CSV from the URL// Call a function to download CSV from the file

    } else if (importTypeDropdown.value === "url" && csvUrlInput.value) {
        // Processar CSV por URL
        loadAndParseCSV(csvUrlInput.value,true) // Call a function to download CSV from the URL
            .then(data=> {
                createTabulatorTable(data);
            })
            .catch(error => {
                console.error(error);
            })// Call a function to download CSV from the URL// Call a function to download CSV from the file
    } else {
        // Lógica para lidar com nenhum arquivo selecionado ou URL inserida
        console.log("Nenhum arquivo selecionado ou URL inserida");
        errorModal.toggle();
    }
});


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
                    getStartAndLastDate(parsedData);
                    //assignEvent(3,4, formatDate(startDate)); // Rewrite the table content
                    //assignEvent(3,5, formatDate(lastDate)); // Rewrite the table content
                    //print(parsedData);
                    updateWeekStatus();
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
                getStartAndLastDate(parsedData);
                //assignEvent(3,4, formatDate(startDate)); // Rewrite the table content
                //assignEvent(3,5, formatDate(lastDate)); // Rewrite the table content
                //print(parsedData);
                updateWeekStatus();
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



// ---------------- WEEK NAVIGATOR -------------------------------

/**
 * 'WeekMonday' is used to store the starting date of the current week (Monday).
 * @type {Date}
 */
let WeekMonday ;

/**
 * 'WeekSunday' is used to store the ending date of the current week (Sunday).
 * @type {Date}
 */
let WeekSunday ;


/**
 * Updates the displayed week's status based on the 'WeekStart' date.
 */
function updateWeekStatus() {
    if(parsedData == null){
        document.getElementById("week-date").textContent = "Importe um horário";
    } else {

        console.log(formatDate(WeekStart));
        WeekMonday = new Date(WeekStart);
        // Sets the start date for the nearest monday available ( monday = 1 )
        while (WeekMonday.getDay() !== 1) {
            WeekMonday.setDate(WeekMonday.getDate() - 1);
        }


        // Calculates the endDate for the week of the startingDay
        WeekSunday = new Date(WeekMonday);
        WeekSunday.setDate(WeekMonday.getDate() + 6);


        // Puts the date in the Portuguese Format
        let WeekFirstDateString = formatDate(WeekMonday);
        let WeekLastDateString = formatDate(WeekSunday);

        // Sends the week date to the HTML span which id is "week-date"
        document.getElementById("week-date").textContent = WeekFirstDateString + " - " + WeekLastDateString;
    }
}

// FIRST Week Navigation Update
updateWeekStatus();

// Previous Week functions
const previousWeekBttn = document.getElementById("previous-week");
previousWeekBttn.addEventListener("click", function () {
    if (WeekStart.getTime() > startDate.getTime()) { // Checks if is the first week
        WeekStart.setDate(WeekStart.getDate() - 7);
        updateWeekStatus();
    }
});

// Next Week functions
const nextWeekBttn = document.getElementById("next-week");
nextWeekBttn.addEventListener("click", function () {
    let nextWeekStart = new Date(WeekStart); //Temporary variable for the next week
    nextWeekStart.setDate(nextWeekStart.getDate()+7) // Predicts the next week date and stores it temporarily in the nextWeekStart var
    if (nextWeekStart < lastDate) { // Compares if the predicted date is smaller than the last date
        WeekStart.setDate(WeekStart.getDate() + 7);  //Updates the WeekStart for the next week
        updateWeekStatus();
    }
});

// Reset Week functions
const resetWeekBttn = document.getElementById("reset-week");
resetWeekBttn.addEventListener("click", function () {
    WeekStart.setTime(startDate.getTime()); // Updates the WeekStart for the first week. It needs to be GetTime() instead of GetDate()
    updateWeekStatus();                     // because if its GetDate it only updates the day and not the entire date
});


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



// -------------------------- SCHEDULE TABLE CREATION AND POPULATION ---------------------------------

// This section is reserved for further development of a schedule table based on Fenix+

/*// Select the HTML table element with the 'table' tag and assign it to the 'table' variable.
const table = document.querySelector('tbody');

// Loop to create time intervals between 8:00 (8 AM) and 23:00 (11:00 PM).
for (let hour = 8; hour < 23; hour++) { // Loop through hours from 8 to 22 (inclusive).
    for (let minute = 0; minute < 60; minute += 30) { // Loop through minutes, incrementing by 30.
        // Create the start and end times in the format "HH:MM" (e.g., "8:00-8:30").
        let timeStart = `${hour}:${minute < 10 ? '0' : ''}${minute}`;
        // Determine the next hour and minute for the end time of the time interval.
        let nextHour = minute === 30 ? hour + 1 : hour;
        // If the current minute is 30, increment the hour by 1; otherwise, keep the same hour.
        let nextMinute = minute === 30 ? 0 : minute + 30;
        // Create the end time in the format "HH:MM" (e.g., "8:00-8:30").
        let timeEnd = `${nextHour}:${nextMinute < 10 ? '0' : ''}${nextMinute}`;

        // Create a new table row for each time interval.
        const row = document.createElement('tr');

        // Create a table header cell (th) for the time interval and set its class to 'tempo'.
        const timeCell = document.createElement('th');
        timeCell.className = 'tempo';
        timeCell.textContent = `${timeStart}-${timeEnd}`;
        row.appendChild(timeCell);

        // Loop through the days of the week (7 days) and create a cell (td) for each day.
        for (let day = 0; day < 7; day++) {
            // Create a table data cell for the schedule information and set its class to 'aula'.
            const cell = document.createElement('td');
            cell.className = 'aula';
            row.appendChild(cell);
        }

        // Append the row to the table, adding it to the grid of cells.
        table.appendChild(row);
    }

}
// content -> what is to be written in the designated cell
function assignEvent(rowIndex, columnIndex, content) {
    const table = document.querySelector('tbody');

    if (table.rows[rowIndex] && table.rows[rowIndex].cells[columnIndex]) {
        const cell = table.rows[rowIndex].cells[columnIndex];
        cell.textContent = content;
        cell.style.backgroundColor = "#8abdff";
    } else {
        console.error("Invalid row or column index.");
    }
}


function clearTable() {
    const table = document.querySelector('tbody');

    // Loop through all rows starting from the second row (index 1)
    for (let i = 1; i < table.rows.length; i++) {
        // Loop through all cells in each row starting from the second cell (index 1)
        for (let j = 1; j < table.rows[i].cells.length; j++) {
            const cell = table.rows[i].cells[j];
                cell.textContent = "";
                cell.style.backgroundColor = "white";

        }
    }
}*/



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

        startDate = new Date(csvFirstDate);
        lastDate = new Date(csvLastDate);
        WeekStart = new Date(csvFirstDate);
    }
}

//Prints to HTML footer the current year
document.getElementById("year").innerHTML = new Date().getFullYear();


