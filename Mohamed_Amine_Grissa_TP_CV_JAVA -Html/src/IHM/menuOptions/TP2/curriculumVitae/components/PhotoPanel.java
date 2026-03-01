package IHM.menuOptions.TP2.curriculumVitae.components;

import javax.swing.*;
import java.awt.*;
import java.io.File;

import static IHM.menuOptions.TP2.curriculumVitae.CVConstants.*;

// lehna zid il possibilité innek tnajjem t7ot taswira : lezemni nzid nifhemha chwaya !!!!

public class PhotoPanel extends JPanel {

    private JLabel lb_photo;
    private File photoChoisie = null;

    public PhotoPanel() {
        setLayout(new FlowLayout(FlowLayout.LEFT, 10, 0));
        setBackground(BG_COLOR);

        JButton btn_choisirPhoto = new JButton("Choisir une image");
        btn_choisirPhoto.setFont(FIELD_FONT);
        btn_choisirPhoto.addActionListener(e -> handlePhotoSelection());

        lb_photo = new JLabel("Aucune image sélectionnée");
        lb_photo.setFont(new Font(Font.SANS_SERIF, Font.ITALIC, 12));
        lb_photo.setForeground(GRAY_TEXT);

        add(btn_choisirPhoto);
        add(lb_photo);
    }

    private void handlePhotoSelection() {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Sélectionner une photo");

        javax.swing.filechooser.FileNameExtensionFilter filtreImage =
                new javax.swing.filechooser.FileNameExtensionFilter(
                        "Images (jpg, png, gif, bmp)", "jpg", "jpeg", "png", "gif", "bmp");
        fileChooser.setFileFilter(filtreImage);
        fileChooser.setAcceptAllFileFilterUsed(false);

        int resultat = fileChooser.showOpenDialog(this);
        if (resultat == JFileChooser.APPROVE_OPTION) {
            photoChoisie = fileChooser.getSelectedFile();
            lb_photo.setText(photoChoisie.getName());
            lb_photo.setForeground(HEADER_COLOR);
        }
    }

    public File getSelectedPhoto() {
        return photoChoisie;
    }
}
