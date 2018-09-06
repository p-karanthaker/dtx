package uk.ac.aston.dc3010.dtx.timecard;

import java.util.List;

public class Timecard {

  private int id;
  private Category category;
  private Project project;
  private float quantity;
  private String businessReason;
  private Status status;
  private List<Hours> hours;

  public Timecard(Category category, Project project, float quantity, Status status) {
    this.id = id;
    this.category = category;
    this.project = project;
    this.quantity = quantity;
    this.status = status;
    this.hours = hours;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public Category getCategory() {
    return category;
  }

  public Project getProject() {
    return project;
  }

  public float getQuantity() {
    return quantity;
  }

  public String getBusinessReason() {
    return businessReason;
  }

  public void setBusinessReason(String businessReason) {
    this.businessReason = businessReason;
  }

  public Status getStatus() {
    return status;
  }

  public List<Hours> getHours() {
    return hours;
  }

  public void setHours(List<Hours> hours) {
    this.hours = hours;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("ID: ")
        .append(id)
        .append(category)
        .append(project)
        .append("\nBusiness Reason: ")
        .append(businessReason)
        .append("\nStatus: ")
        .append(status)
        .append("\nHours: ")
        .append(hours)
        .append("\n");
    return sb.toString();
  }
}
