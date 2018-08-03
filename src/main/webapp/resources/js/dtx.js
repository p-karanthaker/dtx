function toggleNav() {
  var nav = document.getElementById("mySidenav");
  if (parseInt(nav.style.width) > 0) {
    nav.style.width = "0";
  } else {
    nav.style.width = "250px";
  }
}

document.onclick = function () {
  //toggleNav();
};
