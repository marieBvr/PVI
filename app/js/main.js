//****************
// PVI 
// Version : prototype
// Author : Marie Lefebvre
//****************

// Navigation bar
//*********************************************************
var $content = $('.menu-content');

function showContent(type) {
  // this assumes that you really must select
  // the content using a class and not an ID (which you've 
  // referenced in the href)
  $content.hide().filter('.' + type).show();
}

$(document).on('click', '.menu', function() {
  // get the type to pass to showContent by grabbing
  // the hash from the anchor href and removing the first
  // character (the #)
  var target = $(this).attr('href').replace("#", "");
  showContent(target);
}); 

// show 'interactome' content only on page load
showContent('interactome');
