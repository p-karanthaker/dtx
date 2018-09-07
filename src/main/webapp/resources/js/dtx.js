$(document).ready(function () {
  var dp = $('#date').datepicker({
    autoClose: true,
    language: "en",
    minView: "months",
    view: "months",
    dateFormat: "MM yyyy",
    onSelect: function () {
      getTimecards(getPeriod(dp));
      $('#detail').html("Click timecard details to view more information.");
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

// Helper Functions

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

function getOptions(obj) {
  var options = "";
  $.each(obj, function (key, val) {
    options += $('<option></option>').val(key).html(val).prop('outerHTML');
  });
  return options;
}

function calculateHours(calendar, period) {
  var hours = [];
  calendar.each(function() {
    var day = $(this).find('label').html();
    var hour = $(this).find('input').val();
    if (hour > 0) {
      var date = period + "-" + day;
      var arr = {};
      arr["date"] = date;
      arr["quantity"] = hour;
      hours.push(arr);
    }
  });
  return hours
}

function getPeriod(dp) {
  var period = new Date(dp.selectedDates);
  var month = period.getMonth() + 1;
  period = period.getFullYear() + "-" + month;
  return period;
}

// Event Handlers

$('#timecards').on('click', 'button', function () {
  getTimecardDetails($(this).attr('id'));
});

$('#submitTimecard').click(function () {
  addTimeCard();
});

$('#newTimecardModal').on('hide.bs.modal', function () {
  $('#businessReason').val('');
  $('#totalTime').val(0);
});

$('#newTimeEntry').on('change', 'input', function () {
  var hours = calculateHours($('#newTimeEntry td'), "");
  var total = 0;
  for (var h in hours) {
    total += Number(hours[h].quantity);
  }
  $('#totalTime').val(total);
});

// AJAX Requests

/**
 * Get timecards for a specified period.
 */
function getTimecards(period) {
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

/**
 * Adds a new timecard entry.
 */
function addTimeCard() {
  var category = $('#newCategory').val();
  var projectCode = $('#newProject').val();
  var projectTask = $('#newTask').val();
  var quantity = $('#totalTime').val();
  var period = getPeriod($('#date').data('datepicker'));
  var businessReason = $('#businessReason').val();
  var hours = calculateHours($('#newTimeEntry td'), period);
  if (hours.length > 0) {
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
        "hours": hours,
        "days" : hours.length
      },
      success: function () {
        $('#newTimecardModal').modal('hide');
        getTimecards(period);
      }
    });
  }
}

/**
 * Gets details of selected timecard.
 */
function getTimecardDetails(timecardId) {
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
}

/**
 * Get Project Tasks for a given project ID.
 */
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

/**
 * Get Time Categories and Projects for input fields on adding a new timecard.
 */
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