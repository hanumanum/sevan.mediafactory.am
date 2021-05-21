$(document).ready(function () {
  const click = (tag, pixel, zindex, transition) => {
    $(tag).on("click", () => {
      $("#main-menu").css({ "margin-right": pixel });
      $(".elem4").css({ "z-index": zindex, transition: `${transition}s` });
    });
  };
  click("#menu", "0px", "-1", "0");
  click("#cancel", "-300px", "1", "1");
});