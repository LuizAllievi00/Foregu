
var app = {
  startDB: function () {
    console.log(2)

      this.db = new loki('dab.db', {
        autosave: true,
        autosaveInterval: 1000,
        autoload: true
      });
      this.db.loadDatabase();
      this.show()


  },
  addCity: function (){
    var cities = this.db.getCollection('cities');
    if (!cities) {
      cities = this.db.addCollection('cities')
    }
    var new_city = {
      title: $("#city").val()
    };
    cities.insert(new_city);
    this.show()
  },
  delete: function(){
    try {
      this.db.deleteDatabase()
    } catch (e) {

    } finally {

    }

  },
  show: function(){
    try {
      console.log(7)
    $("#nav-mobile").html("<li><a href='#''><h5>Favoritos</h5></a></li>")
    for (city in this.db.getCollection('cities').data){
      li = $("<li></li>")
      a = $("<a></a>")
      a.attr('class', "saved_city")
      a.html(this.db.getCollection('cities').data[city].title)
      li.append(a)
      $("#nav-mobile").append(li)
    }
  } catch (e) {
    $("#nav-mobile").append("Nenhuma cidade salva")
  } finally {

  }}

}


$(document).ready( function () {
  app.delete()
    app.startDB()
    $("#save").click(function(){
      app.addCity();
    })
  })
