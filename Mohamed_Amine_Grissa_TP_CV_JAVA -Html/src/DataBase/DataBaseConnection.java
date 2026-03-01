package DataBase;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DataBaseConnection {
    public static Connection makeConnection() {

        try{
            Class.forName(Config.nomDriver);
            System.out.println("Driver OK");
        } catch (ClassNotFoundException e) {
            System.out.println("Error : " + e.getMessage());
        }

        try {
            Connection connection = DriverManager.getConnection(Config.urlDataBase, Config.userName, Config.password);
            System.out.println("Connection OK");
        } catch (SQLException e) {
            System.out.println("Error : " + e.getMessage());
        }

        return null;
    }

}
