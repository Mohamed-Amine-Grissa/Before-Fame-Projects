package IHM.menuOptions.TP1;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;


public class Grid extends JInternalFrame   {
    JButton btn1, btn2, btn3, btn4, btn5, btn6;

    public Grid() {
        this.setTitle("Grid");
        this.setSize(920, 850);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setLayout(new GridLayout(2,3));

        setMaximumSize(new Dimension(920, 850));
        setResizable(true);

        btn1 = new JButton("Button 1");
        btn2 = new JButton("Button 2");
        btn3 = new JButton("Button 3");
        btn4 = new JButton("Button 4");
        btn5 = new JButton("Button 5");
        btn6 = new JButton("Button 6");

        this.add(btn1);
        this.add(btn2);
        this.add(btn3);
        this.add(btn4);
        this.add(btn5);
        this.add(btn6);

    }

    class EcouteurButton implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
        }
    }

}
