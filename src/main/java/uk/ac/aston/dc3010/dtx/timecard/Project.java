package uk.ac.aston.dc3010.dtx.timecard;

public class Project {

  private int projectCode;
  private String name;
  private int taskId;
  private String task;

  public Project(int projectCode, int taskId) {
    this.projectCode = projectCode;
    this.taskId = taskId;
  }

  public Project(String name, String task) {
    this.name = name;
    this.task = task;
  }

  public String getName() {
    return name;
  }

  public String getTask() {
    return task;
  }

  public int getProjectCode() {
    return projectCode;
  }

  public int getTaskId() {
    return taskId;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("\nProject: " + name).append("\nTask: " + task);
    return sb.toString();
  }
}
