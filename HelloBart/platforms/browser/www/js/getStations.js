//JS to populate/abbreviations names of  all stations

$.ajax({
    url: 'http://suryarajasekaran.com:8881/stations',
    type: "GET",
    dataType: "json",
    data: {
    },
    //contentType: "application/json; charset=utf-8",
    xhrFields: {
                   withCredentials: true
                },
    crossDomain: true,
    cache: false,
    success: function (result) {
        var dataset = result.data;
        var departureStation = document.getElementById('departureStation');
        var arrivalStation = document.getElementById('arrivalStation');
        for(var i = 0; i < dataset.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = dataset[i].name;
            opt.value = dataset[i].abbr;
            if (localStorage.getItem("arrivalStation") == dataset[i].abbr) {
                opt.selected = true;
            }
            arrivalStation.appendChild(opt);
        };
        for(var i = 0; i < dataset.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = dataset[i].name;
            opt.value = dataset[i].abbr;
            if (localStorage.getItem("departureStation") == dataset[i].abbr) {
                opt.selected = true;
            }
            departureStation.appendChild(opt);
        };
    },
    error: function () {
        console.log("error");
    }
});



$(function(){
    $.getJSON('', function(data) {
        console.log(data);

    });
});