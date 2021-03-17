let myHeight = window.innerHeight;
var navHeight = $(".navBar").height();
var cognivuePreferred = []
var audiologyOffice = []
var selectedLocation = []
var zipCodeOffice = []
var isOtherPreferred = false;
var isOtherZipCode = false;

var stateWiseCode;
var initData = true;
var locationData = [];

var markers = [];
var map;
var infowindow;
var zipLat;
var zipLong;

var widthLeftCont = $(".map-left-container").width();
var shadeHeight = $(".shade").height();
$("#map").height(myHeight - navHeight)


console.log("........."+$(window).width());
if ($(window).width() < 480){
    $('#locations').hide();
    $('.preffered-office1 span').text("Cognivue Preferred");
    $('.preffered-office2 span').text("Other Audiology");
    
}
else {
    $(".map-left-container").height(myHeight - (navHeight))
    $('.preffered-office1 span').text("Cognivue Preferred Audiologist");
    $('.preffered-office2 span').text("Other Audiology Office");
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const zipcode = urlParams.get('zipcode')
const emailID = urlParams.get('emailId')
const username = urlParams.get('name')
$("#zipCodeMap").val(zipcode)
getDataUsZipCode();

$("#zipCodeMap").keyup(function() {
    var zipCode = $("#zipCodeMap").val()
    var length = zipCode.length;
    if (length >= 5) {
        getDataUsZipCode();
    } else {
        initMap(null)
    }

});
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
var checkbox2 = document.getElementById('checkboxForAllZipCode');

checkbox1.addEventListener('change', e => {
    if (e.target.checked) {
        isOtherPreferred = true;
    } else {
        isOtherPreferred = false;
    }
    zipCodeSearch()
});

checkbox2.addEventListener('change', e => {
    if (e.target.checked) {
        isOtherZipCode = true;
    } else {
        isOtherZipCode = false;
    }
    zipCodeSearch()
});

function zipCodeSearch() {
    // var state  = $('#states :selected').text().trim();
    // if(state == "" || state=="State"){
    //     initMap(null)
    //     alert("Please select a state");
    // }else{
    //     var state = state.slice(0, 2);
    //     var my_json = JSON.stringify(locations)
    //         //We can use {'name': 'Lenovo Thinkpad 41A429ff8'} as criteria too
    //     var filtered_json = find_in_object(JSON.parse(my_json), { stateProvince: state });
    //     // if(filtered_json!=null&& filtered_json.length>0){
    //     //     var firstObjState = filtered_json[0].stateProvince;
    //     //     filtered_json = find_in_object(JSON.parse(my_json), {stateProvince: firstObjState});
    //     // }
    //     initMap(filtered_json)
    //     if (filtered_json == null || filtered_json == 0) {
    //         alert("Sorry, no results for this State!");
    //     }
    // }



    var zipCode = $("#zipCodeMap").val()
    var length = zipCode.length;
    if (length >= 5) {

        var my_json = JSON.stringify(locationData)
        var filtered_json;
        if (isOtherZipCode) {
            filtered_json = find_in_object(JSON.parse(my_json), { stateProvince: stateWiseCode });
        } else {
            filtered_json = JSON.parse(my_json);
            if (filtered_json.length != 1) {
                filtered_json = find_in_object(JSON.parse(my_json), { zipText: zipCode });
            }

            if (initData) {
                initData = false;
                var isDataCognivue = false;
                for (i = 0; i < filtered_json.length; i++) {
                    var isPrefferedOffice = filtered_json[i].cognivuePreferred
                    if (isPrefferedOffice == "Cognivue Preferred Audiologist") {
                        isDataCognivue = true
                    }

                }
                if (!isDataCognivue || filtered_json == null || filtered_json.length == 0) {
                    showHideCheckBox();
                    return;
                }

            }

        }



        initMap(filtered_json)
    } else {
        initData = true;
        initMap(null)
    }
}

function find_in_object(my_object, my_criteria) {

    return my_object.filter(function(obj) {
        return Object.keys(my_criteria).every(function(c) {
            return obj[c] == my_criteria[c];
        });
    });

}


function initMap(locations) {
    markers = [];
    cognivuePreferred = [];
    audiologyOffice = [];
    selectedLocation = [];
    zipCodeOffice = [];
    $('#locations div').remove();

    if (locations == null || locations.length == 0) {
        if (zipLat == null) {
            zipLat = 37.075039;
        }
        if (zipLong == null) {
            zipLong = -113.55568;
        }
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: zooom1,
            center: new google.maps.LatLng(zipLat, zipLong),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    } else {
        for (i = 0; i < locations.length; i++) {
            var isPrefferedOffice = locations[i].cognivuePreferred
            if (isPrefferedOffice == "Cognivue Preferred Audiologist") {
                cognivuePreferred.push(locations[i]);
            } else if (isPrefferedOffice == "Other Audiology Office") {
                audiologyOffice.push(locations[i]);
            }

        }
        if (isOtherPreferred) {
            locations = cognivuePreferred;
            if (audiologyOffice != null) {
                for (i = 0; i < audiologyOffice.length; i++) {
                    locations.push(audiologyOffice[i]);
                }
            }
        } else {
            locations = cognivuePreferred;
        }

        var firstObj = locations[0];

        if (firstObj != null) {
            zipLat = firstObj.latitude;
            zipLong = firstObj.longitude;
            if (isOtherPreferred && isOtherZipCode) {
                zoom = zooom1;
            } else if (isOtherPreferred) {
                zoom = zooom2;
            } else if (isOtherZipCode) {
                zoom = zooom1;
            } else {
                zoom = zooom3;
            }
        } else {
            zoom = zooom1;
        }
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: zoom,
            center: new google.maps.LatLng(zipLat, zipLong),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(infowindow, 'closeclick', function() {
            $("#locations .preffered-list").removeClass("selectedmap")

        });

        var marker, i;
        selectedLocation = locations;


        for (i = 0; i < locations.length; i++) {
            var icon = '../images/map_pin_org.png';
            var listIcon = '../images/Cognivue Circles-1.png';
            var isPrefferedOffice = locations[i].cognivuePreferred
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
                var phoneNumber = locations[i].officePhonNumber;
                if (phoneNumber != null) {
                    phoneNumber = locations[i].officePhonNumber.toString();
                    var first = phoneNumber.slice(0, 3);
                    var second = phoneNumber.slice(3, 6);
                    var third = phoneNumber.substring(6, phoneNumber.length);
                    phoneNumber = "(" + first + ") " + second + "-" + third;
                }

                var firstLast = locations[i].auDName;
                if (firstLast != null) {
                    firstLast = firstLast + ", AuD";
                } else {
                    firstLast = "";
                }
                icon = '../images/map_pin_org.png';
                listIcon = '../images/Cognivue Circles-1.png';
                var locationData = '<div class="preffered-list preffered-list_' + i + '" onClick="showMarker(' + i + ')"><img class="preffered-office-marker office-marker" src="' + listIcon + '" width="30"><div><div class="office-address"><p class="office-name">' + practiceName + '</p><p class="office-name office-person-name">' + firstLast + '</p><p class="office-address-details">' + fullStreet + '</p><p class="office-address-details">' + fullAddress + '</p><p onClick="clickOnPhone(\'' + practiceName.replace(/'/g, "\\'") + '\', \'' + firstLast.replace(/'/g, "\\'") + '\', \'' + fullStreet.replace(/'/g, "\\'") + '\', \'' + fullAddress.replace(/'/g, "\\'") + '\', \'' + phoneNumber + '\')" class="office-contact-details">Phone: <a href="tel:' + phoneNumber + '">' + phoneNumber + '</a></p><p class=""></p></div></div><div class="clear"></div></div>';
                $('#locations').append(locationData);

            } else {
                icon = '../images/map_pin_grey_org.png';
                if (isPrefferedOffice != null)
                    listIcon = '../images/map_pin_grey_org.png';
                else
                    listIcon = '';
                var locationData = '<div class="preffered-list preffered-list_' + i + '" onClick="showMarker(' + i + ')"><img class="preffered-office-marker office-marker" src="' + listIcon + '" width="30"><div><div class="office-address"><p class="office-name other-office-name">' + practiceName + '</p><p class="office-address-details">' + fullStreet + '</p><p class="office-address-details">' + fullAddress + '</p><p class="office-contact-details"></p></div></div><div class="clear"></div></div>';
                $('#locations').append(locationData);

            }

            var lat = eval(locations[i].latitude); //Note the value is in "" hence a string
            var long = eval(locations[i].longitude); //Note the value is in "" hence a string


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


        }

    }




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
        locationMarker = '<div class="preffered-map-list"><div><div class="office-address"><p class="office-name">' + practiceName + '</p><p class="office-name office-person-name">' + firstLast + '</p><p class="office-address-details">' + fullStreet + '</p><p class="office-address-details">' + fullAddress + '</p><p onClick="clickOnPhone(\'' + practiceName.replace(/'/g, "\\'") + '\', \'' + firstLast.replace(/'/g, "\\'") + '\', \'' + fullStreet.replace(/'/g, "\\'") + '\', \'' + fullAddress.replace(/'/g, "\\'") + '\', \'' + phoneNumber + '\')" class="office-contact-details">Phone: <a  href="tel:' + phoneNumber + '">' + phoneNumber + '</a></p><p class="cognive-Preferred-office-btn" onClick="clickCognivePreferred(\'' + practiceName.replace(/'/g, "\\'") + '\', \'' + firstLast.replace(/'/g, "\\'") + '\', \'' + fullStreet.replace(/'/g, "\\'") + '\', \'' + fullAddress.replace(/'/g, "\\'") + '\', \'' + phoneNumber + '\')">Email this information to me</p></div></div><div class="clear"></div></div>';
        //locationMarker = "<p class='cognive-Preferred-office-btn' onClick='clickCognivePreferred(\""+ practiceName+  "\")'>Email this information to me</p>";


    } else {
        locationMarker = '<div class="preffered-map-list"><div><div class="office-address"><p class="office-name other-office-name">' + practiceName + '</p><p class="office-address-details">' + fullStreet + '</p><p class="office-address-details">' + fullAddress + '</p><p class="office-contact-details"></p><p class="cognive-other-office-label">This office currently does not support<br/>Cognivue assessments!</p><p class="cognive-other-office-btn" onClick="clickCogniveOtherPreferred(\'' + practiceName + '\', \'' + firstLast + '\', \'' + fullStreet + '\', \'' + fullAddress + '\', \'' + phoneNumber + '\')">Request Cognivue service</p></div></div><div class="clear"></div></div>';

    }
    infowindow.setContent(locationMarker);
    infowindow.open(map, marker);
}

function showHideCheckBox() {
    if (!isOtherPreferred) {
        isOtherPreferred = true;
    } else {
        isOtherPreferred = false;
    }
    $("#otherAudiologyCheckbox").prop("checked", isOtherPreferred);


    if (!isOtherZipCode) {
        isOtherZipCode = true;
    } else {
        isOtherZipCode = false;
    }
    $("#checkboxForAllZipCode").prop("checked", isOtherZipCode);


    zipCodeSearch()

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

// function getDataCognivuePreferred(){
//     var zipCode = $("#zipCodeMap").val();
//     locationData = [];
//     $.ajax({
//         url : BASE_URL+"cognivuePreferred.json?orderBy=\"zipText\"&equalTo=\""+ zipCode+  "\"&print=pretty",
//         type: "GET",
//         success: function(data, textStatus, jqXHR)
//         {
//           console.log("data........"+ isEmpty(data));
//           if(isEmpty(data)){
//             //getDataUsZipCode(zipCode);
//           }else{
//             for (var key in data) {
//               if (data.hasOwnProperty(key)) { 
//                 locationData.push(data[key]);   
//                 console.log(data[key]);
//               }
//             }
//           }
//           getDataUsZipCode(zipCode);
//         },
//         error: function (jqXHR, textStatus, errorThrown)
//         {
//           resetClickSubmit();
//           var myJSON = JSON.parse(jqXHR.responseText);
//           alert(myJSON.error.message);
//           console.log("data","data......."+myJSON.error.message);
//         }
//     });
// }
// function getDataUsZipCode(zipCode){
//     $.ajax({
//         url : BASE_URL+"usZipCodeLatitudeAndLongitude.json?orderBy=\"zipText\"&equalTo=\""+ zipCode+  "\"&print=pretty",
//         type: "GET",
//         success: function(data, textStatus, jqXHR)
//         {
//           console.log("data........"+ isEmpty(data));
//           if(isEmpty(data)){
//             alert("Please enter valid zipcode");
//            }else{
//             for (var key in data) {
//               if (data.hasOwnProperty(key)) { 
//                 locationData.push(data[key]);  
//                }
//             }
//             zipCodeSearch();
//           }
//         },
//         error: function (jqXHR, textStatus, errorThrown)
//         {
//           resetClickSubmit();
//           var myJSON = JSON.parse(jqXHR.responseText);
//           alert(myJSON.error.message);
//           console.log("data","data......."+myJSON.error.message);
//         }
//     });
// }

function getDataUsZipCode() {
    var zipCode = $("#zipCodeMap").val();
    locationData = [];
    stateWiseCode = "";
    zipLat = null;
    zipLong = null;
    $.ajax({
        url: BASE_URL + "usZipCodeLatitudeAndLongitude.json?orderBy=\"zipText\"&equalTo=\"" + zipCode + "\"&print=pretty",
        type: "GET",
        success: function(data, textStatus, jqXHR) {
            console.log("data........" + isEmpty(data));
            if (isEmpty(data)) {
                alert("Please enter valid zipcode");
            } else {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var stateCode = data[key].stateProvince;
                        zipLat = data[key].latitude;
                        zipLong = data[key].longitude;
                        getStateWiseData(stateCode);
                        return;
                    }
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var myJSON = JSON.parse(jqXHR.responseText);
            alert(myJSON.error.message);
            console.log("data", "data......." + myJSON.error.message);
        }
    });
}

function clickOnPhone(practiceName, firstLast, fullStreet, fullAddress, phoneNumber){
    var formData = {practiceName:practiceName,firstLast:firstLast, fullStreet:fullStreet, fullAddress:fullAddress, phoneNumber:phoneNumber, email:emailID, createdDate: getCurrentDate(), dateTime:getCurrentDateMillisec()}; 
    captureEventPhoneNumber(formData);
}


function getStateWiseData(stateCode) {
    stateWiseCode = stateCode;
    $.ajax({
        url: BASE_URL + "cognivuePreferred.json?orderBy=\"stateProvince\"&equalTo=\"" + stateCode + "\"&print=pretty",
        type: "GET",
        success: function(data, textStatus, jqXHR) {
            if (isEmpty(data)) {
                //alert("Please enter valid zipcode");
            } else {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        locationData.push(data[key]);
                    }
                }
                zipCodeSearch();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var myJSON = JSON.parse(jqXHR.responseText);
            alert(myJSON.error.message);
            console.log("data", "data......." + myJSON.error.message);
        }
    });
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
                window.open("https://www.google.com/#q=" + searchText);
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