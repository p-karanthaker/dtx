package uk.ac.aston.dc3010.dtx.timecard;

import java.math.RoundingMode;
import java.text.DecimalFormat;

public class Hours {

  private String date;
  private float quantity;

  public Hours(String date, float quantity) {
    this.date = date;
    this.quantity = quantity;
  }

  public String getDate() {
    return date;
  }

  public float getQuantity() {
    return quantity;
  }

  @Override
  public String toString() {
    DecimalFormat df = new DecimalFormat("#.##");
    df.setRoundingMode(RoundingMode.CEILING);
    return String.format("(%s, %s)", date, df.format(quantity));
  }
}
