package IHM.menuOptions.TP2.curriculumVitae.components;

import javax.swing.*;
import java.awt.*;
import java.util.Calendar;
import java.util.Date;

import static IHM.menuOptions.TP2.curriculumVitae.CVConstants.FIELD_FONT;

// hethi lahya bil option mte3 choix mte3 il date

public class DateSpinnerFactory {

    public static JSpinner create() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(2000, Calendar.JANUARY, 1);
        Date initDate = calendar.getTime();

        calendar.set(1999, Calendar.JANUARY, 1);
        Date minDate = calendar.getTime();
        Date maxDate = new Date();

        SpinnerDateModel model = new SpinnerDateModel(initDate, minDate, maxDate, Calendar.DAY_OF_MONTH);
        JSpinner spinner = new JSpinner(model);

        JSpinner.DateEditor editor = new JSpinner.DateEditor(spinner, "dd/MM/yyyy");
        spinner.setEditor(editor);
        spinner.setPreferredSize(new Dimension(120, 28));
        spinner.setFont(FIELD_FONT);

        return spinner;
    }
}