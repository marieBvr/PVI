
// var $menu = $('menu-content')


// document.getElementById('menu').onclick = function(){

//     var id = $(this).attr('href');
//     console.log(id);
//     $('.' + id.replace("#", "")).show().siblings().hide();    
// }


var $content = $('.menu-content');

function showContent(type) {
  // this assumes that you really must select
  // the content using a class and not an ID (which you've 
  // referenced in the href)
  console.log(type);
  $content.hide().filter('.' + type).show();
}

$(document).on('click', '.menu', function() {
  // get the type to pass to showContent by grabbing
  // the hash from the anchor href and removing the first
  // character (the #)
  var target = $(this).attr('href').replace("#", "");
  showContent(target);
}); 

// show 'about' content only on page load (if you want)
showContent('interactome');



d3.json("../data/data.json", function(energy) {

})
