package IHM.menuOptions.TP2.curriculumVitae.ui;

import IHM.menuOptions.TP2.curriculumVitae.CVData;
import IHM.menuOptions.TP2.curriculumVitae.components.*;
import javax.swing.*;
import java.awt.*;
import java.text.SimpleDateFormat;
import java.util.*;


import static IHM.menuOptions.TP2.curriculumVitae.CVConstants.*;

// Nafs il fikra mte3 form panel illi a3maltha fil GestionProfile.java
// 5demt bil row++ mouch bil tari9a il classique (i3jbitni bil row++ ashal fil iste3mel)
// 5demt bil GridBagLayout Form

// *** Important Notes ***
/*
    instets: Adds empty space (padding) around a component. ** nejjem nebe3ad il components a3la be3adhom wou nraka7 il spacing binethom
    anchor: Specifies the alignment of the component relative to the grid. ** kima mte3 il batou win bich n7ott il composantes mte3i
    gridx: Column position (0, 1, 2...)
    gridy: Row position (0, 1, 2...)
    gridwidth: How many columns to span
    gridheight: How many rows to span
    fill: Should component stretch?
    ipadx: Internal padding (width)
    ipady: Internal padding (height)
    weightx: Horizontal stretch priority
    weighty: Vertical stretch priority
 */


public class FormPanel extends JPanel {

    private JTextField tf_nom, tf_prenom, tf_email, tf_tel;
    private JSpinner spinner_dateNaissance;
    private GenderPanel genderPanel;
    private LanguagePanel languagePanel;
    private JComboBox<String> cb_formation;
    private SkillsPanel skillsPanel;
    private JSpinner spinner_experience;
    private PhotoPanel photoPanel;
    private JTextArea ta_formations, ta_commentaires;

    public FormPanel() {
        setLayout(new GridBagLayout());
        setBorder(BorderFactory.createEmptyBorder(20, 40, 10, 40));
        setBackground(BG_COLOR);
        buildForm();
    }

    private void buildForm() {
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 10, 8, 10);
        gbc.anchor = GridBagConstraints.WEST;

        int row = 0;

        tf_nom = createTextField();
        addFormRow(gbc, row++, "Nom :", tf_nom);

        tf_prenom = createTextField();
        addFormRow(gbc, row++, "Prénom :", tf_prenom);

        tf_email = createTextField();
        addFormRow(gbc, row++, "Email :", tf_email);

        tf_tel = createTextField();
        addFormRow(gbc, row++, "Téléphone :", tf_tel);

        spinner_dateNaissance = DateSpinnerFactory.create();
        addFormRow(gbc, row++, "Date de naissance :", spinner_dateNaissance);

        genderPanel = new GenderPanel();
        addFormRow(gbc, row++, "Sexe :", genderPanel);

        gbc.anchor = GridBagConstraints.NORTHWEST;
        languagePanel = new LanguagePanel();
        addFormRow(gbc, row++, "Langues :", languagePanel);

        gbc.anchor = GridBagConstraints.WEST;
        cb_formation = createEducationComboBox();
        addFormRow(gbc, row++, "Formation :", cb_formation);

        gbc.anchor = GridBagConstraints.NORTHWEST;
        skillsPanel = new SkillsPanel();
        addFormRow(gbc, row++, "Compétences :", skillsPanel);

        gbc.anchor = GridBagConstraints.WEST;
        spinner_experience = createExperienceSpinner();
        addFormRow(gbc, row++, "Expérience (années) :", spinner_experience);

        photoPanel = new PhotoPanel();
        addFormRow(gbc, row++, "Photo :", photoPanel);

        gbc.anchor = GridBagConstraints.NORTHWEST;
        ta_formations = new JTextArea(5, 25);
        addFormRow(gbc, row++, "Formations :", createTextAreaScrollPanel(ta_formations));

        ta_commentaires = new JTextArea(5, 25);
        addFormRow(gbc, row, "Commentaires :", createTextAreaScrollPanel(ta_commentaires));
    }

    private JTextField createTextField() {
        JTextField field = new JTextField(25);
        field.setFont(FIELD_FONT);
        return field;
    }

    private JComboBox<String> createEducationComboBox() {
        String[] formations = {"Licence", "Master", "Ingénieur", "Doctorat", "Autre"};
        JComboBox<String> cb = new JComboBox<>(formations);
        cb.setFont(FIELD_FONT);
        cb.setSelectedItem("Ingénieur");
        cb.setPreferredSize(new Dimension(230, 28));
        return cb;
    }

    private JSpinner createExperienceSpinner() {
        SpinnerNumberModel model = new SpinnerNumberModel(0, 0, 50, 1);
        JSpinner spinner = new JSpinner(model);
        spinner.setFont(FIELD_FONT);
        spinner.setPreferredSize(new Dimension(80, 28));
        return spinner;
    }

    private JScrollPane createTextAreaScrollPanel(JTextArea textArea) {
        textArea.setFont(FIELD_FONT);
        textArea.setLineWrap(true);
        textArea.setWrapStyleWord(true);
        JScrollPane scrollPane = new JScrollPane(textArea);
        scrollPane.setPreferredSize(new Dimension(400, 100));
        return scrollPane;
    }

    private void addFormRow(GridBagConstraints gbc, int row, String labelText, JComponent component) {
        JLabel label = new JLabel(labelText);
        label.setFont(LABEL_FONT);

        gbc.gridx = 0;
        gbc.gridy = row;
        gbc.ipadx = 0;
        gbc.ipady = 0;
        add(label, gbc);

        gbc.gridx = 1;
        gbc.ipadx = 5;
        gbc.ipady = 4;
        add(component, gbc);
    }

    public boolean validateForm() {
        String nom = tf_nom.getText().trim();
        String prenom = tf_prenom.getText().trim();

        if (nom.isEmpty() || prenom.isEmpty()) {
            JOptionPane.showMessageDialog(this,
                    "Veuillez remplir au moins le Nom et le Prénom.",
                    "Erreur de validation",
                    JOptionPane.WARNING_MESSAGE);
            return false;
        }
        return true;
    }

    public CVData collectFormData() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String dateNaissance = sdf.format((Date) spinner_dateNaissance.getValue());

        return new CVData(
                tf_nom.getText().trim(),
                tf_prenom.getText().trim(),
                tf_email.getText().trim(),
                tf_tel.getText().trim(),
                dateNaissance,
                genderPanel.getSelectedGender(),
                (String) cb_formation.getSelectedItem(),
                languagePanel.getSelectedLanguages(),
                skillsPanel.getSelectedSkills(),
                (Integer) spinner_experience.getValue(),
                photoPanel.getSelectedPhoto(),
                ta_formations.getText().trim(),
                ta_commentaires.getText().trim()
        );
    }
}