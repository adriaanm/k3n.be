(function($) {
  var lastPosition = -1
  var initialized  = false
  var fromOffsets  = []
  var movingElems  = []
  var toOffsets    = []
  var done         = 0
  var menuDone     = 0
  var height       = -1
  var isTablet     = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/)

  setVisibilities(0)

  $(document).ready( function() {
    setTimeout(function() {
      computeCaches()
      $(window).on("resize", computeCaches)
      $(".dateFrom").hover(bounce)
      setTimeout(bounce, 2000)
      loop()
    }, 500)
  })

  function interpolate(pct, from, moving, to) {
    if (from == undefined) return

    var topInter  = from.top + (to.top - from.top) * pct
    var leftInter = from.left + (to.left - from.left) * pct

    moving.zIndex(100) // TODO: can this be done once in CSS??
    moving.offset({
      top: topInter,
      left: leftInter
    }) // actual movement...
  }

  function computeCaches() {
    lastPosition = -1
    done         = 0
    menuDone     = 0
    height       = $(window).height()
    initialized  = $(".dateFrom #two").offset() != undefined

    if (!initialized) return

    if ($(".dateFrom #five").length > 0) {
      fromOffsets=[
        $(".dateFrom #zero").offset() ,
        $(".dateFrom #one").offset()  ,
        $(".dateFrom #two").offset()  ,
        $(".dateFrom #three").offset(),
        $(".dateFrom #four").offset() ,
        $(".dateFrom #five").offset()]

      movingElems=[
        $(".dateMoving #zero") ,
        $(".dateMoving #one")  ,
        $(".dateMoving #two")  ,
        $(".dateMoving #three"),
        $(".dateMoving #four") ,
        $(".dateMoving #five")]

      toOffsets=[
        $(".dateTo #zero").offset() ,
        $(".dateTo #one").offset()  ,
        $(".dateTo #two").offset()  ,
        $(".dateTo #three").offset(),
        $(".dateTo #four").offset() ,
        $(".dateTo #five").offset()]
    } else {
      fromOffsets=[
        $(".dateFrom #two").offset() ,
        $(".dateFrom #zero").offset(),
        $(".dateFrom #one").offset() ,
        $(".dateFrom #four").offset(),
        $(".dateFrom #two").offset()]

      movingElems=[
        $(".dateMoving #two"),
        $(".dateMoving #zero"),
        $(".dateMoving #one"),
        $(".dateMoving #four"),
        $(".dateMoving #year")]

      toOffsets=[
        $(".dateTo #two").offset(),
        $(".dateTo #zero").offset(),
        $(".dateTo #one").offset(),
        $(".dateTo #four").offset(),
        $(".dateTo #year").offset()]
    }
  }

  function setVisibilities(pct) {
    $(".dateFrom").css('visibility',   (pct <= 0)   ? 'visible' : 'hidden')
    $(".dateMoving").css('visibility', (pct < 1)    ? 'visible' : 'hidden')
    $(".dateTo").css('visibility',     (pct >= 1)   ? 'visible' : 'hidden')
    $(".menu").css('visibility',       (pct >= 1.2) ? 'visible' : 'hidden')
  }

  // TODO: can we make this work on mobile?
  function aniDate() {
    var top = window.pageYOffset
    // scale a bit so we arrive before we hit the third slide
    var pct = (top / height) / .85

    setVisibilities(pct)

    if (pct <= 1) {
      interpolate(pct, fromOffsets[0], movingElems[0], toOffsets[0])
      interpolate(pct, fromOffsets[1], movingElems[1], toOffsets[1])
      interpolate(pct, fromOffsets[2], movingElems[2], toOffsets[2])
      interpolate(pct, fromOffsets[3], movingElems[3], toOffsets[3])
      interpolate(pct, fromOffsets[4], movingElems[4], toOffsets[4])
      interpolate(pct, fromOffsets[5], movingElems[5], toOffsets[5])
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

  function loop() {
    if (lastPosition == window.pageYOffset) {
      // dumdidum
      console.log("skipped")
    } else {
      lastPosition = window.pageYOffset

      aniDate()
    }

    scroll(loop)
  }

  function bounce() {
    if (window.pageYOffset == 0){
      if (isTablet) {
        $('html, body').animate({
          scrollTop: $("div #date").offset().top
        }, 10000, "linear")
      } else {
        $('html, body').animate({
          scrollTop: 200
        }, 300, "linear", function() {
          $('html, body').animate({
            scrollTop: 0
          }, 300, "linear", function(){$(".dateMoving").css('visibility', 'hidden')})
        })
      }
    }
  }

})(jQuery)
