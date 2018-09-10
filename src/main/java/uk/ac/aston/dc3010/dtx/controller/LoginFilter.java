package uk.ac.aston.dc3010.dtx.controller;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public class LoginFilter implements Filter {

  @Override
  public void init(FilterConfig config) throws ServletException {
    // Do nothing.
  }

  @Override
  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
      throws IOException, ServletException {
    HttpServletRequest request = (HttpServletRequest) req;
    HttpServletResponse response = (HttpServletResponse) res;
    HttpSession session = request.getSession(false);

    if (session == null || session.getAttribute("user") == null) {
      response.sendRedirect(
          request.getContextPath()
              + "/login.jspx"); // No logged-in user found, so redirect to login page.
    } else {
      chain.doFilter(req, res); // Logged-in user found, so just continue request.
    }
  }

  @Override
  public void destroy() {
    // Do nothing.
  }
}
