package IHM.menuOptions.TP2.gestionProfile;

import IHM.menuOptions.TP2.gestionProfile.listeners.EcouteurLabel;
import IHM.menuOptions.TP2.gestionProfile.listeners.EcouteurText;
import IHM.menuOptions.TP2.gestionProfile.ui.FormPanel;
import IHM.menuOptions.TP2.gestionProfile.ui.PopUpMenu;
import IHM.menuOptions.TP2.gestionProfile.model.DataProfil;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;

public class GestionProfils extends JInternalFrame {

    public JLabel lb_Help;
    JPanel north_panel;
    public JLabel lb_nom, lb_prenom, lb_pseudo;
    public JTextField tf_nom, tf_prenom, tf_pseudo;
    JButton btn_enregistrer;

    ArrayList<DataProfil> profiles = new ArrayList<>();

    JSplitPane jsp;
    public JList<String> jl_profils;
    public DefaultListModel<String> model;
    public JTabbedPane jtp;


    public GestionProfils() {
        this.setTitle("Gestion des profils");
        this.setSize(920, 850);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setLayout(new BorderLayout());

        setMaximumSize(new Dimension(1920, 1080));
        setResizable(true);

        lb_Help = new JLabel("Help");
        this.add(lb_Help, BorderLayout.SOUTH);

        north_panel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 10));

        lb_nom = new JLabel("Nom :");
        lb_prenom = new JLabel("Prenom :");
        lb_pseudo = new JLabel("Pseudo :");
        tf_nom = new JTextField(10);
        tf_prenom = new JTextField(10);
        tf_pseudo = new JTextField(10);

        PopUpMenu monMenu = new PopUpMenu(this);
        btn_enregistrer = new JButton("Enregistrer");

        north_panel.add(lb_nom);
        north_panel.add(tf_nom);
        north_panel.add(lb_prenom);
        north_panel.add(tf_prenom);
        north_panel.add(lb_pseudo);
        north_panel.add(tf_pseudo);
        north_panel.add(btn_enregistrer);

        this.add(north_panel, BorderLayout.NORTH);

        // Centre (JScrollPane)
        model = new DefaultListModel<>();
        jl_profils = new JList<>(model);
        JScrollPane scrollProfils = new JScrollPane(jl_profils);

        jl_profils.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent event) {
                if (event.getClickCount() == 2 && event.getButton() == MouseEvent.BUTTON1) {
                    int index = jl_profils.locationToIndex(event.getPoint());
                    if (index != -1) {
                        String ps = model.getElementAt(index);

                        DataProfil profil = findProfile(ps);
                        if (profil == null) {
                            profil = new DataProfil(ps, tf_nom.getText(), tf_prenom.getText());
                            profiles.add(profil);
                        }

                        // Condition zidtha
                        boolean tabExists = false;
                        for (int i = 0; i < jtp.getTabCount(); i++) {
                            if (jtp.getTitleAt(i).equals(ps)) {
                                jtp.setSelectedIndex(i);
                                tabExists = true;
                                break;
                            }
                        }

                        // nafs il fikra kima illi 9balha
                        if (!tabExists) {
                            FormPanel jp = new FormPanel();
                            jp.setProfile(profil);
                            jtp.addTab(ps, jp);
                            jtp.setSelectedIndex(jtp.getTabCount() - 1);
                        }
                    }
                }

                // hethi mte3 il popup menu
                if (event.getButton() == MouseEvent.BUTTON3) {
                    int index = jl_profils.locationToIndex(event.getPoint());

                    if (index != -1 && jl_profils.getCellBounds(index, index).contains(event.getPoint())) {
                        jl_profils.setSelectedIndex(index);
                        monMenu.Mode1();
                    } else {
                        jl_profils.clearSelection();
                        monMenu.Mode2();
                    }

                    monMenu.show(jl_profils, event.getX(), event.getY());
                }
            }
        });

        // tabbed pane (yimin)
        jtp = new JTabbedPane();

        // split pane (yisar)
        jsp = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, scrollProfils, jtp);
        jsp.setDividerLocation(300);

        this.add(jsp, BorderLayout.CENTER);

        btn_enregistrer.addActionListener(e -> {
            String ps = tf_pseudo.getText().trim();
            String nom = tf_nom.getText().trim();
            String prenom = tf_prenom.getText().trim();

            if (!ps.isEmpty()) {
                if (findProfile(ps) != null) {
                    JOptionPane.showMessageDialog(this,
                            "Ce pseudo existe déjà!",
                            "Erreur",
                            JOptionPane.WARNING_MESSAGE);
                    return;
                }


                model.addElement(ps);


                DataProfil profil = new DataProfil(ps, nom, prenom);
                profiles.add(profil);

                tf_nom.setText("");
                tf_prenom.setText("");
                tf_pseudo.setText("");

                JOptionPane.showMessageDialog(this,
                        "Profil ajouté avec succès!",
                        "Succès",
                        JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this,
                        "Le pseudo ne peut pas être vide!",
                        "Erreur",
                        JOptionPane.WARNING_MESSAGE);
            }
        });

        lb_nom.addMouseListener(new EcouteurLabel(this));
        lb_prenom.addMouseListener(new EcouteurLabel(this));
        lb_pseudo.addMouseListener(new EcouteurLabel(this));

        tf_nom.addMouseListener(new EcouteurText(this));
        tf_prenom.addMouseListener(new EcouteurText(this));
        tf_pseudo.addMouseListener(new EcouteurText(this));
    }

    private DataProfil findProfile(String pseudo) {
        for (DataProfil p : profiles) {
            if (p.getPseudo().equals(pseudo)) {
                return p;
            }
        }
        return null;
    }
}