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
      for (var entry in hours) {
        var date = new Date(hours[entry]['date']).getDate();
        if (day == date) {
          tempCell = '<td><label for="' + label + '">'+ day + '</label><br/><input type="text" value="'+ hours[entry]['quantity'] +'" id="' + label + '"/></td>';
          break;
        } else {
          tempCell = '<td><label for="' + label + '">'+ day + '</label><br/><input type="text" id="' + label + '"/></td>';
        }
      }
      newCell.innerHTML = tempCell;
    } else {
      newCell.innerHTML = '<td></td>';
    }
  }
  return calendar.html();
}

$('#newTimecard').click(function () {
  var dp = $('#date').data('datepicker');
  var calendar = generateCalendar(dp, [-1]);
  calendar = $(calendar).addClass('modal-calendar');
  $('.modal-body form #newTimeEntry').html(calendar);

  $.ajax({
    type: "GET",
    url: "/dtx/app/getInputFields",
    success: function (fields) {
      var categories = fields.categories;
      var projects = fields.projects;
      $('#newCategory').html(getOptions(categories));
      $('#newProject').html(getOptions(projects));
      $('#newProject').trigger('change');
    }
  });
});

$('#newProject').change(function () {
  var projectId = $('#newProject option:selected').val();
  $.ajax({
    type: "GET",
    url: "/dtx/app/getInputFields",
    data: {
      "project": projectId
    },
    success: function (tasks) {
      $('#newTask').html(getOptions(tasks));
    }
  });
});

function getOptions(obj) {
  var options = "";
  $.each(obj, function (key, val) {
    options += $('<option></option>').val(key).html(val).prop('outerHTML');
  });
  return options;
}

$('#submitTimecard').click(function () {
  var category = "";
  var projectCode = "";
  var projectTask = "";
  var quantity = "";
  var period = "";
  var businessReason = "";
  var hours = [ {"date":"", "quantity": 1} ];
  $.ajax({
    type: "POST",
    url: '/dtx/app/addTimecard',
    data: {
      "category": category,
      "projectCode": projectCode,
      "projectTask": projectTask,
      "quantity": quantity,
      "period": period,
      "businessReason": businessReason,
      "hours": hours
    },
    success: function (data) {
      console.log(data);
      $('#newTimecardModal').modal('hide');
    }
  });

})

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
          '<h4>Reference: 111</h4>' +
          '<form>' +
            '<div class="input-group input-group-sm mb-1">' +
              '<div class="input-group-prepend">' +
                '<label class="input-group-text" for="category">Category</label>' +
              '</div>' +
              '<select class="form-control" aria-label="Category" id="category" disabled="disabled">' +
                '<option>' + timecard['category']['name'] + '</option>' +
              '</select>' +
            '</div>' +
            '<div class="input-group input-group-sm mb-1">' +
              '<div class="input-group-prepend">' +
                '<label class="input-group-text" for="project">Project</label>' +
              '</div>' +
              '<input type="text" class="form-control" aria-label="Project" id="project" value="' + timecard['project']['name'] + '" disabled="disabled"/>' +
              '<div class="input-group-prepend">' +
                '<label class="input-group-text" for="task">Task</label>' +
              '</div>' +
              '<select class="form-control" aria-label="Task" id="task" disabled="disabled">' +
                '<option>' + timecard['project']['task'] + '</option>' +
              '</select>' +
            '</div>' +
            '<div class="input-group input-group-sm mb-1">' +
              '<div class="input-group-prepend">' +
                '<label class="input-group-text" for="hours">Time Booked</label>' +
              '</div>' +
              '<input type="text" class="form-control" aria-label="Hours" id="hours" value="' + timecard['quantity'] + ' Hours" disabled="disabled"/>' +
            '</div>' +
          '</form>';
      var dp = $('#date').data('datepicker');
      html += generateCalendar(dp, timecard['hours']);
      var businessReason = timecard['businessReason'];
      if (typeof businessReason === "undefined") {
        businessReason = "";
      }
      html +=
          '<br />' +
          '<div class="form-group">' +
          '<label for="business-reason">Business Reason:</label>' +
          '<textarea class="form-control" rows="5" id="business-reason" disabled="disabled">' + businessReason + '</textarea>' +
          '</div>';
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
