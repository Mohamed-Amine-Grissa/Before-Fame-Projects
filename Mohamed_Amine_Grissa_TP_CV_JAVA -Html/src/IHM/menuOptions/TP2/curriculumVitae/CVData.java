package IHM.menuOptions.TP2.curriculumVitae;

import java.io.File;
import java.util.List;

// lehna a3malt il sotckage mte3 kol les information illi bich n7othom fil CV
// nom + Gmail + formations + commentaires + photo + .. ila a5irihi

public class CVData {
    String nom, prenom, email, tel, dateNaissance, sexe, formation, formations, commentaires;
    List<String> langues;
    List<String> competences;
    int experience;
    File photo;

    public CVData(String nom, String prenom, String email, String tel, String dateNaissance,
                  String sexe, String formation, List<String> langues, List<String> competences,
                  int experience, File photo, String formations, String commentaires) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.tel = tel;
        this.dateNaissance = dateNaissance;
        this.sexe = sexe;
        this.formation = formation;
        this.langues = langues;
        this.competences = competences;
        this.experience = experience;
        this.photo = photo;
        this.formations = formations;
        this.commentaires = commentaires;
    }
}