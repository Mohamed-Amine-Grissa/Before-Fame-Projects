package IHM.menuOptions.TP2.gestionProfile.model;

import java.util.ArrayList;
import java.util.List;

public class DataProfil {
    private String pseudo;
    private String nom;
    private String prenom;
    private List<Langue> langues;

    public DataProfil(String pseudo, String nom, String prenom) {
        this.pseudo = pseudo;
        this.nom = nom;
        this.prenom = prenom;
        this.langues = new ArrayList<>();
    }

    public String getPseudo() { return pseudo; }
    public void setPseudo(String pseudo) { this.pseudo = pseudo; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public List<Langue> getLangues() { return langues; }

    public void addLangue(String nom, int niveau) {
        langues.add(new Langue(nom, niveau));
    }

    public void removeLangue(Langue langue) {
        langues.remove(langue);
    }

    @Override
    public String toString() {
        return "Profil: " + pseudo + " (" + nom + " " + prenom + ")";
    }

    public static class Langue {
        private String nom;
        private int niveau;

        public Langue(String nom, int niveau) {
            this.nom = nom;
            this.niveau = niveau;
        }

        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }

        public int getNiveau() { return niveau; }
        public void setNiveau(int niveau) { this.niveau = niveau; }

        @Override
        public String toString() {
            return nom + " (Niveau: " + niveau + ")";
        }
    }
}