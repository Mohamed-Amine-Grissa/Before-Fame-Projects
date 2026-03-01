package IHM.menuOptions.TP2.gestionProfile.ui;

import IHM.menuOptions.TP2.gestionProfile.GestionProfils;

import javax.swing.*;

public class PopUpMenu extends JPopupMenu {
    JMenuItem jmi1, jmi2, jmi3;
    GestionProfils gp ;
    boolean Element = true;

    public PopUpMenu(GestionProfils gp) {

        this.gp = gp;

        jmi1 = new JMenuItem("Modifier");
        jmi2 = new JMenuItem("Supprimer");
        jmi3 = new JMenuItem("Supprimer tout");

        this.add(jmi1);
        this.add(jmi2);
        this.add(jmi3);

        jmi2.addActionListener(e -> {
            String selected = gp.jl_profils.getSelectedValue();
            if (selected != null) {
                gp.model.removeElement(selected);
            }
        });

        jmi3.addActionListener(e -> {
            gp.model.clear();
            gp.jtp.removeAll();
        });

        jmi1.addActionListener(e -> {
            String selected = gp.jl_profils.getSelectedValue();
            if (selected != null) {
                gp.tf_pseudo.setText(selected);
                gp.tf_nom.setText("");
                gp.tf_prenom.setText("");
            }
        });
    }

    public void Mode1() {
        jmi1.setVisible(true);
        jmi2.setVisible(true);
        jmi3.setVisible(true);
    }

    public void Mode2() {
        jmi1.setVisible(false);
        jmi2.setVisible(false);
        jmi3.setVisible(true);
    }
}
