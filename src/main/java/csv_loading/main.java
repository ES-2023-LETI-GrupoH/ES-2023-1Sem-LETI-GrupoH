package csv_loading;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Scanner;

public class main {

    static String[][] matriz = new String[10][150];

    public static void main(String args[]) {
        setDelimiter(";");
        FileReader testread;
        try {
            testread = new FileReader("C:/Users/vb200/IdeaProjects/ES-2023-1Sem-LETI-GrupoH/src/main/java/csv_loading/minihorario.csv");
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        parse(testread);
        print2D(matriz);
    }

    private static String delimiter = ",";

    public static void setDelimiter(String s) {
        delimiter = s;
    }

    public static void parse(FileReader f) {
        Scanner sc = new Scanner(f);
        sc.useDelimiter(delimiter);
            for (int x = 0; x < matriz.length ; x++) {
                for(int y = 0; y < matriz[x].length; y++) {
                    matriz[x][y] = sc.next();
                }
            }
        sc.close();
    }

    private static boolean equals(String next, String lineBreak) {
        return false;
    }

    private static boolean equals(boolean b, String lineBreak) {
        return b;
    }

    public static void print2D(String mat[][]) {
        // Loop through all rows
        for (int i = 0; i < mat.length; i++)

            // Loop through all elements of current row
            for (int j = 0; j < mat[i].length; j++)
                System.out.print(mat[i][j] + "|");

    }
}
