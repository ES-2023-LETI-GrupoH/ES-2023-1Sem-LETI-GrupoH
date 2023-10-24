// Adicione JavaScript para lidar com o envio do arquivo CSV e exibir os dados
const csvForm = document.getElementById("csv-form");
const csvFileInput = document.getElementById("csv-file");
const csvDataDisplay = document.getElementById("csv-data");

csvForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const file = csvFileInput.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const csvContent = e.target.result;
            // CSV information processing
            csvDataDisplay.textContent = "Conteúdo do arquivo CSV:\n" + csvContent;
        };

        reader.readAsText(file); //read the file name
    } else {
        csvDataDisplay.textContent = "Nenhum arquivo selecionado.";
        //if no file is found it displays ""Nenhum arquivo selecionado.""
    }
});

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
