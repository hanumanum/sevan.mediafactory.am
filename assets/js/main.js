$(document).ready(function () {
  const click = (tag, pixel, zindex, transition) => {
    $(tag).on("click", () => {
      $("#main-menu").css({ "margin-right": pixel });
      $(".elem4").css({ "z-index": zindex, transition: `${transition}s` });
    });
  };
  click("#menu", "0px", "-1", "0");
  click("#cancel", "-300px", "1", "1");
  makeNavigation()


  function makeNavigation() {
    $('#main-menu').load('./templates/nav.html', function () {
      $('.menu-item').removeClass("menu-item-active")
      const slugs = window.location.pathname.split("/")
      const slug = slugs[slugs.length - 1]
      const slug_article = slugs[slugs.length - 2]

      $('.menu-item a').each(function (i, l) {
        if (slug_article == 'articles' && $(l).prop("href").indexOf("articles")) {
          $(l).parent().addClass("menu-item-active")
        }

        if ($(l).prop("href") != "" && $(l).prop("href").indexOf(slug) >= 0) {
          $(l).parent().addClass("menu-item-active")
        }
      })
    });

  }

  /*
  $(".pollution-intro").hide();
  showElement(".pollution-intro")


  function showElement(selector) {
    $(window).scroll(function () {
      var top_of_element = $(selector).offset().top;
      var bottom_of_element = $(selector).offset().top + $(selector).outerHeight();
      var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
      var top_of_screen = $(window).scrollTop();
      
      if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)) {
        setTimeout(function(){
          $(selector).fadeIn("slow");
        },2000)
      }
    });
  }
*/





});

