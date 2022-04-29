function getDateNow() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '/' + mm + '/' + yyyy;
    return today;
}
function getDateNowYMD() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = yyyy + '-' + mm + '-' + dd;
    return today;
}
function formatdate(elementId) {
    var fdt;
    var dt = document.getElementById(elementId).value;
    var day;
    var mon;
    var yr;
    if (dt.length > 0) {
        dt = dt.toUpperCase();
        dt = dt.replace(/'/g, '').replace(/./g, '').replace(/-/g, '');
        dt = dt.replace('JAN', '01').replace('FEB', '02').replace('MAR', '03').replace('APR', '04').replace('MAY', '05').replace('JUN', '06').replace('JUL', '07').replace('AUG', '08').replace('SEP', '09').replace('OCT', '10').replace('NOV', '11').replace('DEC', '12');
        day = dt.substr(0, 2);
        mon = dt.substr(2, 2);
        yr = dt.substr(4);
        if (yr.length == 2) {
            if (yr > 30) {
                yr = '19' + yr;
            }
            else {
                yr = '20' + yr;
            }
        }
        if ((dt.length < 6) || (dt.length > 10)) {
            alert("Invalid Date\nPlease Re-Enter");
            document.getElementById(elementId).focus();
        }
        else if (parseInt(day) >= 32) {
            alert("Invalid Date\nPlease Re-Enter");
            document.getElementById(elementId).focus();
        }

        else if (parseInt(mon) > 12) {
            alert("Invalid Date\nPlease Re-Enter");
            document.getElementById(elementId).focus();
        }
        else {
            fdt = day + '/' + mon + '/' + yr;
            document.getElementById(elementId).value = fdt;
        }
    }
}
function formatTime(elementId) {
    var dt = document.getElementById(elementId).value.replace(':', '').replace(';', '').replace('.', '').replace(',', '').replace('-', '');
    if (dt.length == 1) {
        document.getElementById(elementId).value = '0' + dt + ':00';
    }
    else if (dt.length == 2) {
        document.getElementById(elementId).value = dt + ':00';
    }
    else if (dt.length == 3) {
        var hr = pad(dt.substr(0, 1), 2);
        var min = dt.substr(1, 2);
        document.getElementById(elementId).value = hr + ':' + min;
    }
    else if (dt.length == 4) {
        var hr = dt.substr(0, 2);
        if (hr > 23) {
            alert('Invaild time.');
            return;
        }
        var min = dt.substr(2, 2);
        document.getElementById(elementId).value = hr + ':' + min;
    }
}
function formatdateYYYYMMDD(elementId) {
    var fdt;
    var dt = elementId.target.value;
    var day;
    var mon;
    var yr;
    if (dt.length > 0) {
        dt = dt.toUpperCase();
        dt = dt.replace(/[/.-]/g, '');
        dt = dt.replace('JAN', '01').replace('FEB', '02').replace('MAR', '03').replace('APR', '04').replace('MAY', '05').replace('JUN', '06').replace('JUL', '07').replace('AUG', '08').replace('SEP', '09').replace('OCT', '10').replace('NOV', '11').replace('DEC', '12');
        if (dt.length == 6) {
            yr = dt.substr(0, 2);
            if (yr > 30) {
                dt = '19' + dt;
            }
            else {
                dt = '20' + dt;
            }
        }
        yr = dt.substr(0, 4);
        mon = dt.substr(4, 2);
        day = dt.substr(6);
        if ((dt.length < 6) || (dt.length > 10)) {
            alert("Invalid Date\nPlease Re-Enter");
            elementId.target.focus();
        }
        else if (parseInt(day) >= 32) {
            alert("Invalid Date\nPlease Re-Enter");
            elementId.target.focus();
        }

        else if (parseInt(mon) > 12) {
            alert("Invalid Date\nPlease Re-Enter");
            elementId.target.focus();
        }
        else {
            fdt = yr + '-' + mon + '-' + day;
            elementId.target.value = fdt;
        }
    }
}
function formatDateTime(elementId) {
    var datetime = document.getElementById(elementId).value.split(" ");
    var dt = datetime[0].toUpperCase();
    var dtime = datetime[1].toUpperCase();

    var day;
    var mon;
    var yr;
    var fdt;
    if (datetime[0].length > 0) {

        dt = dt.replace(/'/g, '').replace(/./g, '').replace(/-/g, '');
        dt = dt.replace('JAN', '01').replace('FEB', '02').replace('MAR', '03').replace('APR', '04').replace('MAY', '05').replace('JUN', '06').replace('JUL', '07').replace('AUG', '08').replace('SEP', '09').replace('OCT', '10').replace('NOV', '11').replace('DEC', '12');
        day = dt.substr(0, 2);
        mon = dt.substr(2, 2);
        yr = dt.substr(4);
        if (yr.length == 2) {
            if (yr > 30) {
                yr = '19' + yr;
            }
            else {
                yr = '20' + yr;
            }
        }
        if ((dt.length < 6) || (dt.length > 10)) {
            alert("Invalid Date\nPlease Re-Enter");
            document.getElementById(elementId).focus();
        }
        else if (parseInt(day) >= 32) {
            alert("Invalid Date\nPlease Re-Enter");
            document.getElementById(elementId).focus();
        }

        else if (parseInt(mon) > 12) {
            alert("Invalid Date\nPlease Re-Enter");
            document.getElementById(elementId).focus();
        }
        else {
            fdt = day + '/' + mon + '/' + yr;
        }
    }

    var hr;
    var min;
    if (datetime[1].length > 0) {
        dtime = dtime.replace(':', '').replace(';', '').replace('.', '').replace(',', '').replace('-', '');
        if (dtime.length == 2) {
            hr = dtime;
            min = '00';
        }
        else if (dtime.length == 3) {
            hr = pad(dtime.substr(0, 1), 2);
            min = dtime.substr(1, 2);
        }
        else if (dtime.length == 4) {
            hr = dtime.substr(0, 2);
            if (hr > 23) {
                alert('Invaild time.');
                return;
            }
            min = dtime.substr(2, 2);
        }
    }
    document.getElementById(elementId).value = fdt + ' ' + hr + ':' + min;
}
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


function initMenu(mno, mnoc) {
    $('#main_menu li ul li a').css("color", "black");
    $('#main_menu li ul li a').css("font-size", "100%");
    $('#main_menu ul').hide();
    $('#main_menu ul:eq(' + mno + ')').show();
    $('#main_menu li ul li a:eq(' + mnoc + ')').css("color", "navy");
    $('#main_menu li ul li a:eq(' + mnoc + ')').css("font-size", "130%");
    $('#main_menu li a').click(function () {
        var checkElement = $(this).next();
        if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
            $('#main_menu ul:visible').slideUp('normal');
            return false;
        }
        else if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
            $('#main_menu ul:visible').slideUp('normal');
            checkElement.slideDown('normal');
            return false;
        }
    });
}
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("tblResult");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc"; 
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++; 
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

