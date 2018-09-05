package uk.ac.aston.dc3010.dtx.model;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Users {

  private DataSource dataSource = null;

  public Users() {

    try {
      Context context = new InitialContext();
      Context environment = (Context) context.lookup("java:comp/env");

      dataSource = (DataSource) environment.lookup("jdbc/DTXDatabase");
    } catch (Exception e) {
      System.out.println("Exception: " + e.getMessage());
    }
  }

  public boolean authenticate(String username, String password) {
    try (Connection connection = dataSource.getConnection()) {
      if (connection != null) {
        final String query =
            "SELECT username, password FROM employee WHERE username = ? AND password = ?";

        final PreparedStatement ps = connection.prepareStatement(query);
        ps.setString(1, username);
        ps.setString(2, password);

        final ResultSet rs = ps.executeQuery();
        String user = null;
        String pword = null;
        while (rs.next()) {
          user = rs.getString("username");
          pword = rs.getString("password");
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
}
