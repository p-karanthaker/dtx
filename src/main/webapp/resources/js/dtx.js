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

$(document).ready(function () {
  var dp = $('#date').datepicker({
    autoClose: true,
    language: "en",
    minView: "months",
    view: "years",
    dateFormat: "MM yyyy"
  }).data('datepicker');
  dp.selectDate(new Date());

  $('#date').text(new Date());

  $('#datepicker').click(function () {
    dp.show();
  });
});
