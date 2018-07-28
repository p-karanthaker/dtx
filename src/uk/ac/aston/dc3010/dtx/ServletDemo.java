package uk.ac.aston.dc3010.dtx;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;

public class ServletDemo extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    PrintWriter out = resp.getWriter();
    out.print("<h1>Hello Servlet</h1>");
  }

}
