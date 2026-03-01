package IHM;

import IHM.menuOptions.TP1.Border;
import IHM.menuOptions.TP1.FrameFlow;
import IHM.menuOptions.TP1.Grid;
import IHM.menuOptions.TP2.curriculumVitae.CurriculumVitae;
import IHM.menuOptions.TP2.gestionProfile.GestionProfils;

import javax.swing.*;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Tp_Java_Global extends JFrame {

    JMenuBar menuBar;
    JMenu menu_tp1, menu_tp2;
    JMenuItem item1_tp1, item2_tp1, item3_tp1, item1_tp2, item2_tp2;
    JDesktopPane desktop;

    public Tp_Java_Global(){

        setTitle("TP JAVA");
        setSize(920, 850);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        menuBar = new JMenuBar();

        menu_tp1 = new JMenu("TP 1");
        item1_tp1 = new JMenuItem("Flow");
        item2_tp1 = new JMenuItem("Border");
        item3_tp1 = new JMenuItem("Grid");

        menu_tp2 =  new JMenu("TP 2");
        item1_tp2 = new JMenuItem("Corriculum Vitae");
        item2_tp2 = new JMenuItem("Gestion Profils");

        menu_tp1.add(item1_tp1);
        menu_tp1.add(item2_tp1);
        menu_tp1.add(item3_tp1);

        menu_tp2.add(item1_tp2);
        menu_tp2.add(item2_tp2);

        menuBar.add(menu_tp1);
        menuBar.add(menu_tp2);

        item1_tp1.addActionListener(new EcouteurMenu());
        item2_tp1.addActionListener(new EcouteurMenu());
        item3_tp1.addActionListener(new EcouteurMenu());

        item1_tp2.addActionListener(new EcouteurMenu());
        item2_tp2.addActionListener(new EcouteurMenu());

        setJMenuBar(menuBar);

        desktop = new JDesktopPane();
        this.add(desktop, BorderLayout.CENTER);
    }

    class EcouteurMenu implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e){
            if (e.getSource() == item1_tp1) {
                FrameFlow f = new FrameFlow();
                f.setVisible(true);
                desktop.add(f);
            }

            if (e.getSource() == item2_tp1) {
                Border b = new Border();
                b.setVisible(true);
                desktop.add(b);
            }

            if (e.getSource() == item3_tp1) {
                Grid g = new Grid();
                g.setVisible(true);
                desktop.add(g);
            }

            if (e.getSource() == item1_tp2) {
                CurriculumVitae cv = new CurriculumVitae();
                cv.setVisible(true);
                desktop.add(cv);
            }

            if (e.getSource() == item2_tp2) {
                GestionProfils gp = new GestionProfils();
                gp.setVisible(true);
                desktop.add(gp);
            }
        }
    }

    public static void main(String[] args) {
        new Tp_Java_Global().setVisible(true);
    }

}
