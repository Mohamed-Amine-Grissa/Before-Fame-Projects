package IHM.gestionEtudiant;

import DataBase.EtudiantImplementation;
import DataBase.EtudiantImplementation;
import Adapter.MyEtudiantTableModel;

import javax.swing.*;
import java.awt.*;
import java.sql.ResultSet;


public class GestionEtudiant extends JFrame{
    private JTable table;
    private EtudiantImplementation etudiantImplementation;

    private FormEtudiant formEtudiant;

    public GestionEtudiant() {
        FormEtudiant formEtudiant = new FormEtudiant();

        setPreferredSize(new Dimension(700, 600));

        this.setDefaultCloseOperation(EXIT_ON_CLOSE);

        etudiantImplementation = new EtudiantImplementation();
        ResultSet resultSet = etudiantImplementation.selectEtudiant("SELECT * FROM etudiant");

        MyEtudiantTableModel model = new MyEtudiantTableModel(resultSet, etudiantImplementation, formEtudiant);
        table = new JTable(model);
        this.add(new JScrollPane(table));

        this.setTitle(" *** Gestion de tous les Etudiant ***");

        this.add(formEtudiant, BorderLayout.NORTH);
        this.setVisible(true);

    }

    public static void main(String[] args) {
        GestionEtudiant gestionEtudiant = new GestionEtudiant();
        gestionEtudiant.pack();
        gestionEtudiant.setVisible(true);
    }

}
