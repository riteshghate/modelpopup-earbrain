var BASE_URL = "https://earbrain-7ace2.firebaseio.com/"
var zooom1 = 8;
var zooom2 = 15;
var zooom3 = 20;
var isClickEnable = false;
var zipCode = "";
var stateCode = "";


var selectedLatitude;
var selectedlongitude;
var selectedStateCode;
var selectionType = 0;

$("#searchZipCode").keyup(function() {
  resetClickSubmit();
  var zipCodeTxt = $("#searchZipCode").val();
  var length = zipCodeTxt.length;
  if (length >= 5) {
    $.ajax({
      url : BASE_URL+"usZipCodeLatitudeAndLongitude.json?orderBy=\"zipText\"&equalTo=\""+ zipCodeTxt+  "\"&print=pretty",
      type: "GET",
      success: function(data, textStatus, jqXHR)
      {
        console.log("data........"+ isEmpty(data));
        if(isEmpty(data)){
          resetClickSubmit();
          alert("Please enter valid zipcode");
        }else{
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
                
                isClickEnable = true;  
                var obj = data[key];     
                console.log(obj);
                
                zipCode = obj.zipText;
                stateCode = obj.stateProvince;
                selectedLatitude = obj.latitude;
                selectedlongitude = obj.longitude;
                selectedStateCode = obj.stateProvince;
                console.log("data......"+obj.stateProvince, obj.latitude, obj.longitude);
                //$("#stateCode").val(data[key].stateProvince);
                getCognivuePreferredOfficeZip(zipCode, selectedLatitude, selectedlongitude, selectedStateCode);    
                return;
            }
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        resetClickSubmit();
        var myJSON = JSON.parse(jqXHR.responseText);
        alert(myJSON.error.message);
        console.log("data","data......."+myJSON.error.message);
      }
  });
  }
});
$("#searchZipCode").click(function() {
  selectionType= 1;
  resetButtons();
  resetDropDown();
  resetLocation();
  $(this).addClass("select")
  $("#stateName").addClass("unSelect")
  $("#cityName").addClass("unSelect")
  $(".current_button_div").addClass("unSelect")
});
function ClickSubmit() {
    console.log(navigator.onLine);
    var zipCodeTxt = $("#searchZipCode").val();
    var length = zipCodeTxt.length;
    if (navigator.onLine) {
      var name = $('#name').val();
     var emailId = $("#email_id").val()
     if(selectionType == 1){
      if (length < 5) {
             alert("Please enter valid zipcode");
             return;
         }
     }else if(selectionType == 2){
      zipCodeTxt = zipCode;
     var span1 =  $(".select_span1").is(":visible");
     var span2 =  $(".select_span2").is(":visible");

      if(span1 || span2){
        alert("Please select state and city");
        return;
      }
    // }else if(selectionType == 3){
    //   if($('#currentLocation').prop("checked") == false){
    //     alert("Please select current location");
    //     return;
    //   }
    // }else if(selectionType == 0){
    //   alert("Please select fileds");
    //     return;
    }else if(selectionType == 3){
      if($('#currentLocation').prop("checked") == false){
        alert("Please select current location");
        return;
      }else if(selectedLatitude == null || selectedlongitude == null || selectedLatitude == "" || selectedlongitude == "" || selectedLatitude == undefined || selectedlongitude == undefined){
        alert("Please enable the current location");
        return;
      }
    }
      captureEventFindAnAudiologist(name, emailId, zipCodeTxt);
        // var name = $('#name').val();
        // var emailId = $("#email_id").val()
        // // if (name == "") {
        // //     alert("Please enter name");
        // //     return;
        // // } else if (emailId == "") {
        // //     alert("Please enter email");
        // //     return;
        // // } else 
        // if (length < 5) {
        //     alert("Please enter valid zipcode");
        //     return;
        // } else /* if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailId)) */ {
        //     captureEventFindAnAudiologist(name, emailId, zipCodeTxt);
            
        //  }
        // // else {
        // //     alert("You have entered an invalid email address!")
        // //     return false;
        // // }


    } else {
        alert("Please check internet connection");
    }




}

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

function resetClickSubmit() {
    isClickEnable = false;
    zipCode = "";
    stateCode = ""
}

function alert(message) {
    swal({
        title: "Alert",
        text: message
    });
}

function captureEventFindAnAudiologist(name, email, zipcode) {
    var year = getCurrentYear();
    var week = getCurrentWeek();
    var dateDDMMYY = getCurrentDateDDMMYYYY();
    var url = BASE_URL+"EBEventFindAnAudiologist/"+year+"/"+week+"/"+dateDDMMYY+".json";
    var formData = {name:name,email:email, zipCode:zipcode, createdDate: getCurrentDate(), dateTime:getCurrentDateMillisec()}; 
    var settings = {
        "url": url,
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify(formData),
      };
      
      $.ajax(settings).done(function (response) {
        resetLocation();
        resetZip();
        resetDropDown();
        redirect("map.html?zipcode=" + zipcode + "&state=" + selectedStateCode + "&latitude=" + selectedLatitude+ "&longitude=" + selectedlongitude);
            //var s_a = document.getElementById("mylink");
           // s_a.href = "map.html?zipcode=" + zipcode + "&emailId=" + email + "&name=" + name;
      });
}

