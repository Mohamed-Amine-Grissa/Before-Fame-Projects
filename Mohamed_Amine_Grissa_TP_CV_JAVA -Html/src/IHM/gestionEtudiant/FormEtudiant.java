package IHM.gestionEtudiant;

import javax.swing.*;

public class FormEtudiant extends JPanel{
    private JTextField cin;
    private JTextField nom;
    private JTextField prenom;
    private JTextField moyenne;
    private JButton register;

    public JTextField getCin() {
        return cin;
    }

    public JTextField getNom() {
        return nom;
    }

    public JTextField getPrenom() {
        return prenom;
    }

    public JTextField getMoyenne() {
        return moyenne;
    }

    public JButton getRegister() {
        return register;
    }

    public FormEtudiant() {

        cin = new JTextField();
        this.add(cin);

        nom = new JTextField();
        this.add(nom);

        prenom = new JTextField();
        this.add(prenom);

        moyenne = new JTextField();
        this.add(moyenne);

        register = new JButton("Register");
        this.add(register);
    }

}
