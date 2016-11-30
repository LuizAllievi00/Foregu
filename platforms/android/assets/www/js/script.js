function convert_d(obj){
  has = obj.hasOwnProperty("dt_txt");
  today = new Date();
  var day = ((today.getDate() > 9) ? today.getDate() : ("0" + today.getDate()))
  date =  day + "/" + (today.getMonth() + 1)+ "/" + today.getFullYear()
  if (has) {
    date = obj.dt_txt.slice(8, 10) + "/" + obj.dt_txt.slice(5, 7) + "/" + obj.dt_txt.slice(0, 4)
  }
  return date
}
function convert_h(obj){
  return obj.dt_txt.slice(8, 10) + "/" + obj.dt_txt.slice(5, 7) + "/" + obj.dt_txt.slice(0, 4) + " "+ obj.dt_txt.slice(11)
}
$(document).ready(function() {
  function get_template(obj, xxx){
    stringa = "<div id='name'>"
    + "<h4>";
    if (xxx){
    stringa += convert_h(obj)}
    else {
      stringa += convert_d(obj)
    }
    stringa += "</h4>" + "<img id='icon' src='http:openweathermap.org/img/w/" + obj.weather[0].icon + ".png' </img>"
    + "</div>"
    + "<table class='bordered highlight responsive-table'>"
    + "<thead>"
    + "<tr>"
    + "<th data-field='max_temp'> Temperatura Máxima </th>"
    + "<th data-field='min_temp'>Temperatura Mínima</th>"
    + "<th data-field='humidity'>Umidade</th>"
    + "<th data-field='description'>Descrição</th>"
    + "</tr>"
    + "</thead>"
    + "<tbody>"
    + "<tr>"
    + "<td>" + obj.main.temp_max + " ºC </td>"
    + "<td>" + obj.main.temp_min + " ºC </td>"
    + "<td>" + obj.main.humidity + " %  </td>"
    + "<td>" + obj.weather[0].description[0].toUpperCase() + obj.weather[0].description.slice(1) + "</td>"
    + "</tr>"
    + "</tbody>"
    + "</table>"
    + "</div>";
    return stringa
  }




    function putDayData(obj){
        x = get_template(obj, 0)
        $("#actual").html(x)
    }



    function put5DayData(obj){
    days = []
    actual_day = ""
    last_day = 0
    index = 0
    hours = [[],[],[],[],[]]
    go = 0
    go2 = 0
    for (var elem in obj.list) {

      if (obj.list[elem].dt_txt.slice(11, 13) == "00"){
        if (!go){go = true}
        actual_day = obj.list[elem].dt_txt.slice(8, 10)
        if (actual_day != last_day && go2){
          last_day = actual_day
          index += 1
        }
        if (!go2){go2 = true}
        days.push(obj.list[elem])
      }
      if (go){
        hours[index].push(obj.list[elem])
      }
    }
    for (var day in days) {
      index_day = "#day" + (parseInt(day) + parseInt(1))

      $(index_day).html(get_template(days[day], false))
    }

    }

    function request(city_name){
      $.ajax({
          method: "GET",
          url: "http://api.openweathermap.org/data/2.5/weather",
          data: {
              q: city_name,
              lang: "pt",
              units: "metric",
              APPID: "2e778899ab2c9c1c529750234dde70db"
          },
          dataType: "json",
          success: function(data) {
              putDayData(data);
          },
          failure: function(data){
              $("#actual").empty();
          }
      });

      $.ajax({
          method: "GET",
          url: "http://api.openweathermap.org/data/2.5/forecast",
          data: {
              q: city_name,
              lang: "pt",
              units: "metric",
              APPID: "2e778899ab2c9c1c529750234dde70db"
          },
          dataType: "json",
          success: function(data) {
              put5DayData(data);
          },
          failure: function(data){
              $("#5day").empty();
          }
      });
    }


    $("#btn-srch").click(function(ev) {
        ev.preventDefault();

        $('#section2').css({'display':'block'});
        var n = $('#section1').height();
        $('html, body').animate({ scrollTop: n }, 1000);
        request($("#city").val())

    });
    $(".day").click(function(ev){
      $('#section3').css({'display':'block'});
      n = parseInt($("#section2").height()) + parseInt($("#section1").height())
      $('html, body').animate({ scrollTop: n }, 1000);

      ev.preventDefault()
      index = parseInt(ev.currentTarget.id.slice(3)) - 1
      $("#hours").empty()
      for (var h_elem in hours[index]){
        $("#hours").append(get_template(hours[index][h_elem], 1))
      }
    });

  $("#back-top").click(function(){
    $('html, body').animate({ scrollTop: 0 }, 1000);
  });
  $("#back-mid").click(function(){
    n = parseInt($("#section1").height())
    $('html, body').animate({ scrollTop: n }, 1000);
  });
  $("#side-lado").click(function(){
      $("#side-nav").sideNav({
      menuWidth: 300, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
    })
  });

  $(".saved_city").click(function(ev){
    $('#section2').css({'display':'block'});
    var n = $('#section1').height();
    $('html, body').animate({ scrollTop: n }, 1000);
    request(ev.target.innerHTML)
  });

});
