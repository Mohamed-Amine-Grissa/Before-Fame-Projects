package Adapter;

import DataBase.EtudiantImplementation;
import IHM.gestionEtudiant.FormEtudiant;

import javax.swing.*;
import javax.swing.table.AbstractTableModel;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;

public class MyEtudiantTableModel extends AbstractTableModel {

    private final ResultSetMetaData resultSetMetaData;
    private final ArrayList<Object[]> data = new ArrayList<>();
    private final EtudiantImplementation etudiantImplementation;

    FormEtudiant formEtudiant;

    public MyEtudiantTableModel(ResultSet resultSet, EtudiantImplementation etudiantImplementation, FormEtudiant formEtudiant) {
        this.etudiantImplementation = etudiantImplementation;
        this.formEtudiant = formEtudiant;

        try {
            resultSetMetaData = resultSet.getMetaData();

            while (resultSet.next()) {
                Object[] ligne = new Object[resultSetMetaData.getColumnCount()];
                for (int i = 0; i <= resultSetMetaData.getColumnCount(); i++) {
                    ligne[i] = resultSet.getObject(i+1);
                }
                data.add(ligne);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public int getRowCount() {
        return data.size();
    }

    @Override
    public int getColumnCount() {
        try {
            return resultSetMetaData.getColumnCount();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Object getValueAt(int rowIndex, int columnIndex) {
        return data.get(rowIndex)[columnIndex];
    }

    @Override
    public String getColumnName(int column) {
        try {
            return resultSetMetaData.getColumnName(column+1);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean isCellEditable(int rowIndex, int columnIndex) {
        return getColumnClass(columnIndex).equals("moyenne");
    }

    @Override
    public void setValueAt(Object aValue, int rowIndex, int columnIndex) {
        Object ligne = data.get(rowIndex);

        etudiantImplementation.updateEtudiant((int)this.getValueAt(rowIndex,0), (String)this.getValueAt(rowIndex,1),(String) this.getValueAt(rowIndex,2),  Double.parseDouble(aValue+""));

        data.get(rowIndex)[columnIndex] = aValue;
        fireTableCellUpdated(rowIndex, columnIndex);
    }

    public void ajouterEtudiant(){
        int cin = Integer.parseInt(formEtudiant.getCin().getText());

        String nom = formEtudiant.getNom().getText();
        String prenom = formEtudiant.getPrenom().getText();

        double moyenne = Double.parseDouble(formEtudiant.getMoyenne().getText());

        formEtudiant.getRegister().addActionListener(e -> { etudiantImplementation.insertEtudiant(cin,nom,prenom,moyenne); });

        fireTableChanged();
    }
}