$(document).ready(function () {
    
    var a = getUrlParameter('mno');
    var b = ('' + a).split(".", 2);
    var d = b[1];
    a = b[0];
    if (a == null) {
        a = 10;
    }
    else {
        a = parseFloat(a);
    }
    if (d == null) {
        d = 50;
    }
    else {
        d = parseFloat(d);
    }
    
    initMenu(a, d);
    
    $("input:text, select").keyup(function (event) {
        if (event.keyCode == 13) {
            var inputs = $('#mainTable').find("input:text, select");
            if (inputs[inputs.index(this) + 1] != null) {
                inputs[inputs.index(this) + 1].focus();
            }
            event.preventDefault();
        }
    });
    $('.datein').datepicker({ dateFormat: 'yy-mm-dd' });
    $('.dategr').datepicker({ dateFormat: 'yy-mm-dd' });
    $('.datein').change(function (e) {
        formatdateYYYYMMDD(e);
    });
    $("#expcol").click(function () {
        if ($("#expcol").text() == "<<") {
            $("#tdmenu").css("width", "20px");
            $("#left_menu").css("width", "20px");
            $("#main_menu").hide();
            $("#expcol").text(">>");
        }
        else if ($("#expcol").text() == ">>") {
            $("#tdmenu").css("width", "213px");
            $("#left_menu").css("width", "210px");
            $("#main_menu").show();
            $("#expcol").text("<<");
        }
    });
    if (document.getElementById("frmMainDiv")) {
        document.getElementById("frmMainDiv").style.minHeight = (window.screen.height - 120) + 'px';
        window.status = '';
    }
    $('input[type=text]').bind('change', function () {
        $(this).val($(this).val().replace(/'/g, '').trim());
    });
    $(document).ajaxStart(function () {
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function () {
        $("#wait").css("display", "none");
    });
    $(".flip").click(function () {
        if ($(this).html().indexOf("Show") > -1) {
            $(this).html($(this).html().replace("Show", "Hide"));
        }
        else {
            $(this).html($(this).html().replace("Hide", "Show"));
        }
        $(this).next(".panel").slideToggle("slow");
        $(this).toggleClass('');
    });
});

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

