package csv_loading;

import java.io.FileReader;
import java.util.Scanner;

public class main {

    private static String delimiter = ",";

    public static void setDelimeter(String s){
        delimiter = s;
    }

    public static void parse(FileReader f){
        Scanner sc = new Scanner(f);
        sc.useDelimiter(delimiter);
    }

}
