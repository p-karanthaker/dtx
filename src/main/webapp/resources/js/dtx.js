$(document).ready(function () {
  var dp = $('#date').datepicker({
    autoClose: true,
    language: "en",
    minView: "months",
    view: "months",
    dateFormat: "MM yyyy",
    onSelect: function () {
      //generateCalendar(dp);
      getTimeCards(dp)
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

$('#mySidenav').click(function () {
  toggleNav();
});

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

/**
 * Generates a Calendar table based on the selected DatePicker date.
 * @param dp DatePicker object
 */
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

// AJAX Requests

/**
 * Get timecards for a specified period.
 */
function getTimeCards(dp) {
  "use strict";
  var period = new Date(dp.selectedDates);
  var xmlhttp;
  if (period === "") {
    // display error
  } else {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        //$('tbody').html(xmlhttp.responseText);
        // Create timecard divs
      }
    };
    period = period.getMonth() + "-" + period.getFullYear();
    xmlhttp.open("get", "/dtx/getTimecard?Period=" + period, true);
    xmlhttp.send();
  }
}

$('#newTimecard').click(function () {
  addTimeCard();
});

/**
 * Adds a new timecard entry.
 */
function addTimeCard() {
  var projectCode, projectTask, quantity, period, businessReason;
  var xmlhttp;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

    }
  };
  xmlhttp.open("post", "/dtx/addTimecard", true);
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlhttp.send("projectCode=" + projectCode
      + "&projectTask=" + projectTask
      + "&quantity=" + quantity
      + "&period=" + period
      + "&businessReason=" + businessReason);
}

/**
 * Gets details of selected timecard.
 */
function getTimecardDetails() {
  "use strict";
  var timecardId;
  var xmlhttp;
  if (timecardId === "") {
    // display error
  } else {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        //$('tbody').html(xmlhttp.responseText);
        // display timecard details
      }
    };
    xmlhttp.open("get", "/dtx/getTimecard?TimecardId=" + timecardId, true);
    xmlhttp.send();
  }
}
