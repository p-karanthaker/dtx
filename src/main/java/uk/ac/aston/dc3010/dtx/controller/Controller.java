package uk.ac.aston.dc3010.dtx.controller;

import com.google.gson.Gson;
import uk.ac.aston.dc3010.dtx.dao.TimecardDAO;
import uk.ac.aston.dc3010.dtx.dao.UserDAO;
import uk.ac.aston.dc3010.dtx.model.User;
import uk.ac.aston.dc3010.dtx.timecard.Timecard;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Controller extends HttpServlet {

  private User user = null;
  private List<Timecard> cards = new ArrayList<>();
  private HttpSession session;

  public void init() {}

  public void destroy() {}

  protected void processRequest(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    final String action = req.getPathInfo();
    final String contextPath = req.getContextPath();
    final String path = contextPath + req.getServletPath();
    session = req.getSession(true);

    switch (action) {
      case "/login":
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
      case "/app/logout":
        session.invalidate();
        resp.sendRedirect(contextPath + "/login.jspx");
        break;
      case "/app/getTimecards":
        String period = req.getParameter("period");
        TimecardDAO dao = new TimecardDAO();
        cards = dao.getTimecards(user.getId(), period);
        resp.setContentType("application/json");
        new Gson().toJson(cards, resp.getWriter());
        break;
      case "/app/getTimecardDetails":
        System.out.println(cards);
      default:
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
