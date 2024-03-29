package uk.ac.aston.dc3010.dtx.dao;

import uk.ac.aston.dc3010.dtx.model.User;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Data Access Object class for the employee database table.
 *
 * <p>Authenticates a user and provides a User object to use for sessions.
 */
public class UserDAO {

  private DataSource dataSource = null;
  private User user = null;

  public UserDAO() {
    try {
      Context context = new InitialContext();
      Context environment = (Context) context.lookup("java:comp/env");

      dataSource = (DataSource) environment.lookup("jdbc/DTXDatabase");
    } catch (Exception e) {
      System.out.println("Exception: " + e.getMessage());
    }
  }

  /**
   * Authenticate a user using the provided username and password.
   *
   * @param username the username of the user.
   * @param password the password of the user.
   * @return true if credentials are valid.
   */
  public boolean authenticate(String username, String password) {
    try (Connection connection = dataSource.getConnection()) {
      if (connection != null) {
        final String query = "SELECT * FROM employee WHERE username = ? AND password = ?";

        final PreparedStatement ps = connection.prepareStatement(query);
        ps.setString(1, username);
        ps.setString(2, password);

        final ResultSet rs = ps.executeQuery();
        String user = null;
        String pword = null;
        while (rs.next()) {
          int id = rs.getInt("id");
          int empNum = rs.getInt("emp_num");
          String firstName = rs.getString("first_name");
          String lastName = rs.getString("last_name");
          String businessUnit = rs.getString("business_unit");
          user = rs.getString("username");
          pword = rs.getString("password");
          this.user = new User(id, empNum, firstName, lastName, businessUnit);
        }

        if ((user != null && pword != null) && (user.equals(username) && pword.equals(password))) {
          return true;
        }
      }
    } catch (SQLException e) {
      System.out.println("Exception: " + e.getMessage());
    }

    return false;
  }

  /**
   * Get the User object.
   *
   * @return a User object to use in a session.
   */
  public User getUser() {
    return user;
  }
}
