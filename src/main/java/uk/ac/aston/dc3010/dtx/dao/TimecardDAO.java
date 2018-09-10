package uk.ac.aston.dc3010.dtx.dao;

import uk.ac.aston.dc3010.dtx.timecard.*;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TimecardDAO {

  private DataSource dataSource = null;

  public TimecardDAO() {
    try {
      Context context = new InitialContext();
      Context environment = (Context) context.lookup("java:comp/env");
      dataSource = (DataSource) environment.lookup("jdbc/DTXDatabase");
    } catch (Exception e) {
      System.out.println("Exception: " + e.getMessage());
    }
  }

  /**
   * Add a new timecard to the database.
   *
   * @param employeeId the employee who is adding the timecard.
   * @param period the period this timecard is for.
   * @param tc the timecard object to insert into the database.
   */
  public void addTimecard(int employeeId, String period, Timecard tc) {
    if (tc.getHours().isEmpty()) {
      System.out.println("Empty hours");
      return;
    }

    try (Connection connection = dataSource.getConnection()) {
      if (connection != null) {
        // Update timecard
        String query =
            "INSERT INTO timecard "
                + "(employee, category, project_code, project_task, quantity, period, business_reason, status)"
                + "VALUES (?,?,?,?,?,?,?,?)";

        PreparedStatement ps = connection.prepareStatement(query);
        ps.setInt(1, employeeId);
        ps.setInt(2, tc.getCategory().getId());
        ps.setInt(3, tc.getProject().getProjectCode());
        ps.setInt(4, tc.getProject().getTaskId());
        ps.setFloat(5, tc.getQuantity());
        ps.setString(6, period);
        ps.setString(7, tc.getBusinessReason());
        ps.setInt(8, tc.getStatus().getCode());

        int success = ps.executeUpdate();

        if (success == 1) {
          ResultSet rs = ps.getGeneratedKeys();
          int timecardId = 0;
          if (rs.next()) {
            timecardId = rs.getInt(1);
          }

          query = "INSERT INTO timecard_hours (timecard, date, quantity) VALUES (?,?,?)";
          ps = connection.prepareStatement(query);

          for (Hours hours : tc.getHours()) {
            ps.setInt(1, timecardId);
            ps.setString(2, hours.getDate());
            ps.setFloat(3, hours.getQuantity());
            ps.addBatch();
          }
          ps.executeBatch();
        }
      }
    } catch (SQLException e) {
      System.out.println("Exception: " + e.getMessage());
    }
  }

  /**
   * Retrieve timecards for an employee in a given period.
   *
   * @param employeeId the employee whose timecards are being retrieved.
   * @param period the period in which to find timecards.
   * @return a List of Timecard objects.
   */
  public List<Timecard> getTimecards(int employeeId, String period) {
    final List<Timecard> timecards = new ArrayList<>();
    try (Connection connection = dataSource.getConnection()) {
      if (connection != null) {
        String query =
            "SELECT tc.id, tcat.name AS category, pc.name AS project, pt.task, quantity, business_reason, status.name \n"
                + "FROM timecard AS tc\n"
                + "INNER JOIN time_category AS tcat ON tc.category = tcat.id\n"
                + "INNER JOIN project_code AS pc ON tc.project_code = pc.id\n"
                + "INNER JOIN project_task AS pt ON tc.project_task = pt.id\n"
                + "INNER JOIN status ON tc.status = status.id\n"
                + "WHERE employee = ? AND period = ?";

        PreparedStatement ps = connection.prepareStatement(query);
        ps.setInt(1, employeeId);
        ps.setString(2, period);

        ResultSet rs = ps.executeQuery();
        while (rs.next()) {
          final int id = rs.getInt("id");
          final Category category = new Category(rs.getString("category"));
          final String projectName = rs.getString("project");
          final String task = rs.getString("task");
          final Project project = new Project(projectName, task);
          final float quantity = rs.getFloat("quantity");
          final String businessReason = rs.getString("business_reason");
          final Status status = Status.valueOf(rs.getString("name"));

          Timecard timecard = new Timecard(category, project, quantity, status);
          timecard.setId(id);
          if (businessReason != null && !businessReason.isEmpty())
            timecard.setBusinessReason(businessReason);
          timecards.add(timecard);
        }

        // Get Timecard hours
        for (Timecard tc : timecards) {
          final List<Hours> hoursList = new ArrayList<>();
          query = "SELECT date, quantity FROM timecard_hours WHERE timecard = ?";
          ps = connection.prepareStatement(query);
          ps.setInt(1, tc.getId());

          rs = ps.executeQuery();
          while (rs.next()) {
            final String date = rs.getString("date");
            final float quantity = rs.getFloat("quantity");
            final Hours hours = new Hours(date, quantity);
            hoursList.add(hours);
          }
          tc.setHours(hoursList);
        }
      }
    } catch (SQLException e) {
      System.out.println("Exception: " + e.getMessage());
    }
    return timecards;
  }

  /**
   * Removes a timecard for a user from the database.
   *
   * @param timecardId the id of the timecard to remove.
   * @return true if the delete is successful.
   */
  public boolean deleteTimecard(int timecardId) {
    try (Connection connection = dataSource.getConnection()) {
      if (connection != null) {
        final String query = "DELETE FROM timecard_hours WHERE timecard = ?";
        final String query2 = "DELETE FROM timecard WHERE id = ?";
        String[] queries = {query, query2};
        for (String q : queries) {
          final PreparedStatement ps = connection.prepareStatement(q);
          ps.setInt(1, timecardId);
          ps.executeUpdate();
        }
        return true;
      }
    } catch (SQLException e) {
      System.out.println("Exception: " + e.getMessage());
    }
    return false;
  }
}
