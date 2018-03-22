//JS to get More info about one particuar station
//document.getElementById("searchSchedules").onclick = function () {
document.getElementById("departureStation").onchange = function () {
        var getStationInfo = document.getElementById("departureStation").value;
        if (getStationInfo =='Select'){
        document.getElementById("StationInfo").innerHTML = "Select source destination to get more info";
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
                //var StationInfo = document.getElementById("StationInfo").value;
                //StationInfo.result.data;
                document.getElementById("StationInfo").innerHTML = "<h1>Information about Departure Station</h1> <br>"+"Name of station :" + dataset.name+ "<br> Address of station : "+ dataset.address+
                 "<br>City : "+dataset.city+"<br>County : "+dataset.county+ "<br>State : "+dataset.state+"<br>ZipCode : "+dataset.zipcode+ "<br> Platform Info :" + dataset.platform_info + "<br> <br> <b>More Information about the station</b> <br> Intro :" +
                 dataset.intro['#cdata-section']+ "<br> Food :" +dataset.food['#cdata-section']+ "<br> Shopping :" +dataset.shopping['#cdata-section'] + "<br>Attraction :" + dataset.attraction['#cdata-section']
                  + "<br>Link : " +dataset.link['#cdata-section'];
                  //"<br>Routes shown below, <br>North :" + dataset.north_routes['route'] +"<br>South :"+dataset.south_routes['route'] +

                //JSON.stringify(result);
            },
    error: function () {
        console.log("error");
    }
});
};
};
