$(document).ready(function() {

function interpolate(pct, from, moving, to) {
  var topInter = from.top + (to.top - from.top) * pct
  var leftInter = from.left + (to.left - from.left) * pct

  moving.zIndex(100) // TODO: can this be done once in CSS??
  moving.offset({
    top: topInter,
    left: leftInter
  }) // actual movement...
}

// TODO: can we make this work on mobile?
function aniDate() {
  var top = window.pageYOffset

  // scale a bit so we arrive before we hit the third slide
  var pct = (top / $(window).height()) / .85

  var dateFrom = $(".dateFrom")
  var dateMoving = $(".dateMoving")
  var dateTo = $(".dateTo")

  if (pct <= 0) {
    dateFrom.css('visibility', 'visible')
  } else if (pct < 1) {
    dateFrom.css('visibility', 'hidden')
    dateMoving.css('visibility', 'visible')
    dateTo.css('visibility', 'hidden')
  } else if (pct >= 1) {
    dateMoving.css('visibility', 'hidden')
    dateTo.css('visibility', 'visible')
  }

  if (pct < 1.2) $("#menu").css('visibility', 'hidden')
  else $("#menu").css('visibility', 'visible')

  if (pct <= 1) {
    interpolate(pct, $(".dateFrom #two").offset(), $(".dateMoving #two"), $(".dateTo #two").offset())
    interpolate(pct, $(".dateFrom #zero").offset(), $(".dateMoving #zero"), $(".dateTo #zero").offset())
    interpolate(pct, $(".dateFrom #one").offset(), $(".dateMoving #one"), $(".dateTo #one").offset())
    interpolate(pct, $(".dateFrom #four").offset(), $(".dateMoving #four"), $(".dateTo #four").offset())
    interpolate(pct, $(".dateFrom #two").offset(), $(".dateMoving #year"), $(".dateTo #year").offset())
  }
}

// based on https://gist.github.com/Warry/4254579
// Detect request animation frame
var scroll = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame || 
  function(callback) {  // IE Fallback, you can even fallback to onscroll
    window.setTimeout(callback, 1000 / 60)
  }

var lastPosition = -1
var initialized = false

$(window).on("resize", function() { initialized = false })
 
function loop() {
  // Avoid calculations if not needed
  if (!initialized) {
    initialized = $(".dateFrom #two").offset() != undefined
  } else if (lastPosition == window.pageYOffset) {
    // dumdidum
  } else {
    lastPosition = window.pageYOffset

    aniDate()
  }

  scroll(loop)
}
loop()

});
