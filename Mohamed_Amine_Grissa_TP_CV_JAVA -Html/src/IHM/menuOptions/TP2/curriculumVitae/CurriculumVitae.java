package IHM.menuOptions.TP2.curriculumVitae;

import IHM.menuOptions.TP2.curriculumVitae.ui.*;
import javax.swing.*;
import java.awt.*;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

// hetha il markaz mte3 kol chay
// lezemni nrakez a3l les composnats illi sne3thom : components + ui

public class CurriculumVitae extends JInternalFrame {

    private FormPanel formPanel;

    public CurriculumVitae() {
        setupFrame();
        buildUI();
    }

    private void setupFrame() {
        setTitle("Curriculum Vitae");
        setSize(1920, 1080);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLayout(new BorderLayout());
        setMaximumSize(new Dimension(920, 850));
        setResizable(true);
    }

    private void buildUI() {
        add(new HeaderPanel(), BorderLayout.NORTH);

        formPanel = new FormPanel();
        JScrollPane scrollPane = new JScrollPane(formPanel);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        add(scrollPane, BorderLayout.CENTER);

        add(new ButtonPanel(this::handleValidation, this::handleQuit), BorderLayout.SOUTH);
    }

    private void handleValidation() {
        if (!formPanel.validateForm()) {
            return;
        }

        CVData data = formPanel.collectFormData();
        generateHTMLCV(data);
    }

    private void handleQuit() {
        dispose();
    }

    private void generateHTMLCV(CVData data) {
        File file = new File("CV.html");

        try (FileWriter fw = new FileWriter(file, false)) {
            HTMLGenerator generator = new HTMLGenerator(fw);
            generator.generate(data);
            Desktop.getDesktop().open(file);
        } catch (IOException ex) {
            JOptionPane.showMessageDialog(this,
                    "Erreur lors de la génération du fichier CV :\n" + ex.getMessage(),
                    "Erreur",
                    JOptionPane.ERROR_MESSAGE);
        }
    }
}