function captureEventCognivuePreferred(formData) {
    var year = getCurrentYear();
    var week = getCurrentWeek();
    var dateDDMMYY = getCurrentDateDDMMYYYY();
    var url = BASE_URL+"EBEventCognivuePreferred/"+year+"/"+week+"/"+dateDDMMYY+".json";
    var settings = {
        "url": url,
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify(formData),
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
      });
}

function captureEventOtherAudiologist(formData) {
    var year = getCurrentYear();
    var week = getCurrentWeek();
    var dateDDMMYY = getCurrentDateDDMMYYYY();
    var url = BASE_URL+"EBEventOtherAudiologist/"+year+"/"+week+"/"+dateDDMMYY+".json";
    var settings = {
        "url": url,
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify(formData),
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
      });
}
function captureEventCanNotFindTheAUD(formData) {
    var year = getCurrentYear();
    var week = getCurrentWeek();
    var dateDDMMYY = getCurrentDateDDMMYYYY();
    var url = BASE_URL+"EBEventCanNotFindTheAUD/"+year+"/"+week+"/"+dateDDMMYY+".json";
    var settings = {
        "url": url,
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify(formData),
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
      });
}
function captureEventPhoneNumber(formData) {
    var year = getCurrentYear();
    var week = getCurrentWeek();
    var dateDDMMYY = getCurrentDateDDMMYYYY();
    var url = BASE_URL+"EBEventPhoneNumber/"+year+"/"+week+"/"+dateDDMMYY+".json";
    var settings = {
        "url": url,
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify(formData),
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
      });
}
function redirect (url) {
    var ua        = navigator.userAgent.toLowerCase(),
        isIE      = ua.indexOf('msie') !== -1,
        version   = parseInt(ua.substr(4, 2), 10);

    // Internet Explorer 8 and lower
    if (isIE && version < 9) {
        var link = document.createElement('a');
        link.href = url;
        document.body.appendChild(link);
        link.click();
    }

    // All other browsers can use the standard window.location.href (they don't lose HTTP_REFERER like Internet Explorer 8 & lower does)
    else { 
        window.location.href = url; 
    }
}



function getCurrentDate(){
    var d = new Date();
    return d.toUTCString();
}
function getCurrentDateMillisec(){
    var d = new Date();
    return d.getTime();
}

function getCurrentYear(){
    var d = new Date();
    
    return d.getFullYear();
}

function getCurrentWeek(){
var today = new Date();
var weekno = today.getWeek();
return weekno;

    
}

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
    var dayOfYear = ((today - onejan +1)/86400000);
    return Math.ceil(dayOfYear/7)
};

function getCurrentDateDDMMYYYY(){
    var date = new Date();

    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();


    return d+"-"+m+"-"+y;
}

//DROPDOWN SEARCH BUTTON

function myFunction() {
  selectionType= 2;
  $("#stateDropdown").toggle();
  $("#cityDropdown").hide();
  resetButtons();
  resetZip();
  resetLocation();
  $("#searchZipCode").addClass("unSelect")
  $("#stateName").addClass("select")
  $("#cityName").addClass("select")
  $(".current_button_div").addClass("unSelect")

}

