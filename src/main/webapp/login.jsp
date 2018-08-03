<%--
  Created by IntelliJ IDEA.
  User: Karan
  Date: 28/07/2018
  Time: 15:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">
  <link rel="icon" href="/resources/images/capgemini-spade.png">

  <title>DTX: Sign In</title>

  <!-- Bootstrap core CSS -->
  <link href="/resources/css/bootstrap.css" rel="stylesheet">

  <!-- Custom styles for this template -->
  <link href="/resources/css/signin.css" rel="stylesheet">
</head>

<body>
<div class="text-center">
  <form class="form-signin" method="post" action="http://localhost:8080/dtx/login">
    <img class="mb-4" src="/resources/images/capgemini-logo.png" alt="" width="200">
    <h1 class="h3 mb-3 font-weight-normal">Sign in to DTX</h1>
    <label for="inputEmail" class="sr-only">CORP Username</label>
    <input name="username" type="text" id="inputEmail" class="form-control" placeholder="CORP\Username" required autofocus>
    <label for="inputPassword" class="sr-only">Password</label>
    <input name="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>
    <button class="btn btn-lg btn-primary btn-block" type="submit">Sign In</button>
  </form>

  <div class="alert alert-danger" role="alert">
    <h4 class="alert-heading">WARNING!</h4>
    <p>The DTX system provides access to Personal Data as defined by the Data Protection Act. Access to this information
      is provided to users to view or update their own timecard and expense details. Under no circumstances should you
      attempt to access another person's data, unless express authority is granted by the management of Capgemini. Abuse
      of this information could lead to disciplinary procedures, or legal action under the Computer Misuse Act.</p>
  </div>
</div>
</body>
</html>
