package csv_loading;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Scanner;

public class main {

    static int m_rows = 150;
    static int m_columns = 11;
    static String[][] matriz = new String[m_rows][m_columns];


    private static String delimiter = ";";

    public static void setDelimiter(String s) {
        delimiter = s;
    }
    public static void setMatrixSize(int rows, int columns) {
        m_rows = rows;
        m_columns = columns;
    }


    public static void parse(FileReader f) {
        Scanner sc = new Scanner(f);
        sc.useDelimiter(delimiter);
//        int i = 0;
//        HashMap<Integer,String> h = new HashMap<>();
//        while (lines.hasNextLine()) {
////            matriz[0][i] = lines.nextLine();
////            System.out.println(matriz[0][i]);
////            i++;
//            h.put(i,lines.nextLine());
//            i++;
//        }
//        lines.close();
//        for(int x = 0; x < h.size(); x++){
//            String[] s = h.get(x).split(delimiter);
//            for(int y = 0; y < s.length; y++) {
//                matriz[x][y] = s[y];
//            }
//            //matriz[x] = s;
//            //System.out.println(Arrays.toString(s));
//        }

        for (int x = 0; x < matriz.length; x++) {
            for (int y = 0; y < matriz[x].length; y++) {
                if (sc.hasNext()) {
                    matriz[x][y] = sc.next();
                } else {
                    break;
                }
            }
        }
        sc.close();
    }

    public static void print2D(String[][] mat) {
        for (String[] row : mat) {
            for (String element : row) {
                System.out.print(element + "|");
            }
            //System.out.println();
        }
    }


    public static void main(String[] args) {
        setDelimiter(";");
        FileReader testread;
        try {
            testread = new FileReader("src/main/java/csv_loading/minihorario.csv");
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        parse(testread);
        print2D(matriz);
    }

}