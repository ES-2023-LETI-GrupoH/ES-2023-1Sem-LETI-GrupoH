
const startDate = new Date("September 15, 2023");
const lastDate = new Date("August 23, 2024")
const WeekDate = new Date(startDate) // This variable is used for the week navigation.
                                           // It can't be directly assign to startDate or else it
                                           // will update in the week navigation the both variables.




// ---------------- MODAL -------------------------------
var myModal = document.getElementById('exampleModal')
var myInput = document.getElementById('myInput')


// ----------------- CSV Download -------------------------------
function downloadCSVFromURL(url) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = 'data.csv'; // Specify the filename
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(a.href);
        })
        .catch(error => console.error('Error downloading CSV:', error));
}

// ---------------- CSV Input -------------------------------

// Adicione um evento de mudança para o dropdown menu
const importTypeDropdown = document.getElementById("csv-import");
const csvFileInput = document.getElementById("csv-file");
const csvUrlInput = document.getElementById("csv-url");
const csvDataDisplay = document.getElementById("csv-data");

// Define the event handler function
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
        console.log("WORKS FILE");
        // Processar arquivo CSV
    } else if (importTypeDropdown.value === "url" && csvUrlInput.value) {
        // Processar CSV por URL
        downloadCSVFromURL(csvUrlInput.value); // Call a function to download CSV from the URL
    } else {
        // Lógica para lidar com nenhum arquivo selecionado ou URL inserida
        myInput.focus();
    }


    const file = csvFileInput.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const csvContent = e.target.result;
            // CSV information processing
        };

        reader.readAsText(file); //read the file name
    }
});



// ---------------- WEEK NAVIGATOR -------------------------------



function updateWeekStatus() {

    console.log(formatDate(WeekDate));
    let WeekMonday = new Date(WeekDate);
    // Sets the start date for the nearest monday available ( monday = 1 )
    while (WeekMonday.getDay() !== 1) {
        WeekMonday.setDate(WeekMonday.getDate() - 1);
    }


    // Calculates the endDate for the week of the startingDay
    let WeekLastDate = new Date(WeekMonday);
    WeekLastDate.setDate(WeekMonday.getDate() + 6);


    // Puts the date in the Portuguese Format
    let WeekFirstDateString = formatDate(WeekMonday);
    let WeekLastDateString = formatDate(WeekLastDate);

    // Sends the week date to the HTML span which id is "week-date"
    document.getElementById("week-date").textContent = WeekFirstDateString + " - " + WeekLastDateString;

}

// FIRST Week Navigation Update
updateWeekStatus();

// Previous Week functions
const previousWeekBttn = document.getElementById("previous-week");
previousWeekBttn.addEventListener("click", function () {
    if (WeekDate.getTime() > startDate) { // Checks if is the first week
        WeekDate.setDate(WeekDate.getDate() - 7);
        updateWeekStatus();
    }
});

// Next Week functions
const nextWeekBttn = document.getElementById("next-week");
nextWeekBttn.addEventListener("click", function () {
    let nextWeekDate = new Date(WeekDate); //Temporary variable for the next week
    nextWeekDate.setDate(nextWeekDate.getDate()+6) // Predicts the next week date and stores it temporarily in the nextWeekDate var
    if (nextWeekDate < lastDate) { // Compares if the predicted date is smaller than the last date
        WeekDate.setDate(WeekDate.getDate() + 6);  //Updates the WeekDate for the next week
        updateWeekStatus();
    }
});

// Reset Week functions
const resetWeekBttn = document.getElementById("reset-week");
resetWeekBttn.addEventListener("click", function () {
    WeekDate.setTime(startDate.getTime()); // Updates the WeekDate for the first week. It needs to be GetTime() instead of GetDate()
    updateWeekStatus();                    // because if its GetDate it only updates the day and not the entire date
});

// -------------------------- TABLE CREATION ---------------------------------


// Select the HTML table element with the 'table' tag and assign it to the 'table' variable.
const table = document.querySelector('table');

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




// Auxiliary Functions

// This function sets any date in the format DD/MM/YYYY
function formatDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1; // Os meses são indexados a partir de 0 em JavaScript
    var year = date.getFullYear();

    // Adicione um zero à frente se o dia ou o mês for menor que 10
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    return day + '/' + month + '/' + year;
}


/*function findLastWeekDay(date) {
    while (date.getDay() !== 7) {
        date.setDate(date.getDate() + 7);
    }
    return date;
}*/

//Prints to HTML footer the current year
document.getElementById("year").innerHTML = new Date().getFullYear();