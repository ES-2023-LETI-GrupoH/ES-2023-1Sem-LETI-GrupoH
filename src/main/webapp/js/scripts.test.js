
const html = `
<!DOCTYPE html>
<html>
  <body>
    <div id="content"></div>
  </body>
</html>
`;

global.document = window.document;
global.window = window;

const { parse, formatDate, getStartAndLastDate} = require('./scripts');


describe('parse function', () => {
    test('getStartAndLastDate function sets start and last dates correctly', () => {

        // Define a mock CSV data
        const csvData = {
            totalNumberOfLines: 3,
            maximumNumberOfFields: 8,
            data: [
                ['Field1', 'Field2', 'Field3', 'Field4', 'Field5', 'Field6', 'Field7', 'Field8', '01/05/2023'],
                ['Value1', 'Value2', 'Value3', 'Value4', 'Value5', 'Value6', 'Value7', 'Value8', '02/05/2023'],
                ['Value9', 'Value10', 'Value11', 'Value12', 'Value13', 'Value14', 'Value15', 'Value16', '03/05/2023'],
            ],
        };



        // Mock global variables
        let startDate = new Date();
        let lastDate = new Date();

        // Call the function with the mock CSV data
        startDate=getStartAndLastDate(csvData).startDate;
        lastDate=getStartAndLastDate(csvData).lastDate;

        // Perform assertions
        expect(formatDate(startDate)).toBe('01/05/2023'); // Adjust to match the expected start date
        expect(formatDate(lastDate)).toBe('03/05/2023');  // Adjust to match the expected last date
    });
})
describe('formatDate function', () => {
    test('should format a date in DD/MM/YYYY format', () => {
        // Defina uma data de exemplo (use a data que desejar)
        const date = new Date('2023-11-09');

        // Chame a função formatDate com a data de exemplo
        const formattedDate = formatDate(date);

        // Verifique se a data formatada corresponde à data esperada
        expect(formattedDate).toBe('09/11/2023');
    });

    test('should add leading zeros to day and month if they are less than 10', () => {
        // Defina uma data de exemplo com dia e mês menores que 10
        const date = new Date('2023-05-03');

        // Chame a função formatDate com a data de exemplo
        const formattedDate = formatDate(date);

        // Verifique se a data formatada possui zeros à esquerda para dia e mês
        expect(formattedDate).toBe('03/05/2023');
    });

    test('should handle single-digit day and month', () => {
        // Defina uma data de exemplo com um único dígito para dia e mês
        const date = new Date('2023-09-01');

        // Chame a função formatDate com a data de exemplo
        const formattedDate = formatDate(date);

        // Verifique se a data formatada possui zeros à esquerda para mês apenas
        expect(formattedDate).toBe('01/09/2023');
    });
});
describe('parse function', () => {
    test('should parse CSV data correctly', () => {
        // Sample CSV data for testing
        const csvData = 'Field1;Field2;Field3\nValue1;Value2;Value3\nValue4;Value5;Value6';

        // Call the parse function with the sample CSV data
        const parsedData = parse(csvData);

        // Your assertions based on the expected behavior of the parse function
        expect(parsedData.totalNumberOfLines).toBe(3);
        expect(parsedData.maximumNumberOfFields).toBe(3);
        expect(parsedData.data.length).toBe(3);

        // Additional assertions based on your specific data
        expect(parsedData.data[0][0]).toBe('Field1');
        expect(parsedData.data[1][1]).toBe('Value2');
        expect(parsedData.data[1][2]).toBe('Value3');
    });
});

