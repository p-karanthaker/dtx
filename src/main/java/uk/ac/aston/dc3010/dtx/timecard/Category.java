package uk.ac.aston.dc3010.dtx.timecard;

public class Category {

  private int id;
  private String name;

  public Category(int id) {
    this.id = id;
  }

  public Category(String name) {
    this.name = name;
  }

  public int getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  @Override
  public String toString() {
    return "\nCategory: " + name;
  }
}
