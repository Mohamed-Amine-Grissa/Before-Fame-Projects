package IHM.menuOptions.TP2.curriculumVitae.ui;

import javax.swing.*;
import java.awt.*;

// Lahi bil les Boutons mte3na : Valider + Quitter
public class ButtonPanel extends JPanel {

    public ButtonPanel(Runnable onValidate, Runnable onQuit) {
        setLayout(new FlowLayout(FlowLayout.CENTER, 20, 15));
        setBackground(new Color(235, 238, 242));
        setBorder(BorderFactory.createEtchedBorder());

        JButton btn_valider = createButton("Valider", new Color(46, 125, 50));
        btn_valider.addActionListener(e -> onValidate.run());

        JButton btn_quitter = createButton("Quitter", new Color(198, 40, 40));
        btn_quitter.addActionListener(e -> onQuit.run());

        add(btn_valider);
        add(btn_quitter);
    }

    private JButton createButton(String text, Color bgColor) {
        JButton button = new JButton(text);
        button.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 13));
        button.setPreferredSize(new Dimension(140, 40));
        button.setBackground(bgColor);
        button.setForeground(Color.WHITE);
        button.setFocusPainted(false);
        return button;
    }
}