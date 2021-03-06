/**
 * based on fullPage 1.5.2 (https://github.com/alvarotrigo/fullPage.js -- Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo)
 */

(function($) {
  // list of divs whose id match the href (minus the #) of a menu item
  var sectionsInMenu = []
  var currentSection = undefined
  var easing = "easeOutBack"

  var isTablet = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/)
  if (isTablet) easing = "linear"

  // http://stackoverflow.com/a/5490021/276895
  if (!isTablet) {
    var doit
    $(window).resize(function(){
      clearTimeout(doit)
      doit = setTimeout(scrollToHash, 300)
    })
  }

  $(window).on('load', function() {
    initSectionsInMenu()
    scrollToHash()
  })

  // TODO: elastically snap to top of section if close enough
  $(window).scroll(function(e) {
    var scrollTop = window.pageYOffset

    var closest = _.sortBy(sectionsInMenu, function(section) {
      var top = section.offset().top
      return (top - scrollTop) * (top - scrollTop)
    })[0]

    setCurrentSection(closest)
  })

  $(window).on('hashchange', function() {
    if (location.hash != "" && location.hash != undefined) {
      var element = sectionFromId(idFromHash(location.hash))
      if (currentSectionNeedsChange(element))
        scrollToSection(element)
    }
  })

  function initSectionsInMenu() {
    // get divs that have a menu item, so we can activate it on scrolling there (http://stackoverflow.com/a/9980042)
    sectionsInMenu = $('.menu a, a.menu').map(function() {
      var section = sectionFromId(idFromHash(this.hash))
      if (section.offset() != undefined) {
        $(this).on("click", function( event ){
          event.preventDefault()
          scrollToSection(section)
        });

        return section
      }
    })
  }

  function idFromHash(hash) {
    if (hash != undefined) return hash.substring(1)
  }

  function sectionFromId(id) {
    return $('div.section[id="' + id + '"]')
  }

  function currentSectionNeedsChange(element) {
    return element != undefined && element.attr('id') != undefined &&
           (currentSection == undefined ||
            element.attr('id') != currentSection.attr('id'))

  }

  function setCurrentSection(element) {
    if (currentSectionNeedsChange(element)) {
      currentSection = element
      currentSection.addClass('active').siblings().removeClass('active')

      var hash = '#' + currentSection.attr('id')

      $('.menu').find('a[href="' + hash + '"]').addClass('active').siblings().removeClass('active')

      if (!isTablet && location.hash != hash) {
        var scrollTop = window.pageYOffset
        location.hash = hash
        $(window).scrollTop(scrollTop)
      }
    }
  }

  function scrollToSection(element) {
    if (element.offset() != undefined) {
      setCurrentSection(element)
      $('html, body').animate({
        scrollTop: element.offset().top
      }, 2000, easing)
    }
  }

  function scrollToHash() {
    scrollToSection(sectionFromId(idFromHash(location.hash)))
  }
})(jQuery)
