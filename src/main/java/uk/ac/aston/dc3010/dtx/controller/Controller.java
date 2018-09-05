package uk.ac.aston.dc3010.dtx.controller;

import uk.ac.aston.dc3010.dtx.model.*;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.util.stream.*;

public class Controller extends HttpServlet {

  private Users users;
  private HttpSession session;

  public void init() {
    users = new Users();
  }

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
        Users users = new Users();
        if (users.authenticate(username, password)) {
          session.setAttribute("user", username);

          resp.sendRedirect(contextPath + "/index.jspx");
        } else {
          resp.sendRedirect(contextPath + "/login.jspx");
        }
        break;
      case "/logout":
        session.invalidate();
        resp.sendRedirect(contextPath + "/login.jspx");
      default:
        System.out.println(action);
        System.out.println(req.getReader().lines().collect(Collectors.joining(System.lineSeparator())));
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
