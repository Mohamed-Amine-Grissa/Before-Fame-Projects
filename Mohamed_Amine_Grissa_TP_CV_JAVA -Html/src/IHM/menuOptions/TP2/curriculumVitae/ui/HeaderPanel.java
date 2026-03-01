package IHM.menuOptions.TP2.curriculumVitae.ui;

import javax.swing.*;
import java.awt.*;
import static IHM.menuOptions.TP2.curriculumVitae.CVConstants.*;

// Lahya bil blacka zar9a illi fil curriculumVitae Page
// size + text + font + color + alignement
public class HeaderPanel extends JLabel {
    public HeaderPanel() {
        super("  Curriculum  Vitae");
        setPreferredSize(new Dimension(1920, 70));
        setForeground(Color.WHITE);
        setOpaque(true);
        setBackground(HEADER_COLOR);
        setHorizontalAlignment(JLabel.CENTER);
        setFont(new Font(Font.SERIF, Font.BOLD, 30));
    }
}