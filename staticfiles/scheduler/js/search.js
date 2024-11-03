
function addToCalendar(id)
{
    
    //console.log("inside add to calendar");
    //console.log('hhiandn');

    const button = document.getElementById(id);
    id = parseInt(id);

    button.innerHTML = "Added";
    button.disabled = true;

    fetch('/add_to_calendar', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),  // Include the CSRF token here
        },
        body: JSON.stringify({
            id: id
        })
    })
    .then(response => {
        if(response.status != 200){
            return response.json().then(errorData => {
                button.innerHTML="Add to Calendar";
                button.disabled = false;
                alert(errorData.error);
            })
        }
        else{
            button.innerHTML = "Added";
        }
    });
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

//https://codepen.io/jessewarddev/pen/LYVqabP