function filterState() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("stateDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

//DROPDOWN SEARCH BUTTON

function myCities() {



  selectionType= 2;
  $("#cityDropdown").toggle();
  $("#stateDropdown").hide();
  resetButtons();
  resetZip();
  $("#searchZipCode").addClass("unSelect")
  $("#stateName").addClass("select")
  $("#cityName").addClass("select")
  $(".current_button_div").addClass("unSelect")
}

function filterCity() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput2");
  filter = input.value.toUpperCase();
  div = document.getElementById("cityDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}




function getStateData(abbreviation, name){
  $("#cityName").text("City");
  $(".select-container-in2 .select_span2").show();
  $("#cityData").empty();
  $("#stateName").text(name);
  $("#stateDropdown").toggle();
  $(".select-container-in1 .select_span1").hide();
  getCityWiseData(abbreviation);
}


function getCityData(city, zip, latitude, longitude, stateProvince){
  selectedLatitude = latitude;
  selectedlongitude = longitude;
  selectedStateCode = stateProvince;
  zipCode = zip;
  console.log("city select......"+selectedLatitude, selectedlongitude, selectedStateCode);
  $("#cityName").text(city);
  $("#cityDropdown").toggle();
  $(".select-container-in2 .select_span2").hide();
}

getStateWiseData()
function getStateWiseData(){
    $.ajax({
      url : BASE_URL+"UsaStates.json?print=pretty",
      type: "GET",
      success: function(data, textStatus, jqXHR)
      {
        console.log("data........"+ isEmpty(data));
        if(isEmpty(data)){
          console.log("No data");
        }else{
          for (var key in data) {
                var obj = data[key];     
                console.log(obj);
                console.log("data......"+obj.abbreviation, obj.name);
                
                $("#stateData").append("<a onclick='getStateData(\""+obj.abbreviation+"\", \""+obj.name+"\")' href='#"+obj.name+"'>"+obj.abbreviation+" - "+obj.name+"</a>");
                //$("#stateCode").val(data[key].stateProvince);
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        var myJSON = JSON.parse(jqXHR.responseText);
        console.log("data","data......."+myJSON.error.message);
      }
  });
}


function getCityWiseData(abbreviation){
  
    $.ajax({
      url : BASE_URL+"usZipCodeLatitudeAndLongitude.json?orderBy=\"stateProvince\"&equalTo=\"" + abbreviation + "\"&print=pretty",
      type: "GET",
      success: function(data, textStatus, jqXHR)
      {
        console.log("data........"+ isEmpty(data));
        if(isEmpty(data)){
          console.log("No data");
          $("#cityData").append("<h3 class='no-data-dropdwn'>There aren't any records<br> for this search</h3>");
          
        }else{
          for (var key in data) {
                var obj = data[key];     
                console.log("asasas....."+obj);
                $("#cityData").append("<a onclick='getCityData(\""+obj.city+"\", \""+obj.zipText+"\", \""+obj.latitude+"\", \""+obj.longitude+"\", \""+obj.stateProvince+"\")' href='#"+obj.city+" - "+obj.zipText+"'>"+obj.city+" - "+obj.zipText+"</a>");
                //$("#stateCode").val(data[key].stateProvince);
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        var myJSON = JSON.parse(jqXHR.responseText);
        console.log("data","data......."+myJSON.error.message);
      }
  });
}



/* $("#currentLocation").change(function() {
  selectionType= 3;
  if(this.checked) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
  }else{
    selectedLatitude = "";
    selectedlongitude = "";
    selectedStateCode = "";
    selectionType= 0;
  }
  resetButtons();
  resetDropDown();
  resetZip();
  $("#searchZipCode").addClass("unSelect")
  $("#stateName").addClass("unSelect")
  $("#cityName").addClass("unSelect")
  $(".current_button_div").addClass("select")
}); */
$("#currentLocation").change(function() {
  selectionType= 3;
  selectedLatitude = "";
  selectedlongitude = "";
  selectedStateCode = "";
  if(this.checked) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
  }
  resetButtons();
  resetDropDown();
  resetZip();
  $("#searchZipCode").addClass("unSelect")
  $("#stateName").addClass("unSelect")
  $("#cityName").addClass("unSelect")
  $(".current_button_div").addClass("select")
});


function showPosition(position) {
  selectedLatitude = position.coords.latitude;
  selectedlongitude = position.coords.longitude;
  selectedStateCode = "";
  console.log("city select......"+selectedLatitude, selectedlongitude, selectedStateCode);
  console.log("Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude);
}
function resetButtons(){
  $("#searchZipCode").removeClass("unSelect")
  $("#stateName").removeClass("unSelect")
  $("#cityName").removeClass("unSelect")
  $(".current_button_div").removeClass("unSelect")

  $("#searchZipCode").removeClass("select")
  $("#stateName").removeClass("select")
  $("#cityName").removeClass("select")
  $(".current_button_div").removeClass("select")
}

function resetDropDown(){
  $("#stateDropdown").hide();
  $("#cityDropdown").hide();

  $("#stateName").text("State");
  $(".select-container-in1 .select_span1").show();

  $("#cityName").text("City");
  $(".select-container-in2 .select_span2").show();
}


function resetZip(){
  $("#searchZipCode").val("");
}
function resetLocation(){
  $("#currentLocation").prop("checked", false);
}
$(document).ready(function(){
  $(".dropdown").click(function(){
    $(this).find("dropdown-content").slideToggle("fast");
  });
});
$(document).on("click", function(event){
  var $trigger = $(".dropdown");
  if($trigger !== event.target && !$trigger.has(event.target).length){
      $(".dropdown-content").slideUp("fast");
  }            
});


function getCognivuePreferredOfficeZip(zipCode) {
    $.ajax({
        url: BASE_URL + "cognivuePreferred.json?orderBy=\"zipText\"&equalTo=\"" + zipCode + "\"&print=pretty",
        type: "GET",
        success: function(data, textStatus, jqXHR) {
            if (isEmpty(data)) {
                //alert("Please enter valid zipcode");
            } else {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if(data[key]!=null){
                           var cognivuePreferred = data[key].cognivuePreferred
                           if(cognivuePreferred == "Cognivue Preferred Audiologist"){
                              selectedLatitude = data[key].latitude;
                              selectedlongitude = data[key].longitude;
                              selectedStateCode = data[key].stateProvince;
                            return;
                           }
                        }
                        
                    }
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var myJSON = JSON.parse(jqXHR.responseText);
           console.log("data", "data......." + myJSON.error.message);
        }
    });
} 