/**
 * based on fullPage 1.5.2 (https://github.com/alvarotrigo/fullPage.js -- Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo)
 */

(function($) {
  // list of divs whose id match the href (minus the #) of a menu item
  // sorted so that last item comes first (we'll use find first while scrolling)
  var sectionsInMenu = []

  var isTablet = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/)

  var windowsHeight = $(window).height()

  var currentSection = undefined

  $(window).on('load', function() {
    $('.section').each(function(index){
      if (index == 0) {
        $(this).addClass('active')
      }

      $(this).css('height', windowsHeight + 'px')
    })

    // get divs that have a menu item, so we can activate it on scrolling there (http://stackoverflow.com/a/9980042)
    sectionsInMenu = _.sortBy($('.menu a').map(function() {
      return sectionFromId(idFromHash(this.hash))
    }), function(div) {
      return -div.offset().top
    })

    scrollTo(sectionFromId(idFromHash(window.hash)))
  })

  if (!isTablet) {
    var resizeId

    //when resizing the site, we adjust the heights of the sections
    $(window).resize(function() {
      //in order to call the functions only when the resize is finished
      //http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
      clearTimeout(resizeId)
      resizeId = setTimeout(setSizes, 500)
    })
  }

  $(window).bind('orientationchange', function() {
    setSizes()
  })

  //when scrolling...
  $(window).scroll(function(e) {
    var scrollTop = $(window).scrollTop()

    // first one, because list is sorted by descending offset().top
    setCurrentSection(_.find(sectionsInMenu, function(section) {
      return section.offset().top <= scrollTop
    }))
  })

  $(window).on('hashchange', function() {
    scrollTo(sectionFromId(idFromHash(window.hash)))
  })

  function idFromHash(hash) {
    return hash.substring(1)
  }

  function sectionFromId(id) {
    $('div[id="' + id + '"]')
  }

  function setCurrentSection(element) {
    if (element != currentSection) {
      currentSection = element

      // $('.section.active').removeClass('active')
      currentSection.addClass('active').siblings().removeClass('active')

      var hash = '#' + currentSection.id

      location.hash = hash

      $('.menu a').find('.active').removeClass('active')
      $('.menu a').find('[href="' + hash + '"]').addClass('active')
    }
  }

  function scrollTo(element) {
    if (element != currentSection) {
      setCurrentSection(element)
      $('html, body').animate({
        scrollTop: element.offset().top
      }, 700, "easeInQuart")
    }
  }

  function setSizes() {
    windowsHeight = $(window).height()

    //text and images resizing
    $('.section').each(function() {
      $(this).css('height', windowsHeight + 'px')
    })
  }
})(jQuery)
