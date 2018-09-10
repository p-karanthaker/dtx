package uk.ac.aston.dc3010.dtx.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import uk.ac.aston.dc3010.dtx.dao.ProjectDAO;
import uk.ac.aston.dc3010.dtx.dao.TimecardDAO;
import uk.ac.aston.dc3010.dtx.dao.UserDAO;
import uk.ac.aston.dc3010.dtx.model.User;
import uk.ac.aston.dc3010.dtx.timecard.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Controller extends HttpServlet {

  private User user = null;
  private List<Timecard> cards = new ArrayList<>();
  private HttpSession session;
  private TimecardDAO timecardDAO;
  private ProjectDAO projectDAO;

  public void init() {
    timecardDAO = new TimecardDAO();
    projectDAO = new ProjectDAO();
  }

  public void destroy() {}

  protected void processRequest(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    final String action = req.getPathInfo();
    final String contextPath = req.getContextPath();
    final String path = contextPath + req.getServletPath();
    session = req.getSession(true);

    switch (action) {
      case "/login": // Authenticate a user.
        final String username = req.getParameter("username");
        final String password = req.getParameter("password");
        UserDAO userDAO = new UserDAO();
        if (userDAO.authenticate(username, password)) {
          this.user = userDAO.getUser();
          session.setAttribute("user", user);
          resp.sendRedirect(contextPath + "/index.jspx");
        } else {
          resp.sendRedirect(contextPath + "/login.jspx");
        }
        break;
      case "/app/logout": // Log a user out of the application.
        session.invalidate();
        resp.sendRedirect(contextPath + "/login.jspx");
        break;
      case "/app/getTimecards": // Return a list of timecards for a user in a given period.
        String period = req.getParameter("period");
        cards = timecardDAO.getTimecards(user.getId(), period);
        resp.setContentType("application/json");
        new Gson().toJson(cards, resp.getWriter());
        break;
      case "/app/getTimecardDetails": // Return the details of a given timecard.
        int id = Integer.parseInt(req.getParameter("id"));
        Timecard toReturn = null;
        for (Timecard card : cards) {
          if (card.getId() == id) {
            toReturn = card;
          }
        }
        resp.setContentType("application/json");
        if (toReturn != null) {
          new Gson().toJson(toReturn, resp.getWriter());
        } else {
          new Gson().toJson("error: 'No details found'", resp.getWriter());
        }
        break;
      case "/app/getInputFields": // Return the input fields required for a user form to fill out
                                  // new timecards
        resp.setContentType("application/json");
        String param = req.getParameter("project");
        int projectId = 0;
        if (param != null) {
          projectId = Integer.parseInt(param);
        }
        if (projectId > 0) {
          new Gson().toJson(projectDAO.getProjectTasks(projectId), resp.getWriter());
        } else {
          Map<Integer, String> categories = projectDAO.getDetails("time_category");
          Map<Integer, String> projects = projectDAO.getDetails("project_code");
          JsonObject categoryJson = new Gson().toJsonTree(categories).getAsJsonObject();
          JsonObject projectJson = new Gson().toJsonTree(projects).getAsJsonObject();
          JsonObject merged = new JsonObject();
          merged.add("categories", categoryJson);
          merged.add("projects", projectJson);
          new Gson().toJson(merged, resp.getWriter());
        }
        break;
      case "/app/addTimecard": // Adds a user submitted timecard form to the database
        int cat = Integer.parseInt(req.getParameter("category"));
        int pCode = Integer.parseInt(req.getParameter("projectCode"));
        int task = Integer.parseInt(req.getParameter("projectTask"));
        float quantity = Float.parseFloat(req.getParameter("quantity"));
        String newPeriod = req.getParameter("period");
        String businessReason = req.getParameter("businessReason");

        Category category = new Category(cat);
        Project project = new Project(pCode, task);
        Timecard tc = new Timecard(category, project, quantity, Status.APPROVED);
        List<Hours> hours = new ArrayList<>();
        int days = Integer.parseInt(req.getParameter("days"));
        for (int i = 0; i < days; i++) {
          String hourParam = "hours[" + i + "]";
          String date = req.getParameter(hourParam + "[date]");
          float booked = Float.parseFloat(req.getParameter(hourParam + "[quantity]"));
          hours.add(new Hours(date, booked));
        }
        tc.setHours(hours);

        if (businessReason != "") {
          tc.setBusinessReason(businessReason);
        }

        if (cat > 0 && pCode > 0 && task > 0 && quantity > 0) {
          timecardDAO.addTimecard(user.getId(), newPeriod, tc);
        }
        break;
      case "/app/deleteTimecard": // Removes a given timecard for the user.
        int timecardId = Integer.parseInt(req.getParameter("id"));
        timecardDAO.deleteTimecard(timecardId);
        break;
      default:
        resp.sendRedirect(contextPath + "/error.jspx");
        break;
    }
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    processRequest(req, resp);
  }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    processRequest(req, resp);
  }
}
