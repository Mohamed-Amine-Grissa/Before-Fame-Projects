package IHM.menuOptions.TP2.curriculumVitae.components;

import javax.swing.*;
import java.awt.*;

import static IHM.menuOptions.TP2.curriculumVitae.CVConstants.*;

// lezem nzid il faza innou itha : tu choisi Homme Femme sera deselected / vis versa
// only one can be selected at a time

public class GenderPanel extends JPanel {

    private JRadioButton rb_homme, rb_femme;
    private ButtonGroup bg_sexe;

    public GenderPanel() {
        setLayout(new FlowLayout(FlowLayout.LEFT, 15, 0));
        setBackground(BG_COLOR);

        rb_homme = createRadioButton("Homme");
        rb_femme = createRadioButton("Femme");

        bg_sexe = new ButtonGroup();
        bg_sexe.add(rb_homme);
        bg_sexe.add(rb_femme);

        add(rb_homme);
        add(rb_femme);
    }

    private JRadioButton createRadioButton(String text) {
        JRadioButton rb = new JRadioButton(text);
        rb.setFont(FIELD_FONT);
        rb.setBackground(BG_COLOR);
        return rb;
    }

    public String getSelectedGender() {
        if (rb_homme.isSelected()) return "Homme";
        if (rb_femme.isSelected()) return "Femme";
        return "Non spécifié";
    }
}