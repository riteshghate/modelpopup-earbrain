let myHeight = window.innerHeight;
var navHeight = $(".navBar").height();
var cognivuePreferred = []
var audiologyOffice = []
var selectedLocation = []
var isOtherPreferred = false;
var isOtherZipCode = false;
var intiZipCode = true;

var locationData = [];

var markers = [];
var map;
var infowindow;
var zipLat;
var zipLong;

var distance1 = 40.2336;
var distance1InMiles = 25;

var distance2 = 80.4672;
var distance2InMiles = 50;

var distance3 = 120.701;
var distance3InMiles = 75;

var distance4 = 160.934;
var distance4InMiles = 100;


var widthLeftCont = $(".map-left-container").width();
var shadeHeight = $(".shade").height();
$("#map").height(myHeight - navHeight)

if ($(window).width() < 480){
    $('#locations').hide();
    $('.preffered-office1 span').text("Cognivue Preferred");
    $('.preffered-office2 span').text("Other Audiology ");

    $('.advanceSearch').css("width", "42%");
    $('.listviewData').css("display", "");
    
}
else {
    $(".map-left-container").height(myHeight - (navHeight))
    $('.preffered-office1 span').text("Cognivue Preferred AuD");
    $('.preffered-office2 span').text("Other Audiology Office");
    $('.advanceSearch').css("width", "100%");
    $('.listviewData').css("display", "none");
    
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const zipcode = urlParams.get('zipcode')
const emailID = urlParams.get('emailId')
const username = urlParams.get('name')


var selectedLatitude = urlParams.get('latitude');
var selectedlongitude = urlParams.get('longitude');
var selectedStateCode = urlParams.get('state');

if(zipcode!=null && zipcode !=""){
    $(".zip-code").show();
}else{
    $(".zip-code").hide();
}

if(selectedStateCode!=null && selectedStateCode !=""){
    $(".zip-code.slect-sate").show();

}else{
    $(".zip-code.slect-sate").hide();
}

//$("#zipCodeMap").val(zipcode)
$("#zipCode").text(zipcode)
$("#fullList").click(function() {
    $("#fullList").hide();
    $("#backBtn").show();
    $("#map").hide();
    $('#locations').show();
});
$("#backBtn").click(function() {
    openMap();
});

function openMap(){
    $("#fullList").show();
    $("#backBtn").hide();
    $("#map").show();
    $('#locations').hide();
}


var checkbox1 = document.getElementById('otherAudiologyCheckbox');
checkbox1.addEventListener('change', e => {
    console.log("............sas.........."+JSON.stringify(cognivuePreferred)+".............."+JSON.stringify(audiologyOffice));

    if (e.target.checked) {
        selectedLocation =cognivuePreferred.concat(audiologyOffice);
        isOtherPreferred = true;
        if(isOtherZipCode){
            initMap(locationData);
        }
    } else {
        selectedLocation = cognivuePreferred;
        isOtherPreferred = false;
    }
    if(selectedLocation.length == 0){
        $('#locations').empty();
         if (zipLat == null) {
            zipLat = 38.500000;
        }
        if (zipLong == null) {
            zipLong = -98.000000;
        }
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: new google.maps.LatLng(zipLat, zipLong),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    }else {
        loadMap()
    }
    console.log("selectedLocation........2.."+JSON.stringify(selectedLocation));
});

var checkbox2 = document.getElementById('checkboxForAllZipCode');
checkbox2.addEventListener('change', e => {
    if (e.target.checked) {
        isOtherZipCode = true;
    } else {
        isOtherPreferred = false;
        $("#otherAudiologyCheckbox").prop("checked", isOtherPreferred);
        isOtherZipCode = false;
    }
    initMap(locationData);
});



getAllCognivuePreferred();
function getAllCognivuePreferred() {
    $.ajax({
        url: BASE_URL + "cognivuePreferred.json",
        type: "GET",
        success: function(data, textStatus, jqXHR) {
            if (isEmpty(data)) {
                //alert("Please enter valid zipcode");
            } else {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if(data[key]!=null){
                            locationData.push(data[key]);
                        }
                        
                    }
                }
                initMap(locationData);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var myJSON = JSON.parse(jqXHR.responseText);
            alert(myJSON.error.message);
            console.log("data", "data......." + myJSON.error.message);
        }
    });
} 


