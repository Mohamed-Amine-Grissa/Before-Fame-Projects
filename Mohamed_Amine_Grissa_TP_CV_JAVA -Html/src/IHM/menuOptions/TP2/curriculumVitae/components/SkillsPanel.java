package IHM.menuOptions.TP2.curriculumVitae.components;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

import static IHM.menuOptions.TP2.curriculumVitae.CVConstants.*;

// Lehna sna3t il chackboxes mte3 il languages illi a3ndi skills fehom : Java, C, C++, etc
// Lehna ista3malt GridLayout 3alash n7eb n7ot les checkboxes wahdin ta7t l5rin w n7eb n7ot espace binathom

public class SkillsPanel extends JPanel {

    private JCheckBox[] checkCompetences;

    public SkillsPanel() {
        String[] competences = {"Java", "Python", "SQL", "HTML/CSS", "JavaScript", "C", "C++", "Kotlin", "C#"};
        checkCompetences = new JCheckBox[competences.length];

        setLayout(new GridLayout(competences.length, 1, 0, 2));
        setBackground(BG_COLOR);

        for (int i = 0; i < competences.length; i++) {
            checkCompetences[i] = new JCheckBox(competences[i]);
            checkCompetences[i].setFont(FIELD_FONT);
            checkCompetences[i].setBackground(BG_COLOR);
            add(checkCompetences[i]);
        }
    }

    public List<String> getSelectedSkills() {
        List<String> skills = new ArrayList<>();
        for (JCheckBox cb : checkCompetences) {
            if (cb.isSelected()) {
                skills.add(cb.getText());
            }
        }
        return skills;
    }
}