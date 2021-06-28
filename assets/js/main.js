$(document).ready(function () {
  jQuery.migrateMute = true;

  function click(tag, pixel, zindex, transition) {
    console.log(tag, pixel, zindex, transition)
    $(tag).on("click", function (el) {
      console.log(el)
      $("#main-menu").css({ "margin-right": pixel });
      $(".elem4").css({ "z-index": zindex, transition: `${transition}s` });
      click("#cancel", "-300px", "1", "1");
    });
  };
  click("#menu", "0px", "-1", "0");
  
  makeNavigation()
  makeFooter()

  //stopPageScroll()

  function makeFooter() {
    $("footer").load("./templates/footer.html")
  }

  
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
});

