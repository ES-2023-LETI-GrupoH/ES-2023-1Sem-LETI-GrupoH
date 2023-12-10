const Papa = require('papaparse');

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

const { loadAndParseCSV, parse } = require('../../../main/webapp/js/scripts.js');
//const csvTestDir = '../../test/resources/csv_test.csv';
describe('loadAndParseCSV', () => {
    test('Correctly download from a remote source', async () => {
        const csvData = {
            totalNumberOfLines: 3,
            maximumNumberOfFields: 8,
            data: [
                ['Field1', 'Field2', 'Field3', 'Field4', 'Field5', 'Field6', 'Field7', 'Field8', '01/05/2023'],
                ['Value1', 'Value2', 'Value3', 'Value4', 'Value5', 'Value6', 'Value7', 'Value8', '02/05/2023'],
                ['Value9', 'Value10', 'Value11', 'Value12', 'Value13', 'Value14', 'Value15', 'Value16', '03/05/2023'],
            ],
        };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve(csvData),
            })
        );

        const expectedData = [{ header1: 'value1', header2: 'value2' }];
        await expect(loadAndParseCSV('https://raw.githubusercontent.com/ES-2023-LETI-GrupoH/ES-2023-1Sem-LETI-GrupoH/test/src/test/resources/csv_test.csv?token=GHSAT0AAAAAACKVD6JVGFBQHFDUFI2JZCUYZLWFIAQ', true)).resolves.toEqual(expectedData);
    });

    test('Reject when CSV analysis throws an error', async () => {
        const csvData = 'header1;header2\nvalue1;';
        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve(csvData),
            })
        );

        await expect(loadAndParseCSV('https://raw.githubusercontent.com/ES-2023-LETI-GrupoH/ES-2023-1Sem-LETI-GrupoH/test/src/test/resources/csv_test.csv?token=GHSAT0AAAAAACKVD6JVGFBQHFDUFI2JZCUYZLWFIAQ', true)).rejects.toEqual('Erro ao analisar o arquivo CSV.');
    });

});

describe('parse function', () => {
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
})

