function saveSelections() {
    var filterDepartureStation = document.getElementById("departureStation").value;
    var filterArrivalStation = document.getElementById("arrivalStation").value;
    localStorage.setItem('departureStation',filterDepartureStation);
    localStorage.setItem('arrivalStation', document.getElementById("arrivalStation").value);
    console.log("departureStation"+localStorage.getItem("departureStation"))
    console.log("departureStation"+localStorage.getItem("arrivalStation"))
}
