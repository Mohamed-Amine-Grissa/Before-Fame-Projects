package IHM.menuOptions.TP1;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;


public class FrameFlow extends JInternalFrame   {
    JButton btn1, btn2, btn3, btn4, btn5, btn6;

    public FrameFlow() {
        this.setTitle("Frame Flow");
        this.setSize(1920, 1080);
        this.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        this.setLayout(new FlowLayout());

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
