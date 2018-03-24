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
                    }
                    var div = document.createElement('div');
                    div.className = "panel panel-default";
                    var leg = document.createElement('h5');
                    leg.innerHTML = "Leg : "+ (i+1)
                    var departureTime = document.createElement('h5');
                    departureTime.innerHTML = "Departure Time : "+ dataset[i]["@origTimeMin"]
                    var arrivalTime = document.createElement('h5');
                    arrivalTime.innerHTML = "Arrival Time : "+ dataset[i]["@destTimeMin"]
                    div.appendChild(leg);
                    div.appendChild(departureTime);
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

window.onload = function() {
  loadStationInfo();
  loadResults();
};
