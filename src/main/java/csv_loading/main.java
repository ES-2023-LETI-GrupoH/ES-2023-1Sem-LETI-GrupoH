package csv_loading;

import java.io.*;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class main {

    private static String delimiter = ";";
    private static String remoteInput;

    public static void setDelimiter(String s) {
        delimiter = s;
    }


    static List<String[]> dataList = new ArrayList<>(); // Create a list to store each line of fields in the CSV
    static int maximumNumberOfFields = 0;  // Initialize a variable to track the maximum number of fields in any line
    static int totalNumberOfLines;
    static String[][] data;

    public static void getandParseRemoteFile(String url) throws IOException {
        URL remote = new URL(url);
        BufferedReader in = new BufferedReader(
                new InputStreamReader(remote.openStream()));
        while ((remoteInput = in.readLine()) != null){
            String[] fields = remoteInput.split(delimiter); // Split the line into fields using the semicolon (;) as the delimiter
            maximumNumberOfFields = Math.max(maximumNumberOfFields, fields.length); // Update the maximum number of fields if necessary
            dataList.add(fields); // Add the fields to the list
        }
        in.close();

        totalNumberOfLines = dataList.size(); // Calculate the total number of lines in the CSV
        data = new String[totalNumberOfLines][maximumNumberOfFields]; // Create a two-dimensional array to store the CSV data
        for (int i = 0; i < totalNumberOfLines; i++) {// Copy the data from the list into the two-dimensional array
            String[] fields = dataList.get(i);
            System.arraycopy(fields, 0, data[i], 0, fields.length); // Use System.arraycopy to copy the fields into the array
        }

    }

    public static void parse(FileReader texto) {
        Scanner scanner = new Scanner(texto);  // Initialize a scanner to read the CSV data

        while (scanner.hasNextLine()) { // Loop through each line in the CSV data
            String line = scanner.nextLine(); // Read the next line
            String[] fields = line.split(delimiter); // Split the line into fields using the semicolon (;) as the delimiter
            maximumNumberOfFields = Math.max(maximumNumberOfFields, fields.length); // Update the maximum number of fields if necessary
            dataList.add(fields); // Add the fields to the list
        }

        totalNumberOfLines = dataList.size(); // Calculate the total number of lines in the CSV
        data = new String[totalNumberOfLines][maximumNumberOfFields]; // Create a two-dimensional array to store the CSV data

        for (int i = 0; i < totalNumberOfLines; i++) {// Copy the data from the list into the two-dimensional array
            String[] fields = dataList.get(i);
            System.arraycopy(fields, 0, data[i], 0, fields.length); // Use System.arraycopy to copy the fields into the array
        }
    }

    public static void print() {
        System.out.println("Total number of lines: " + totalNumberOfLines + " and each line has " + maximumNumberOfFields + " parts");// Print the total number of lines and the maximum number of fields
        for (int y = 0; y < totalNumberOfLines; y++) {// Print the CSV data in a tabular format
            for (int x = 0; x < maximumNumberOfFields; x++) {
                System.out.print(data[y][x] + " | ");
            }
            System.out.println();
        }
    }


        public static void main(String[] args) throws IOException {
            setDelimiter(";");
            //FileReader testread;
            //parse(testread);
            getandParseRemoteFile("https://raw.githubusercontent.com/ES-2023-LETI-GrupoH/ES-2023-1Sem-LETI-GrupoH/obj-01/src/main/java/csv_loading/minihorario.csv?token=GHSAT0AAAAAACHEEKKTPINYI5FRVG5E4WKGZKKSZVQ");
            print();
        }


    }


