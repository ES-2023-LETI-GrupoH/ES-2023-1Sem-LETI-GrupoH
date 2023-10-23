package csv_loading;

import java.io.FileReader;
import java.util.Scanner;

public class main {

            public static void main(String args[]) {
                Scanner sc = new Scanner("João, Alberto, olá, apple, Samsung, Israel");
                    sc.useDelimiter(delimiter);
                        String [][] matriz = new String[5][5];
                             for(int i=0; i<10; i++) {
                                 for (int j = 0; j < 10; j++) {
                                     while (sc.hasNext()) {
                                         matriz[i][j] = sc.next();
                                         System.out.println(matriz);
                                     }
                                 }
                             }
       //             while (sc.hasNext()) {
       //                 String temporario = sc.next();
       //                     System.out.println(temporario);

            }

    private static String delimiter = ",";

    public static void setDelimeter(String s) {
        delimiter = s;
    }

    public static void parse(FileReader f) {
        String [][] matriz = new String[100][100];
            Scanner sc = new Scanner(f);
                sc.useDelimiter(delimiter);
                    while (sc.hasNext()) {
                        String temporario = sc.next();
                            System.out.println(temporario);
                    }

    }
}
