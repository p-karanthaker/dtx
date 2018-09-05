package uk.ac.aston.dc3010.dtx.dao;

import org.apache.commons.dbcp2.BasicDataSource;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.mock.jndi.SimpleNamingContextBuilder;
import uk.ac.aston.dc3010.dtx.timecard.*;

import java.util.ArrayList;
import java.util.List;

public class TimecardTest {

  private static TimecardDAO dao;

  @BeforeClass
  public static void setUp() throws Exception {
    BasicDataSource dataSource = new BasicDataSource();
    dataSource.setDriverClassName("org.sqlite.JDBC");
    dataSource.setUrl("jdbc:sqlite::resource:db/dtx.db");
    SimpleNamingContextBuilder builder = new SimpleNamingContextBuilder();
    builder.bind("java:comp/env/jdbc/DTXDatabase", dataSource);
    builder.activate();

    dao = new TimecardDAO();
  }

  @Test
  public void testGetTimecards() {
    List<Timecard> cards = dao.getTimecards(1, "2018-08-01");
    for (Timecard t : cards) {
      System.out.println(t);
    }
  }

  @Test
  public void addTimecards() throws Exception {
    Category category = new Category(1);
    Project project = new Project(1, 1);
    float quantity = 7.5f;
    Timecard tc = new Timecard(category, project, quantity, Status.PENDING);
    List<Hours> hours = new ArrayList<>();
    hours.add(new Hours("2018-09-10", 7.5f));
    tc.setHours(hours);
    dao.addTimecard(1, "2018-09-01", tc);
  }
}