function initMap(locations) {
    $("#radius_message").text("");
    $("#radius_message").hide();
    markers = [];
    cognivuePreferred = [];
    audiologyOffice = [];
    selectedLocation = [];
    $('#locations div').remove();
    if (locations == null || locations.length == 0) {
        if (zipLat == null) {
            zipLat = 38.500000;
        }
        if (zipLong == null) {
            zipLong = -98.000000;
        }
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: new google.maps.LatLng(zipLat, zipLong),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    } else {
        if(isOtherZipCode){
            $("#radius_message").text("");
            $("#radius_message").hide();
            $("#checkboxForAllZipCode").prop("checked", isOtherZipCode);
            getStateWiseData(locations);
            if(isOtherPreferred){
                selectedLocation =cognivuePreferred.concat(audiologyOffice);
            }
            
        }else {
            getCognivieDataByDistance(locations, distance1)
            $("#radius_message").show();
            $("#radius_message").text("Search results within "+distance1InMiles+" mile radius!");
            if(selectedLocation !=null && selectedLocation.length == 0){
                getCognivieDataByDistance(locations, distance2)
                $("#radius_message").show();
                $("#radius_message").text("Search results within "+distance2InMiles+" mile radius!");
            }
            if(selectedLocation !=null && selectedLocation.length == 0){
                getCognivieDataByDistance(locations, distance3)
                $("#radius_message").show();
                $("#radius_message").text("Search results within "+distance3InMiles+" mile radius!");
            }
            if(selectedLocation !=null && selectedLocation.length == 0){
                getCognivieDataByDistance(locations, distance4)
                $("#radius_message").show();
                $("#radius_message").text("Search results within "+distance4InMiles+" mile radius!");
            }
    
            if(selectedLocation !=null && selectedLocation.length == 0){
                selectedLocation =cognivuePreferred.concat(audiologyOffice);
                if(selectedLocation !=null && selectedLocation.length != 0){
                    isOtherPreferred = true
                    $("#otherAudiologyCheckbox").prop("checked", isOtherPreferred);
                }else if(intiZipCode){
                    intiZipCode = false;
                    isOtherZipCode = true;
                    $("#checkboxForAllZipCode").prop("checked", isOtherZipCode);
                    getStateWiseData(locations);
                }
            }
        }
        
        console.log("selectedLocation........1.."+JSON.stringify(selectedLocation));
        if(selectedLocation.length == 0){
            initMap(null)
        }else {
            loadMap()
        }
        
    }
}
function loadMap(){
    markers =[];
    $('#locations').empty();
    var latlngbounds = new google.maps.LatLngBounds();
    map = new google.maps.Map(document.getElementById('map'), {
        //zoom: zoom,
        center: new google.maps.LatLng(selectedLatitude, selectedlongitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(infowindow, 'closeclick', function() {
        $("#locations .preffered-list").removeClass("selectedmap")

    });

    var marker, i;
    if(zipcode !=null && zipcode !=""){
        selectedLocation = locationDataSortingByZip(selectedLocation, zipcode);
    }
    console.log("..........2"+selectedLocation)
    for (i = 0; i < selectedLocation.length; i++) {
        
        var icon = 'images/map_pin_org.png';
        var listIcon = 'images/Cognivue Circles-1.png';
        var locObj =selectedLocation[i];
        var isPrefferedOffice = selectedLocation[i].cognivuePreferred
        var fullAddress = "";
        if (locObj.city != null) {
            fullAddress = locObj.city + ", " + locObj.stateProvince + ", " + locObj.zipText;
        }
        var practiceName = "";
        if (locObj.practiceName != null) {
            practiceName = locObj.practiceName;
        }
        var fullStreet = "";
        if (locObj.fullStreet != null) {
            fullStreet = locObj.fullStreet;
        }
        if (isPrefferedOffice == "Cognivue Preferred Audiologist") {
            var phoneNumber = locObj.officePhonNumber;
            if (phoneNumber != null) {
                phoneNumber = locObj.officePhonNumber.toString();
                var first = phoneNumber.slice(0, 3);
                var second = phoneNumber.slice(3, 6);
                var third = phoneNumber.substring(6, phoneNumber.length);
                phoneNumber = "(" + first + ") " + second + "-" + third;
            }

            var firstLast = locObj.auDName;
            if (firstLast != null) {
                firstLast = firstLast + ", AuD";
            } else {
                firstLast = "";
            }
            icon = 'images/map_pin_org.png';
            listIcon = 'images/Cognivue Circles-1.png';
            var locationData = '<div class="cognive-office, preffered-list preffered-list_' + i + '" onClick="showMarker(' + i + ')"><img class="preffered-office-marker office-marker" src="' + listIcon + '" width="30"><div><div class="office-address"><p class="office-name">' + practiceName + '</p><p class="office-name office-person-name">' + firstLast + '</p><p class="office-address-details">' + fullStreet + '</p><p class="office-address-details">' + fullAddress + '</p><p onClick="clickOnPhone(\'' + practiceName.replace(/'/g, "\\'") + '\', \'' + firstLast.replace(/'/g, "\\'") + '\', \'' + fullStreet.replace(/'/g, "\\'") + '\', \'' + fullAddress.replace(/'/g, "\\'") + '\', \'' + phoneNumber + '\')" class="office-contact-details">Phone: <a href="tel:' + phoneNumber + '">' + phoneNumber + '</a></p><p class=""></p></div></div><div class="clear"></div></div>';
            $('#locations').append(locationData);

        } else {
            icon = 'images/map_pin_grey_org.png';
            if (isPrefferedOffice != null)
                listIcon = 'images/map_pin_grey_org.png';
            else
                listIcon = '';
            var locationData = '<div class="preffered-list preffered-list_' + i + '" onClick="showMarker(' + i + ')"><img class="preffered-office-marker office-marker" src="' + listIcon + '" width="30"><div><div class="office-address"><p class="office-name other-office-name">' + practiceName + '</p><p class="office-address-details">' + fullStreet + '</p><p class="office-address-details">' + fullAddress + '</p><p class="office-contact-details"></p></div></div><div class="clear"></div></div>';
            $('#locations').append(locationData);

        }

        var lat = eval(locObj.latitude); //Note the value is in "" hence a string
        var long = eval(locObj.longitude); //Note the value is in "" hence a string


        marker = new google.maps.Marker({

            position: new google.maps.LatLng(lat, long),
            map: map,
            icon: icon

        });
        marker.setMap(map);

        markers.push(marker);

        //openTitle(markers[0],0) 
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                openTitle(selectedLocation, marker, i)
            }
        })(marker, i));
        latlngbounds.extend(marker.position);


    }
    map.setCenter(latlngbounds.getCenter());
    map.fitBounds(latlngbounds);
}

function getStateWiseData(locations){
    for (i = 0; i < locations.length; i++) {
        var locationObj = locations[i];
        if(selectedStateCode!=null && locationObj.stateProvince !=null){
            var stateCode = locationObj.stateProvince.toLowerCase();
            if(selectedStateCode.toLowerCase() == stateCode){
                getCognivieData(locationObj);
            }
        }
        
    }

    console.log("......................"+JSON.stringify(cognivuePreferred)+".............."+JSON.stringify(audiologyOffice));
}

function getCognivieDataByDistance(locations, inputDistance){
    for (i = 0; i < locations.length; i++) {
        var locationObj = locations[i];
        var distanceinKm = distance(selectedLatitude, selectedlongitude, locationObj.latitude, locationObj.longitude, "k")
        if(distanceinKm < inputDistance ){
            getCognivieData(locationObj);
            console.log(".............."+distanceinKm)
        }
    }
}
function getCognivieData(locationObj){
    var isPrefferedOffice = locationObj.cognivuePreferred
    if (isPrefferedOffice == "Cognivue Preferred Audiologist") {
        selectedLocation.push(locationObj);
        cognivuePreferred.push(locationObj);
    } else if (isPrefferedOffice == "Other Audiology Office") {
        if(isOtherPreferred){
            selectedLocation.push(locationObj);
        }
        var isDataAvailable = containsObject(locationObj, audiologyOffice)
        if(!isDataAvailable){
            audiologyOffice.push(locationObj);
        }
        
        // var obj1 = JSON.stringify(locationObj)
        // for (i = 0; i < audiologyOffice.length; i++) {
        //     var obj2 = JSON.stringify(audiologyOffice[i])
        //     if(obj1 != obj2){
                
        //     }
        // }
        
    }
}

function containsObject(obj, list) {
    var x;
    for (x in list) {
        if (list.hasOwnProperty(x) && list[x] === obj) {
            return true;
        }
    }

    return false;
}


function openTitle(locations, marker, i) {
    var className = "preffered-list_" + i;
    $("#locations .preffered-list").removeClass("selectedmap")
    $("#locations ." + className).addClass("selectedmap")
    if (i > 4) {
        $(".selectedmap").get(0).scrollIntoView();
    }
    var isPrefferedOffice = locations[i].cognivuePreferred
    var locationMarker;
    var fullAddress = "";
    if (locations[i].city != null) {
        fullAddress = locations[i].city + ", " + locations[i].stateProvince + ", " + locations[i].zipText;
    }
    var practiceName = "";
    if (locations[i].practiceName != null) {
        practiceName = locations[i].practiceName;
    }
    var fullStreet = "";
    if (locations[i].fullStreet != null) {
        fullStreet = locations[i].fullStreet;
    }
    if (isPrefferedOffice == "Cognivue Preferred Audiologist") {
        var firstLast = locations[i].auDName;
        if (firstLast != null) {
            firstLast = firstLast + ", AuD";
        } else {
            firstLast = "";
        }
        var phoneNumber = locations[i].officePhonNumber;
        if (phoneNumber != null) {
            phoneNumber = locations[i].officePhonNumber.toString();
            var first = phoneNumber.slice(0, 3);
            var second = phoneNumber.slice(3, 6);
            var third = phoneNumber.substring(6, phoneNumber.length);
            phoneNumber = "(" + first + ") " + second + "-" + third;
        }
        locationMarker = '<div class="preffered-map-list"><div><div class="office-address"><p class="office-name">' + practiceName + '</p><p class="office-name office-person-name">' + firstLast + '</p><p class="office-address-details">' + fullStreet + '</p><p class="office-address-details">' + fullAddress + '</p><p onClick="clickOnPhone(\'' + practiceName.replace(/'/g, "\\'") + '\', \'' + firstLast.replace(/'/g, "\\'") + '\', \'' + fullStreet.replace(/'/g, "\\'") + '\', \'' + fullAddress.replace(/'/g, "\\'") + '\', \'' + phoneNumber + '\')" class="office-contact-details">Phone: <a  href="tel:' + phoneNumber + '">' + phoneNumber + '</a></p><p class="cognivue-referred cognive-Preferred-office-btn" onClick="clickCognivePreferred(\'' + practiceName.replace(/'/g, "\\'") + '\', \'' + firstLast.replace(/'/g, "\\'") + '\', \'' + fullStreet.replace(/'/g, "\\'") + '\', \'' + fullAddress.replace(/'/g, "\\'") + '\', \'' + phoneNumber + '\')">Email this information to me</p></div></div><div class="clear"></div></div>';
        //locationMarker = "<p class='cognive-Preferred-office-btn' onClick='clickCognivePreferred(\""+ practiceName+  "\")'>Email this information to me</p>";


    } else {
        locationMarker = '<div class="preffered-map-list"><div><div class="office-address"><p class="office-name other-office-name">' + practiceName + '</p><p class="office-address-details">' + fullStreet + '</p><p class="office-address-details">' + fullAddress + '</p><p class="office-contact-details"></p><p class="cognive-other-office-label">This office currently does not support<br/>Cognivue assessments!</p><p class="cognive-other-office-btn" onClick="clickCogniveOtherPreferred(\'' + practiceName.replace(/'/g, "\\'") + '\', \'' + firstLast + '\', \'' + fullStreet + '\', \'' + fullAddress + '\', \'' + phoneNumber + '\')">Request Cognivue service</p></div></div><div class="clear"></div></div>';

    }
    infowindow.setContent(locationMarker);
    infowindow.open(map, marker);
}


function distance(lat1, lon1, lat2, lon2, unit) {
    var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}
function deg2rad(deg) {
    return deg * (Math.PI/180)
  }


  function showMarker(index) {
    //hideAllMarkers();
    markers[index].setMap(map);
    openTitle(selectedLocation, markers[index], index)
    if ($(window).width() < 480){
       openMap();
    }
    
}

function hideAllMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}




function clickCognivePreferred(practiceName, firstLast, fullStreet, fullAddress, phoneNumber) {
    $("#locations .preffered-list").removeClass("selectedmap")
    infowindow.close();
    var formData = {practiceName:practiceName,firstLast:firstLast, fullStreet:fullStreet, fullAddress:fullAddress, phoneNumber:phoneNumber, email:emailID, createdDate: getCurrentDate(), dateTime:getCurrentDateMillisec()}; 
    captureEventCognivuePreferred(formData);
    sendEmail(practiceName, firstLast, fullStreet, fullAddress, phoneNumber);
    //alert("Email with an Information of the Audiologist is sent to you."); 
}

function clickCogniveOtherPreferred(practiceName, firstLast, fullStreet, fullAddress, phoneNumber) {
    $("#locations .preffered-list").removeClass("selectedmap");
    infowindow.close();
    var formData = {practiceName:practiceName,fullStreet:fullStreet, fullAddress:fullAddress, email:emailID, createdDate: getCurrentDate(), dateTime:getCurrentDateMillisec() }; 
    captureEventOtherAudiologist(formData);
    alert("Your request is successful");
    

}

function sendEmail(practiceName, firstLast, fullStreet, fullAddress, phoneNumber) {
    var body = "<div>" + practiceName + "<br>" + firstLast + "<br>" + fullStreet + "<br>" + fullAddress + "<br>" + phoneNumber + "<div>";
    Email.send({
        Host: "smtp.gmail.com",
        Username: "earbraincognivue@gmail.com",
        Password: "lGtsd7911!!",
        To: emailID,
        From: "earbraincognivue@gmail.com",
        Subject: "Audiologist Information",
        Body: body,
    }).then(
        message => alert("Email with an Information of the Audiologist is sent to you.")
    );
}

function clickOnPhone(practiceName, firstLast, fullStreet, fullAddress, phoneNumber){
    var formData = {practiceName:practiceName,firstLast:firstLast, fullStreet:fullStreet, fullAddress:fullAddress, phoneNumber:phoneNumber, email:emailID, createdDate: getCurrentDate(), dateTime:getCurrentDateMillisec()}; 
    captureEventPhoneNumber(formData);
}
var accept = document.getElementById('accept');

accept.addEventListener('change', e => {
    if (e.target.checked) {
        $('#practiceName').val("")
        $("#yourAudiologist").val("")
        $("#practiceName").prop('disabled', true);
        $("#yourAudiologist").prop('disabled', true);

    } else {
        $("#practiceName").prop('disabled', false);
        $("#yourAudiologist").prop('disabled', false);
    }
});

function clickAnAudiologistSubmit() {
    var yourAudiologist = $("#yourAudiologist").val()
    var practiceName = $('#practiceName').val();
    var isChecked = $("#accept").prop('checked');

    if (!isChecked) {
        if (yourAudiologist == "") {
            alert("Please enter your audiologist");
            return;
        } else if (practiceName == "") {
            alert("Please enter practice name");
            return;
        } else {
            var formData = {yourAudiologist:yourAudiologist,practiceName:practiceName, iDontHaveAnAudiologist:false, email:emailID, createdDate: getCurrentDate(), dateTime:getCurrentDateMillisec() }; 
            captureEventCanNotFindTheAUD(formData)
            var login = document.querySelector(".login");
            login.classList.toggle("show-modal");

            if ($("#accept").prop('checked') == false) {
                var searchText = yourAudiologist + ", " + practiceName;
                window.open("https://www.google.com/search?q=" + searchText);
            }


        }
    } else {
        var formData = {iDontHaveAnAudiologist:true, email:emailID, createdDate: getCurrentDate(), dateTime:getCurrentDateMillisec() }; 
        captureEventCanNotFindTheAUD(formData)
        var login = document.querySelector(".login");
        login.classList.toggle("show-modal");
        $('#practiceName').val("")
        $("#yourAudiologist").val("")
        $("#accept").prop("checked", false);
    }


}

$("#advance-search").click(function(){
    redirect("search.html");

})




function locationDataSortingByZip(selectedLocation, property) {
    var zipCodeData = [];
    var otherZipCodeData = [];
    var otherAudiology = [];


    for (var key in selectedLocation) {
        if(selectedLocation[key].zipText == property){
            if(selectedLocation[key] == "Cognivue Preferred Audiologist"){
                zipCodeData.push(selectedLocation[key]);
            }else{
                otherAudiology.push(selectedLocation[key]);
            }
            
        }else{
            if(selectedLocation[key] == "Cognivue Preferred Audiologist"){
                otherZipCodeData.push(selectedLocation[key]);
            }else{
                otherAudiology.push(selectedLocation[key]);
            }
            
        }
    }
    var allData = zipCodeData.concat(otherZipCodeData);
    return allData.concat(otherAudiology);
}
