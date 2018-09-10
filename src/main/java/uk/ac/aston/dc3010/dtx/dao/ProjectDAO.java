package uk.ac.aston.dc3010.dtx.dao;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public class ProjectDAO {

  private DataSource dataSource = null;

  public ProjectDAO() {
    try {
      Context context = new InitialContext();
      Context environment = (Context) context.lookup("java:comp/env");
      dataSource = (DataSource) environment.lookup("jdbc/DTXDatabase");
    } catch (Exception e) {
      System.out.println("Exception: " + e.getMessage());
    }
  }

  public Map<Integer, String> getDetails(String table) {
    Map<Integer, String> details = new HashMap<>();

    try (Connection connection = dataSource.getConnection()) {
      if (connection != null) {
        final String query = "SELECT id, name FROM " + table;

        final PreparedStatement ps = connection.prepareStatement(query);
        final ResultSet rs = ps.executeQuery();
        while (rs.next()) {
          final int id = rs.getInt("id");
          final String name = rs.getString("name");
          details.put(id, name);
        }
      }
    } catch (SQLException e) {
      System.out.println("Exception: " + e.getMessage());
    }

    return details;
  }

  public Map<Integer, String> getProjectTasks(int projectId) {
    Map<Integer, String> tasks = new HashMap<>();

    try (Connection connection = dataSource.getConnection()) {
      if (connection != null) {
        final String query = "SELECT id, task FROM project_task WHERE project = ?";

        final PreparedStatement ps = connection.prepareStatement(query);
        ps.setInt(1, projectId);

        final ResultSet rs = ps.executeQuery();
        while (rs.next()) {
          final int id = rs.getInt("id");
          final String name = rs.getString("task");
          tasks.put(id, name);
        }
      }
    } catch (SQLException e) {
      System.out.println("Exception: " + e.getMessage());
    }

    return tasks;
  }
}
