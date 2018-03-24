lat_dest = null;
lng_dest = null;
lat_org = null;
lng_org = null;

function loadStationInfo() {
    var departureStation = localStorage.getItem("departureStation");
    var arrivalStation = localStorage.getItem("arrivalStation");
    document.getElementById("from").innerHTML = departureStation;
    document.getElementById("to").innerHTML = arrivalStation;
};

function loadDepartureStationInfo() {

    var getStationInfo = localStorage.getItem("departureStation");
    if (getStationInfo =='Select'){
    }
    else{
        $.ajax({
            url: "http://suryarajasekaran.com:8881/station?source="+getStationInfo,
            type: "GET",
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (result) {
                var dataset = result.data;
                console.log(dataset)
                document.getElementById("name").innerHTML = dataset.name;
                document.getElementById("intro").innerHTML = dataset.intro['#cdata-section']
                document.getElementById("address").innerHTML = dataset.address
                document.getElementById("city").innerHTML = dataset.city
                document.getElementById("county").innerHTML = dataset.county
                document.getElementById("state").innerHTML = dataset.state
                document.getElementById("zipcode").innerHTML = dataset.zipcode
            },
            error: function () {
                console.log("error");
            }
        });

    };
}

function getLatLngOrigin(station){
    $.ajax({
        url: "http://suryarajasekaran.com:8881/station?source="+station,
        type: "GET",
        async: false,
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function(result) {
            lat_org = parseFloat(result.data.gtfs_latitude);
            lng_org = parseFloat(result.data.gtfs_longitude);
            console.log("get"+lat_org)
            console.log("get"+lng_org)
       },
        error: function() {
            console.log("error");
        },

    });
}

function getLatLngDest(station){
    $.ajax({
        url: "http://suryarajasekaran.com:8881/station?source="+station,
        type: "GET",
        async: false,
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function(result) {
            lat_dest = parseFloat(result.data.gtfs_latitude);
            lng_dest = parseFloat(result.data.gtfs_longitude);
       },
        error: function() {
            console.log("error");
        },

    });
}

function loadResults() {

    var filterDepartureStation = localStorage.getItem("departureStation");
    var filterArrivalStation = localStorage.getItem("arrivalStation");

    if (filterDepartureStation =='Select' || filterArrivalStation=="Select") {
        document.getElementById("notification").innerHTML = "Select both Arrival and Departure station";
    }
    else if (filterDepartureStation==filterArrivalStation) {
        document.getElementById("notification").innerHTML = "Arrival and Departure stations cant be the same";
    }
    else {
        document.getElementById("notification").innerHTML = "Results";
        getLatLngDest(filterArrivalStation);
        getLatLngOrigin(filterDepartureStation);
        initMap();
        $.ajax({
            url: "http://suryarajasekaran.com:8881/trips?source="+filterDepartureStation+"&dest="+filterArrivalStation,
            type: "GET",
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function(result) {
                document.getElementById("result").innerHTML = " ";
                var dataset = result.data;
                var result = document.getElementById("result");
                var timenow = new Date();
                for(var i = 0; i < dataset.length; i++) {
                    if (i == 0) {
                        document.getElementById("fare").innerHTML = String(dataset[0]["@fare"]);
                        document.getElementById("co2emission").innerHTML = String(dataset[0]["@co2"]);
                        document.getElementById("triptime").innerHTML = String(dataset[0]["@tripTime"]);
                        timer(dataset[0]["@origTimeMin"]);
                    }
                    var div = document.createElement('div');
                    div.className = "panel panel-default";
                    var leg = document.createElement('h5');
                    leg.innerHTML = "Leg : "+ (i+1);
                    div.appendChild(leg);
                    var departureTime = document.createElement('h5');
                    departureTime.innerHTML = "Departure Time : "+ dataset[i]["@origTimeMin"];
                    div.appendChild(departureTime);
                    var arrivalTime = document.createElement('h5');
                    arrivalTime.innerHTML = "Arrival Time : "+ dataset[i]["@destTimeMin"];
                    div.appendChild(arrivalTime);
                    result.appendChild(div);
                }

            },
            error: function() {
                console.log("error");
            },
        });
    }
}

function addWidgetFlip(year, month, day, hour, min) {
    document.getElementById("flipwidget").innerHTML = " ";
    var eventDate = new Date(year,month,day,hour,min);
    var datetest = (new Date(eventDate).getTime() - new Date().getTime()) / 1000;
    if (datetest >0){

    console.log(datetest);
    var clock = $('.your-clock').FlipClock(datetest, {
        clockFace: 'DailyCounter',
        countdown: true
    });
    console.log(clock);
    }
    else document.getElementById("flipwidget").innerHTML = "Your Train has departed ";
}

function timer(destTimeHours) {
    var currentTime = new Date();
    var day = currentTime.getDate();
    var month = currentTime.getMonth();
    var year = currentTime.getFullYear();
    var hour = convert_to_24h(destTimeHours)[0]
    var min = convert_to_24h(destTimeHours)[1]
    addWidgetFlip(year,month,day,hour,min)
}

function convert_to_24h(time_str) {
    // Convert a string like 10:05 PM to 24h format, returns like [22,5]
    var time = time_str.match(/(\d+):(\d+) (\w)/);
    var hours = Number(time[1]);
    var minutes = Number(time[2]);
    var meridian = time[3].toLowerCase();

    if (meridian == 'p' && hours < 12) {
      hours += 12;
    }
    else if (meridian == 'a' && hours == 12) {
      hours -= 12;
    }
    return [hours, minutes];
};

function initMap() {
    console.log("init"+lat_org)
    console.log("init"+lng_org)
    if (lat_org == null || lat_dest == null || lng_org == null || lng_dest == null){
        document.getElementById("map").innerHTML = " ";
   }
   else{
   document.getElementById("map").innerHTML = " ";
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: {lat: lat_org, lng: lng_org}
    });
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  }
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    console.log("calc"+lat_org)
    console.log("calc"+lng_org)
    var selectedMode = "TRANSIT";
    directionsService.route({
      origin: {lat: lat_org, lng: lng_org},
      destination: {lat: lat_dest, lng: lng_dest},
      travelMode: google.maps.TravelMode[selectedMode],
      transitOptions: {
        modes: ['RAIL']
      },
    }, function(response, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}

window.onload = function() {
  loadStationInfo();
  loadDepartureStationInfo();
  loadResults();
};
