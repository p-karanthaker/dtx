$(document).ready(function () {
  var dp = $('#date').datepicker({
    autoClose: true,
    language: "en",
    minView: "months",
    view: "months",
    dateFormat: "MM yyyy",
    onSelect: function () {
      generateCalendar(dp);
    }
  }).data('datepicker');
  dp.selectDate(new Date());

  $('#datepicker').click(function () {
    dp.show();
  });

  $('#date-prev').click(function () {
    toggleDate(true, dp);
  });

  $('#date-next').click(function () {
    toggleDate(false, dp);
  });
});

document.getElementById("mySidenav").onclick = function () {
  toggleNav();
};

function toggleNav() {
  var nav = document.getElementById("mySidenav");
  if (parseInt(nav.style.width) > 0) {
    nav.style.width = "0";
  } else {
    nav.style.width = "250px";
  }
}

function toggleDate(previous, dp) {
  var currentDate = new Date(dp.selectedDates);
  var month = currentDate.getMonth();
  if (previous) {
    month = month - 1;
  } else {
    month = month + 1;
  }
  currentDate.setMonth(month);
  dp.selectDate(currentDate);
}

function generateCalendar(dp) {
  var currentDate = new Date(dp.selectedDates);
  var days = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0).getDate();
  var start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  var calendar = document.getElementsByClassName('calendar-table')[0].getElementsByTagName('tbody')[0];
  var i;
  for (i = 1; i<36; i++)
  {
    if (i % 7 == 1) {
      var newRow = calendar.insertRow(calendar.rows.length);
    }
    var newCell = newRow.insertCell(-1);
    if (i >= start && i < days + start) {
      var day = i - start + 1;
      day = ('0'+day).slice(-2);
      newCell.innerHTML = "<td>"+ day +" <input type=\"text\"/></td>";
    } else {
      newCell.innerHTML = '<td></td>';
    }
  }
}
