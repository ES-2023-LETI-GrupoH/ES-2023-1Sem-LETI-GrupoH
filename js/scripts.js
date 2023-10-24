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
            // Aqui você pode processar os dados do CSV e exibi-los no elemento csvDataDisplay
            csvDataDisplay.textContent = "Conteúdo do arquivo CSV:\n" + csvContent;
        };

        reader.readAsText(file);
    } else {
        csvDataDisplay.textContent = "Nenhum arquivo selecionado.";
    }
});

const table = document.querySelector('table');

for (let hour = 8; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
        let timeStart = `${hour}:${minute < 10 ? '0' : ''}${minute}`;
        let nextHour = minute === 30 ? hour + 1 : hour;
        let nextMinute = minute === 30 ? 0 : minute + 30;
        let timeEnd = `${nextHour}:${nextMinute < 10 ? '0' : ''}${nextMinute}`;

        const row = document.createElement('tr');
        const timeCell = document.createElement('th');
        timeCell.className = 'tempo';
        timeCell.textContent = `${timeStart}-${timeEnd}`;
        row.appendChild(timeCell);

        for (let day = 0; day < 6; day++) {
            const cell = document.createElement('td');
            cell.className = 'aula';
            row.appendChild(cell);
        }

        table.appendChild(row);
    }
}
