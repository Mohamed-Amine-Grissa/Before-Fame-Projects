package DataBase;

import java.sql.*;

public class Test {
    public static void main(String[] args) {


        try {

            Class.forName(Config.nomDriver);
            System.out.println("Driver OK");

        } catch (ClassNotFoundException e) {

            System.out.println("Driver not found");

        }

        Connection com = null;
        Statement st = null;

        try {
            com = DriverManager.getConnection(Config.urlDataBase, Config.userName, Config.password);

            st = com.createStatement();

            System.out.println("connection Found");

        } catch (SQLException e) {

            System.out.println("Connection not Found");

        }

        // Exécution de requête

        String requete_insertion = "INSERT INTO etudiant (cin, nom, prenom, moyenne) VALUES (123456670, 'Grissa', 'Mohamed Amine', 18)";

        if (st != null) {
            try {
                int a = st.executeUpdate(requete_insertion);
                if (a > 0) {
                    System.out.println("Inserted");
                }
            } catch (SQLException e) {
                System.out.println("Erreur d'insertion : " + e.getMessage());
            }
        }


        String requete_select = "SELECT * FROM Etudiant";

        if( st != null) {
            ResultSet rs = null;
            try {
                rs = st.executeQuery(requete_select);

                ResultSetMetaData rsmd = rs.getMetaData();

                int nbCol = rsmd.getColumnCount();

                while (rs.next()) {
                    for(int i=1;i<=nbCol;i++) System.out.println(rs.getObject(i));
                }



            } catch (SQLException e) {
                System.out.println("Erreur de Selection : " + e.getMessage());
            }


        }

    }

}
