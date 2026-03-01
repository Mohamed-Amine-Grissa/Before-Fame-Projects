package IHM.menuOptions.TP2.gestionProfile.listeners;

import IHM.menuOptions.TP2.gestionProfile.GestionProfils;

import javax.swing.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;


public class EcouteurText extends MouseAdapter {

    private GestionProfils gp;

    public EcouteurText(GestionProfils gp) {
        this.gp = gp;

    }

    public void mouseEntered(MouseEvent e) {
        JTextField source = (JTextField) e.getSource();


        if (source == gp.tf_pseudo) {
            gp.lb_Help.setText("Veuillez entrer votre pseudo : (des caractères uniquement !!!)");
        }

        if (source == gp.tf_nom) {
            gp.lb_Help.setText("Veuillez votre nom : (des caractères uniquement !!!)");
        }

        if (source == gp.tf_prenom) {
            gp.lb_Help.setText("Veuillez votre prenom : (des caractères uniquement !!!)");
        }

    }


    @Override
    public void mouseExited(MouseEvent e) {
        gp.lb_Help.setText("Help");
    }

}
