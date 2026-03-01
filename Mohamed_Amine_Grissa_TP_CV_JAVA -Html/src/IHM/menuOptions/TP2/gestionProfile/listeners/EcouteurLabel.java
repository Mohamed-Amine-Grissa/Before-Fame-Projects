package IHM.menuOptions.TP2.gestionProfile.listeners;

import IHM.menuOptions.TP2.gestionProfile.GestionProfils;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import static java.awt.Color.*;

public class EcouteurLabel extends MouseAdapter {

    private GestionProfils gp;

    public EcouteurLabel(GestionProfils gp) {
        this.gp = gp;
    }


    public void mouseEntered(MouseEvent e) {
        JLabel source = (JLabel) e.getSource();

        if (source == gp.lb_nom) {
            source.setForeground(Color.RED);
        }

        if (source == gp.lb_prenom) {
            source.setForeground(Color.BLUE);
        }

        if (source == gp.lb_pseudo) {
            source.setForeground(Color.GREEN);
        }

    }

    @Override
    public void mouseExited(MouseEvent e) {
            JLabel source = (JLabel) e.getSource();
            source.setForeground(BLACK);
    }
}
