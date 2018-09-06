package uk.ac.aston.dc3010.dtx.model;

public class User {

  private int id;
  private int employeeNum;
  private String firstName;
  private String lastName;
  private String businessUnit;

  public User(int id, int employeeNum, String firstName, String lastName, String businessUnit) {
    this.id = id;
    this.employeeNum = employeeNum;
    this.firstName = firstName;
    this.lastName = lastName;
    this.businessUnit = businessUnit;
  }

  public int getId() {
    return id;
  }

  public int getEmployeeNum() {
    return employeeNum;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public String getBusinessUnit() {
    return businessUnit;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("ID: ")
        .append(id)
        .append("\nEmployee Number: ")
        .append(employeeNum)
        .append("\nName: ")
        .append(lastName)
        .append(", ")
        .append(firstName)
        .append("\nBusiness Unit: ")
        .append(businessUnit);
    return sb.toString();
  }
}
