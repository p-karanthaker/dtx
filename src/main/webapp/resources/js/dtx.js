$(document).ready(function () {
  var dp = $('#date').datepicker({
    autoClose: true,
    language: "en",
    minView: "months",
    view: "months",
    dateFormat: "MM yyyy",
    onSelect: function () {
      getTimecards(dp);
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
function generateCalendar(dp, hours) {
  var currentDate = new Date(dp.selectedDates);
  var days = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0).getDate();
  var start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  var calendar = $('<div><table class="calendar-table">' +
      '<thead class="calendar-header"><tr><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th><th>S</th></tr>' +
      '</thead><tbody class="weekdays"></tbody></table></div>');

  var tbody = $('.weekdays', calendar)[0];
  //var calendar = document.getElementsByClassName('calendar-table')[0].getElementsByTagName('tbody')[0];
  var i;
  for (i = 1; i<36; i++)
  {
    if (i % 7 == 1) {
      var newRow = tbody.insertRow(tbody.rows.length);
    }
    var newCell = newRow.insertCell(-1);
    if (i >= start && i < days + start) {
      var day = i - start + 1;
      day = ('0'+day).slice(-2);

      var tempCell;
      var label = "day-" + day;
      for (let entry of hours) {
        var date = new Date(entry['date']).getDate();
        if (day == date) {
          tempCell = '<td><label for="' + label + '">'+ day + '</label> <input type="text" value="'+ entry['quantity'] +'" id="' + label + '"/></td>';
          break;
        } else {
          tempCell = '<td><label for="' + label + '">'+ day + '</label> <input type="text" id="' + label + '"/></td>';
        }
      }
      newCell.innerHTML = tempCell;
    } else {
      newCell.innerHTML = '<td></td>';
    }
  }
  return calendar.html();
}

// AJAX Requests

/**
 * Get timecards for a specified period.
 */
function getTimecards(dp) {
  var period = new Date(dp.selectedDates);
  var month = period.getMonth() + 1;
  period = period.getFullYear() + "-" + month;
  
  $.ajax({
    type : "GET",
    url : "/dtx/app/getTimecards",
    data : {
      "period" : period
    },
    success : function (timecards) {
      var html = "";
      if (!$.isArray(timecards) || !timecards.length) {
        html = "Nothing to display.";
      } else {
        timecards.forEach(function (entry) {
          html +=
              '<div class="card mb-2 timecard">' +
              '<div class="card-header py-1">' + entry['category']['name'] + '<span class="badge badge-success float-right">' +
              entry['status'] + '</span>' +
              '</div>' +
              '<div class="card-body py-1">' +
              '<b>From: </b>' + entry['hours'][0]['date'] + ' <b>To: </b>' + entry['hours'][entry['hours'].length - 1]['date'] + '<br/>' +
              '<b>Project: </b>' + entry['project']['name'] + '<br/>' +
              '<b>Task: </b>' + entry['project']['task'] + '<br/>' +
              '<b>Quantity: </b>' + entry['quantity'] + ' hours<br/>' +
              '</div>' +
              '<button class="btn btn-sm btn-outline-primary time-button" id="' + entry['id'] + '">Details</button>' +
              '</div>';
        });
      }
      $('#timecards').html(html);
    }
  });
}

$('#timecards').on('click', 'button', function () {
  var timecardId = $(this).attr('id');
  $.ajax({
    type : "GET",
    url : "/dtx/app/getTimecardDetails",
    data : {
      "id" : timecardId
    },
    success : function (timecard) {
      var html =
          '<h4 class="card-title">' + timecard['category']['name'] + '</h4>' +
          '<h5>Project: ' + timecard['project']['name'] + ' | Task: ' + timecard['project']['task'] + '</h5>';
      var dp = $('#date').data('datepicker');
      html += generateCalendar(dp, timecard['hours']);
      $('#detail').html(html);
    }
  });
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
  xmlhttp.open("post", "/dtx/app/addTimecard", true);
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
    xmlhttp.open("get", "/dtx/app/getTimecard?TimecardId=" + timecardId, true);
    xmlhttp.send();
  }
}
