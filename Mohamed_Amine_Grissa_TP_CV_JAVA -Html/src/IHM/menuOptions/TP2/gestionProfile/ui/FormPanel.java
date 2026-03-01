package IHM.menuOptions.TP2.gestionProfile.ui;

import IHM.menuOptions.TP2.gestionProfile.model.DataProfil;
import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

public class FormPanel extends JPanel {

        private DataProfil currentProfil;

        private JLabel lb_greeting;
        private JButton btn_ajouter_langue;
        private JButton btn_enregistrer;
        private JButton btn_info;
        private JTextField tf_date_debut;
        private JPanel langues_panel;

        private List<LanguageRow> languageRows;

        public FormPanel() {
                this.languageRows = new ArrayList<>();
                this.setLayout(new BorderLayout(10, 10));
                this.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));
                this.setBackground(Color.WHITE);

                add(createTopSection(), BorderLayout.NORTH);
                add(createCenterSection(), BorderLayout.CENTER);
                add(createBottomSection(), BorderLayout.SOUTH);
                add(createRightSection(), BorderLayout.EAST);
        }

        private JPanel createTopSection() {
                JPanel panel = new JPanel(new FlowLayout(FlowLayout.LEFT));
                panel.setBackground(Color.WHITE);

                lb_greeting = new JLabel("Bonjour nom + prénom");
                lb_greeting.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 16));
                lb_greeting.setForeground(new Color(30, 60, 114));

                panel.add(lb_greeting);
                return panel;
        }

        private JPanel createCenterSection() {
                JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
                mainPanel.setBackground(Color.WHITE);

                // Header with "Langue :" label and + button
                JPanel headerPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 5));
                headerPanel.setBackground(Color.WHITE);

                JLabel lb_langue = new JLabel("Langue :");
                lb_langue.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 14));

                btn_ajouter_langue = new JButton("+");
                btn_ajouter_langue.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 18));
                btn_ajouter_langue.setPreferredSize(new Dimension(40, 30));
                btn_ajouter_langue.setBackground(new Color(46, 125, 50));
                btn_ajouter_langue.setForeground(Color.WHITE);
                btn_ajouter_langue.setFocusPainted(false);

                headerPanel.add(lb_langue);
                headerPanel.add(btn_ajouter_langue);

                mainPanel.add(headerPanel, BorderLayout.NORTH);

                // Languages panel
                langues_panel = new JPanel();
                langues_panel.setLayout(new BoxLayout(langues_panel, BoxLayout.Y_AXIS));
                langues_panel.setBackground(Color.WHITE);

                // Add default languages
                addLanguageRow("Arabe", 1);
                addLanguageRow("Français", 1);
                addLanguageRow("Anglais", 1);

                JScrollPane scrollPane = new JScrollPane(langues_panel);
                scrollPane.setBorder(BorderFactory.createLineBorder(Color.LIGHT_GRAY));
                scrollPane.setPreferredSize(new Dimension(400, 200));

                mainPanel.add(scrollPane, BorderLayout.CENTER);

                // Add button action
                btn_ajouter_langue.addActionListener(e -> {
                        String langue = JOptionPane.showInputDialog(this, "Entrez le nom de la langue:");
                        if (langue != null && !langue.trim().isEmpty()) {
                                addLanguageRow(langue.trim(), 1);
                                langues_panel.revalidate();
                                langues_panel.repaint();
                        }
                });

                return mainPanel;
        }

        private void addLanguageRow(String langueName, int niveau) {
                LanguageRow langRow = new LanguageRow(langueName, niveau);
                languageRows.add(langRow);
                langues_panel.add(langRow.getPanel());
        }

        private JPanel createBottomSection() {
                JPanel panel = new JPanel(new FlowLayout(FlowLayout.CENTER, 15, 10));
                panel.setBackground(Color.WHITE);
                panel.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));

                btn_enregistrer = new JButton("Enregistrer");
                btn_enregistrer.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 13));
                btn_enregistrer.setPreferredSize(new Dimension(130, 35));
                btn_enregistrer.setBackground(new Color(46, 125, 50));
                btn_enregistrer.setForeground(Color.WHITE);
                btn_enregistrer.setFocusPainted(false);

                btn_info = new JButton("Info");
                btn_info.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 13));
                btn_info.setPreferredSize(new Dimension(130, 35));
                btn_info.setBackground(new Color(30, 60, 114));
                btn_info.setForeground(Color.WHITE);
                btn_info.setFocusPainted(false);

                JButton btn_annuler = new JButton("Annuler");
                btn_annuler.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 13));
                btn_annuler.setPreferredSize(new Dimension(130, 35));
                btn_annuler.setBackground(new Color(198, 40, 40));
                btn_annuler.setForeground(Color.WHITE);
                btn_annuler.setFocusPainted(false);

                panel.add(btn_enregistrer);
                panel.add(btn_info);
                panel.add(btn_annuler);

                // Enregistrer action - save data to DataProfil
                btn_enregistrer.addActionListener(e -> saveProfile());

                // Info action - show profile data in JOptionPane
                btn_info.addActionListener(e -> showProfileInfo());

                return panel;
        }

        private JPanel createRightSection() {
                JPanel panel = new JPanel();
                panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
                panel.setBackground(new Color(245, 247, 250));
                panel.setBorder(BorderFactory.createCompoundBorder(
                        BorderFactory.createLineBorder(Color.LIGHT_GRAY),
                        BorderFactory.createEmptyBorder(15, 15, 15, 15)
                ));
                panel.setPreferredSize(new Dimension(220, 0));

                JLabel lb_title = new JLabel("Ajouter nouveau Profil");
                lb_title.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 12));
                lb_title.setAlignmentX(Component.LEFT_ALIGNMENT);

                panel.add(lb_title);
                panel.add(Box.createVerticalStrut(15));

                JLabel lb_date = new JLabel("Date début:");
                lb_date.setFont(new Font(Font.SANS_SERIF, Font.PLAIN, 11));
                lb_date.setAlignmentX(Component.LEFT_ALIGNMENT);

                tf_date_debut = new JTextField(12);
                tf_date_debut.setMaximumSize(new Dimension(180, 25));
                tf_date_debut.setAlignmentX(Component.LEFT_ALIGNMENT);

                panel.add(lb_date);
                panel.add(Box.createVerticalStrut(5));
                panel.add(tf_date_debut);
                panel.add(Box.createVerticalStrut(15));

                JButton btn_add = new JButton("Ajouter");
                btn_add.setAlignmentX(Component.LEFT_ALIGNMENT);
                btn_add.setBackground(new Color(30, 60, 114));
                btn_add.setForeground(Color.WHITE);
                btn_add.setFocusPainted(false);

                panel.add(btn_add);

                return panel;
        }

        // Save profile data
        private void saveProfile() {
                if (currentProfil == null) {
                        JOptionPane.showMessageDialog(this,
                                "Aucun profil chargé!",
                                "Erreur",
                                JOptionPane.WARNING_MESSAGE);
                        return;
                }

                // Clear existing languages
                currentProfil.getLangues().clear();

                // Add all selected languages
                for (LanguageRow row : languageRows) {
                        if (row.isSelected()) {
                                currentProfil.addLangue(row.getLanguageName(), row.getNiveau());
                        }
                }

                JOptionPane.showMessageDialog(this,
                        "Profil enregistré avec succès!\n" + currentProfil.toString(),
                        "Succès",
                        JOptionPane.INFORMATION_MESSAGE);
        }

        // Show profile info in JOptionPane
        private void showProfileInfo() {
                if (currentProfil == null) {
                        JOptionPane.showMessageDialog(this,
                                "Aucun profil chargé!",
                                "Erreur",
                                JOptionPane.WARNING_MESSAGE);
                        return;
                }

                StringBuilder info = new StringBuilder();
                info.append("═══════════════════════════\n");
                info.append("     INFORMATIONS DU PROFIL\n");
                info.append("═══════════════════════════\n\n");
                info.append("Pseudo: ").append(currentProfil.getPseudo()).append("\n");
                info.append("Nom: ").append(currentProfil.getNom()).append("\n");
                info.append("Prénom: ").append(currentProfil.getPrenom()).append("\n\n");
                info.append("Langues:\n");

                if (currentProfil.getLangues().isEmpty()) {
                        info.append("  Aucune langue enregistrée\n");
                } else {
                        for (DataProfil.Langue langue : currentProfil.getLangues()) {
                                info.append("  • ").append(langue.toString()).append("\n");
                        }
                }

                JOptionPane.showMessageDialog(this,
                        info.toString(),
                        "Info Profil - " + currentProfil.getPseudo(),
                        JOptionPane.INFORMATION_MESSAGE);
        }

        // Set greeting and initialize profile
        public void setGreeting(String nom, String prenom) {
                lb_greeting.setText("Bonjour " + nom + " " + prenom);
        }

        public void setProfile(DataProfil profil) {
                this.currentProfil = profil;
                setGreeting(profil.getNom(), profil.getPrenom());

                // Load languages from profile
                languageRows.clear();
                langues_panel.removeAll();

                if (profil.getLangues().isEmpty()) {
                        // Add defaults
                        addLanguageRow("Arabe", 1);
                        addLanguageRow("Français", 1);
                        addLanguageRow("Anglais", 1);
                } else {
                        for (DataProfil.Langue langue : profil.getLangues()) {
                                addLanguageRow(langue.getNom(), langue.getNiveau());
                        }
                }

                langues_panel.revalidate();
                langues_panel.repaint();
        }

        // Inner class to represent a language row
        private class LanguageRow {
                private JPanel panel;
                private JCheckBox checkbox;
                private JSpinner spinner;

                public LanguageRow(String langueName, int niveau) {
                        panel = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 5));
                        panel.setBackground(Color.WHITE);
                        panel.setMaximumSize(new Dimension(Integer.MAX_VALUE, 40));

                        checkbox = new JCheckBox(langueName);
                        checkbox.setFont(new Font(Font.SANS_SERIF, Font.PLAIN, 13));
                        checkbox.setBackground(Color.WHITE);
                        checkbox.setSelected(true);

                        JLabel lb_niveau = new JLabel("Niveau:");
                        lb_niveau.setFont(new Font(Font.SANS_SERIF, Font.PLAIN, 12));

                        SpinnerNumberModel spinnerModel = new SpinnerNumberModel(niveau, 1, 10, 1);
                        spinner = new JSpinner(spinnerModel);
                        spinner.setPreferredSize(new Dimension(60, 25));

                        JButton btn_delete = new JButton("×");
                        btn_delete.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 16));
                        btn_delete.setPreferredSize(new Dimension(30, 25));
                        btn_delete.setBackground(new Color(198, 40, 40));
                        btn_delete.setForeground(Color.WHITE);
                        btn_delete.setFocusPainted(false);
                        btn_delete.setBorderPainted(false);

                        btn_delete.addActionListener(e -> {
                                langues_panel.remove(panel);
                                languageRows.remove(this);
                                langues_panel.revalidate();
                                langues_panel.repaint();
                        });

                        panel.add(checkbox);
                        panel.add(Box.createHorizontalStrut(10));
                        panel.add(lb_niveau);
                        panel.add(spinner);
                        panel.add(btn_delete);
                }

                public JPanel getPanel() { return panel; }
                public boolean isSelected() { return checkbox.isSelected(); }
                public String getLanguageName() { return checkbox.getText(); }
                public int getNiveau() { return (Integer) spinner.getValue(); }
        }
}