package IHM.menuOptions.TP2.curriculumVitae.components;

import javax.swing.*;
import java.awt.*;
import java.util.List;

import static IHM.menuOptions.TP2.curriculumVitae.CVConstants.FIELD_FONT;

// lehna n7eb nasna3 scrollable list feha il languages illi nejjem ne7kihom, w n7eb nasna3ha b JScrollPane 3alash n7eb nasna3ha scrollable itha ken fama barcha languages

public class LanguagePanel extends JScrollPane {

    private JList<String> jl_langue;

    public LanguagePanel() {
        String[] langues = {"Arabe", "Français", "Anglais", "Italien", "Allemand", "Espagnol", "Japonais"};

        jl_langue = new JList<>(langues);
        jl_langue.setFont(FIELD_FONT);
        jl_langue.setSelectionMode(ListSelectionModel.MULTIPLE_INTERVAL_SELECTION);
        jl_langue.setVisibleRowCount(4);

        setViewportView(jl_langue);
        setPreferredSize(new Dimension(220, 100));
    }

    public List<String> getSelectedLanguages() {
        return jl_langue.getSelectedValuesList();
    }
}