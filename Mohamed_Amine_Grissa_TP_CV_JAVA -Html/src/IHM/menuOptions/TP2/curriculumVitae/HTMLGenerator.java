package IHM.menuOptions.TP2.curriculumVitae;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

// hetha 80% gerated ai
// lezemni nzid nifihmou
public class HTMLGenerator {
    private final FileWriter fw;

    public HTMLGenerator(FileWriter fw) {
        this.fw = fw;
    }

    public void generate(CVData data) throws IOException {
        writeHeader(data);
        writePhotoSection(data);
        writePersonalInfoSection(data);
        writeLanguagesSection(data);
        writeSkillsSection(data);
        writeFormationsSection(data);
        writeCommentsSection(data);
        writeFooter();
    }

    private void writeHeader(CVData data) throws IOException {
        fw.write("<!DOCTYPE html>\n");
        fw.write("<html lang=\"fr\">\n");
        fw.write("<head>\n");
        fw.write("    <meta charset=\"UTF-8\">\n");
        fw.write("    <title>CV - " + data.nom + " " + data.prenom + "</title>\n");
        writeCSS();
        fw.write("</head>\n");
        fw.write("<body>\n");
        fw.write("    <h1>Curriculum Vitae</h1>\n");
    }

    private void writeCSS() throws IOException {
        fw.write("    <style>\n");
        fw.write("        body { font-family: Arial, sans-serif; max-width: 750px; margin: 40px auto; padding: 0 20px; background: #f4f6f9; color: #333; }\n");
        fw.write("        h1 { text-align: center; background: #1e3c72; color: white; padding: 18px; border-radius: 8px; margin-bottom: 30px; }\n");
        fw.write("        .section { background: white; border-radius: 8px; padding: 20px 25px; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }\n");
        fw.write("        .section h2 { color: #1e3c72; border-bottom: 2px solid #1e3c72; padding-bottom: 6px; margin-top: 0; }\n");
        fw.write("        table { width: 100%; border-collapse: collapse; }\n");
        fw.write("        table td { padding: 8px 4px; border-bottom: 1px solid #eee; }\n");
        fw.write("        table td:first-child { font-weight: bold; width: 160px; color: #1e3c72; }\n");
        fw.write("        .empty { color: #999; font-style: italic; }\n");
        fw.write("        .photo-placeholder { width: 120px; height: 150px; border: 2px dashed #ccc; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #999; font-style: italic; font-size: 13px; margin-bottom: 10px; }\n");
        fw.write("        .photo-placeholder img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }\n");
        fw.write("    </style>\n");
    }

    private void writePhotoSection(CVData data) throws IOException {
        fw.write("    <div class=\"section\">\n");
        fw.write("        <h2>Photo</h2>\n");

        if (data.photo != null) {
            File destination = new File(data.photo.getName());
            if (!data.photo.getAbsolutePath().equals(destination.getAbsolutePath())) {
                java.nio.file.Files.copy(data.photo.toPath(), destination.toPath(),
                        java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            }
            fw.write("        <div class=\"photo-placeholder\"><img src=\"" + data.photo.getName() + "\"></div>\n");
        } else {
            fw.write("        <div class=\"photo-placeholder\">Aucune photo</div>\n");
        }

        fw.write("    </div>\n");
    }

    private void writePersonalInfoSection(CVData data) throws IOException {
        fw.write("    <div class=\"section\">\n");
        fw.write("        <h2>Informations personnelles</h2>\n");
        fw.write("        <table>\n");
        fw.write("            <tr><td>Nom</td><td>" + data.nom + "</td></tr>\n");
        fw.write("            <tr><td>Prénom</td><td>" + data.prenom + "</td></tr>\n");
        fw.write("            <tr><td>Email</td><td>" + (data.email.isEmpty() ? "<span class=\"empty\">Non fourni</span>" : data.email) + "</td></tr>\n");
        fw.write("            <tr><td>Téléphone</td><td>" + (data.tel.isEmpty() ? "<span class=\"empty\">Non fourni</span>" : data.tel) + "</td></tr>\n");
        fw.write("            <tr><td>Date de naissance</td><td>" + data.dateNaissance + "</td></tr>\n");
        fw.write("            <tr><td>Sexe</td><td>" + data.sexe + "</td></tr>\n");
        fw.write("            <tr><td>Formation</td><td>" + data.formation + "</td></tr>\n");
        fw.write("            <tr><td>Expérience</td><td>" + data.experience + " année" + (data.experience > 1 ? "s" : "") + "</td></tr>\n");
        fw.write("        </table>\n");
        fw.write("    </div>\n");
    }

    private void writeLanguagesSection(CVData data) throws IOException {
        fw.write("    <div class=\"section\">\n");
        fw.write("        <h2>Langues</h2>\n");
        fw.write("        <table>\n");
        String languesStr = data.langues.isEmpty() ? "<span class=\"empty\">Aucune sélectionnée</span>" : String.join(", ", data.langues);
        fw.write("            <tr><td>Langues</td><td>" + languesStr + "</td></tr>\n");
        fw.write("        </table>\n");
        fw.write("    </div>\n");
    }

    private void writeSkillsSection(CVData data) throws IOException {
        fw.write("    <div class=\"section\">\n");
        fw.write("        <h2>Compétences techniques</h2>\n");
        fw.write("        <table>\n");
        String competencesStr = data.competences.isEmpty() ? "<span class=\"empty\">Aucune sélectionnée</span>" : String.join(", ", data.competences);
        fw.write("            <tr><td>Compétences</td><td>" + competencesStr + "</td></tr>\n");
        fw.write("        </table>\n");
        fw.write("    </div>\n");
    }

    private void writeFormationsSection(CVData data) throws IOException {
        if (!data.formations.isEmpty()) {
            fw.write("    <div class=\"section\">\n");
            fw.write("        <h2>Formations</h2>\n");
            fw.write("        <p>" + data.formations.replace("\n", "<br>") + "</p>\n");
            fw.write("    </div>\n");
        }
    }

    private void writeCommentsSection(CVData data) throws IOException {
        if (!data.commentaires.isEmpty()) {
            fw.write("    <div class=\"section\">\n");
            fw.write("        <h2>Commentaires</h2>\n");
            fw.write("        <p>" + data.commentaires.replace("\n", "<br>") + "</p>\n");
            fw.write("    </div>\n");
        }
    }

    private void writeFooter() throws IOException {
        fw.write("</body>\n");
        fw.write("</html>\n");
    }
}