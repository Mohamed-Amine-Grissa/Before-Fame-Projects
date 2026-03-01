package DataBase;

import java.sql.*;

public class EtudiantImplementation implements EtudiantDAO{

    Connection connection = null;

    public EtudiantImplementation() {

        try {

            connection = DataBaseConnection.makeConnection();

        } catch (Exception e) {

            System.out.println(e.getMessage());

        }

    }

    @Override
    public int insertEtudiant(int cin, String nom, String prenom, double moyenne) {
        Statement statement = null;
        int a = 0;
        String requete = "INSERT INTO etudiant(cin, nom, prenom,moyenne) VALUES (cin, nom, prenom,moyenne)";

        try{
            statement = connection.createStatement();
            a = statement.executeUpdate(requete);

        }catch (Exception e){
            System.out.println(e.getMessage());
            return -1;
        }

        return a;
    }

    @Override
    public int deleteEtudiant(int cin) {
        Statement statement = null;
        int a = 0;
        String requete = "DELETE FROM etudiant WHERE cin = " + cin;

        try{
            statement = connection.createStatement();
            a = statement.executeUpdate(requete);

        }catch (Exception e){
            System.out.println(e.getMessage());
            return -1;
        }

        return a;
    }

    @Override
    public int updateEtudiant(int cin, String nom, String prenom, double moyenne) {
        Statement statement = null;
        int a = 0;
        String requete = "UPDATE etudiant SET nom = '" + nom + "', prenom = '" + prenom + "', moyenne = " + moyenne + " WHERE cin = " + cin;

        try{
            statement = connection.createStatement();
            a = statement.executeUpdate(requete);

        }catch (Exception e){
            System.out.println(e.getMessage());
            return -1;
        }

        return a;
    }

    @Override
    public ResultSet selectEtudiant(String requete) {
        ResultSet resultSet = null;
        Statement statement = null;

        try {
            statement = connection.createStatement();
            resultSet = statement.executeQuery(requete);

        } catch (SQLException e) {
            System.out.println("Erreur: " + e.getMessage());
            return null;
        }

        return resultSet;
    }

    @Override
    public void afficherResultatSet(ResultSet resultSet) {
        try {
            ResultSetMetaData resultSetMetaData = resultSet.getMetaData();
            int nbrColonnes = resultSetMetaData.getColumnCount();

            // Eni zidet il print mte3 il Header (why ? More user friendly)
            for(int i=1; i<=nbrColonnes; i++) {
                System.out.print(resultSetMetaData.getColumnName(i) + "\t");
            }
            System.out.println();

            while (resultSet.next()) {
                for (int i = 1; i <= nbrColonnes; i++) {
                    System.out.println(resultSet.getObject(i) + "\t");
                }
            }
        } catch (SQLException e) {
            System.out.println("Erreur: " + e.getMessage());
        }
    }






}
