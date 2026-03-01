package IHM.menuOptions.TP1;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;


public class Border extends JInternalFrame   {
    JButton btnNorth, btnSouth, btnEast, btnWest, btnCenter;

    public Border() {
        this.setTitle("Border");
        this.setSize(920, 850);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setLayout(new BorderLayout());

        setMaximumSize(new Dimension(1920, 1080));
        setResizable(true);

        btnNorth = new JButton("NORTH");
        btnSouth = new JButton("SOUTH");
        btnEast = new JButton("EAST");
        btnWest = new JButton("WEST");
        btnCenter = new JButton("CENTER");

        this.add(btnNorth, BorderLayout.NORTH);
        this.add(btnSouth, BorderLayout.SOUTH);
        this.add(btnEast, BorderLayout.EAST);
        this.add(btnWest, BorderLayout.WEST);
        this.add(btnCenter, BorderLayout.CENTER);

    }

    class EcouteurButton implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
        }
    }

}
