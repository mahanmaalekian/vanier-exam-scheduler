function removeFromCalendar(id)
{
    const tableRow = document.getElementById(id);
    id = id.replace('tr-', '');
    //console.log("in remove");
    id = parseInt(id);

    tableRow.remove();
    let tableBody = document.getElementsByTagName("tbody")[0];
    if (tableBody && tableBody.rows.length === 0) {
        let body = document.getElementById('calendar-body');
        body.innerHTML = `<p>Calendar is empty</p>`;
    }

    fetch('/remove_from_calendar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),  // Include the CSRF token
        },
        body: JSON.stringify({
            id: id

        })
    })
    .then(response => {
        if(response.status != 200){
            return response.json().then(errorData => {
                alert(errorData.error);
            })
        }
    });
}

function getICSEventFromCalendar()
{
    // Get all <tr> elements in the table body
    const rows = document.querySelectorAll('tbody tr');

    let allEvents = '';
    // Loop through each row and log its contents or perform any desired actions
    rows.forEach(row => {
        //console.log(row.id); // Access the row's ID
        // You can access other cells (td) if needed
        const cells = row.querySelectorAll('td');
        const cellContents = [];
        for (let cell of cells) {
            cellContents.push(cell.innerHTML);
        }
        let ICSEvent =   'BEGIN:VEVENT\n' +
        'SUMMARY:' + cellContents[1] + ' ' + cellContents[2] + ' | ' + cellContents[3] + ' | Final Exam' + '\n' +
        'UID:' + cellContents[1] + cellContents[2] +  '\n' +
        'SEQUENCE:0\n' +
        'STATUS:CONFIRMED\n' +
        'TRANSP:TRANSPARENT\n' +
        'DTSTART;TZID=' + 'America/New_York' + ':' + getISODate(cellContents, 0, "start") + '\n' +
        'DTEND;TZID=' + 'America/New_York' + ':' + getISODate(cellContents, 0, "end") + '\n' +
        'DTSTAMP:'+ convertToICSDate(new Date()) + '\n' +
        'LOCATION:' + 'Vanier College' + '\\n' + '821 Sainte Croix Ave' + ', ' + 'Saint-Laurent' + ', ' + 'Quebec' + '\n' +
        'DESCRIPTION:' + 'Teacher: ' + cellContents[4] + ', Room: ' + cellContents[7] + ', Rows: ' + cellContents[8] + '\n' +
        'END:VEVENT\n';
        allEvents += ICSEvent;
    });
    return allEvents;

}

function addToGoogleCalendar(button) {
    // Get the button that was clicked
    let googleURL = 'https://calendar.google.com/calendar/u/0/r/eventedit';
    //console.log(button)
    const tableRow = button.closest('tr'); // Find the closest <tr> ancestor

    // Get all <td> elements in this <tr>
    const tds = tableRow.getElementsByTagName('td');

    // Create an array to hold the innerHTML of each <td>
    const tdContents = [];

    // Loop through the <td> elements and store their innerHTML
    for (let td of tds) {
        tdContents.push(td.innerHTML);
    }
    let text = tdContents[1] + " " + tdContents[2] + " | " + tdContents[3] + " | Final Exam";
    text = encodeURIComponent(text);
    googleURL = googleURL + "?text=" + text;
    let startDate = getISODate(tdContents, 4, "start");
    let endDate = getISODate(tdContents, 4, 'end');

    date = startDate + "Z" + "/" + endDate + "Z";
    //console.log(date)

    googleURL = googleURL + "&dates=" + date;

    let details = "Teacher: " + tdContents[4] + ", Room: " + tdContents[7] + ", Rows: " + tdContents[8];
    details = encodeURIComponent(details);

    googleURL = googleURL + "&details=" + details;
    //console.log(googleURL);
    window.open(googleURL, '_blank');

    // Log or process the contents
    //console.log(tdContents); // This will print an array of innerHTML for each <td>
}

function getISODate(cellContents, hourstoAdd, startOrEnd){
    let index;
    if (startOrEnd == 'start') {
        index = 5;
    }
    else {
        index = 6;
    }
    let date = cellContents[0];
    let dateArr = date.split("-");
    date = dateArr[0] + dateArr[1] + dateArr[2];

    //convert time from EST to UTC
    let time = addHours(cellContents[index].replace(/:/g, ""), hourstoAdd);

    date = date + "T" + time;
    return date;

}


function addHours(timeString, hoursToAdd) {
    // Extract hours, minutes, and seconds from the time string
    const hours = parseInt(timeString.slice(0, 2), 10);
    const minutes = parseInt(timeString.slice(2, 4), 10);
    const seconds = parseInt(timeString.slice(4, 6), 10);

    // Create a Date object (assuming a default date)
    const date = new Date();
    date.setHours(hours, minutes, seconds); // Set the time

    // Add the desired hours
    date.setHours(date.getHours() + hoursToAdd);

    // Format the new time back into a string (HHMMSS)
    const newHours = String(date.getHours()).padStart(2, '0');
    const newMinutes = String(date.getMinutes()).padStart(2, '0');
    const newSeconds = String(date.getSeconds()).padStart(2, '0');

    return `${newHours}${newMinutes}${newSeconds}`;
}

/**
* Create and download a file on click
* @params {string} filename - The name of the file with the ending
* @params {string} filebody - The contents of the file
*/
function download(filename, fileBody) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileBody));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


/**
* Returns a date/time in ICS format
* @params {Object} dateTime - A date object you want to get the ICS format for.
* @returns {string} String with the date in ICS format
*/
function convertToICSDate(dateTime) {
    const year = dateTime.getFullYear().toString();
    const month = (dateTime.getMonth() + 1) < 10 ? "0" + (dateTime.getMonth() + 1).toString() : (dateTime.getMonth() + 1).toString();
    const day = dateTime.getDate() < 10 ? "0" + dateTime.getDate().toString() : dateTime.getDate().toString();
    const hours = dateTime.getHours() < 10 ? "0" + dateTime.getHours().toString() : dateTime.getHours().toString();
    const minutes = dateTime.getMinutes() < 10 ? "0" +dateTime.getMinutes().toString() : dateTime.getMinutes().toString();

    return year + month + day + "T" + hours + minutes + "00";
}


/**
* Creates and downloads an ICS file
* @params {string} timeZone - In the format America/New_York
* @params {object} startTime - Vaild JS Date object in the event timezone
* @params {object} endTime - Vaild JS Date object in the event timezone
* @params {string} title
* @params {string} description
* @params {string} venueName
* @params {string} address
* @params {string} city
* @params {string} state
*/
function createDownloadICSFile() {
    const timezone = 'America/New_York';
    let icsBody = 'BEGIN:VCALENDAR\n' +
  'VERSION:2.0\n' +
  'PRODID:Calendar\n' +
  'CALSCALE:GREGORIAN\n' +
  'METHOD:PUBLISH\n' +
  'BEGIN:VTIMEZONE\n' +
  'TZID:' + timezone + '\n' +
  'END:VTIMEZONE\n';
  const events = getICSEventFromCalendar();
  icsBody = icsBody + events;
  icsBody = icsBody + 'END:VCALENDAR\n';
  //console.log(icsBody);
  download('Exam Schedule.ics', icsBody);
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
