import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const CAROUSEL_OPTS = {
  single: { loop: true, margin: 0, nav: true, smartSpeed: 500, autoplay: 6000, navText: ['<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>'], responsive: { 0: { items: 1 }, 600: { items: 1 }, 800: { items: 1 }, 1024: { items: 1 }, 1200: { items: 1 }, 1500: { items: 1 } } },
  test: { loop: true, items: 1, margin: 0, nav: true, navText: ['<span class="icofont-thin-left"></span>', '<span class="icofont-thin-right"></span>'], dots: false, autoplay: true, autoplayTimeout: 5000 },
  thumb: { loop: true, margin: 25, items: 1, nav: false, navText: ['<span class="icon icofont-rounded-left"></span>', '<span class="icon icofont-rounded-right"></span>'], dots: false, autoplay: true, autoplayTimeout: 5000, responsive: { 0: { items: 1, autoWidth: false }, 400: { items: 1, autoWidth: false }, 600: { items: 1, autoWidth: false }, 1000: { items: 1, autoWidth: false }, 1200: { items: 1, autoWidth: false } } }
}

const initCarousel = ($el, opts) => {
  if (!$el.length) return
  if ($el.hasClass('owl-loaded')) {
    $el.trigger('refresh.owl.carousel')
  } else {
    $el.owlCarousel(opts)
  }
}

const setupHeaderSticky = () => {
  let scrollTimer = null
  const updateHeaderStyle = () => {
    const $header = $('.main-header')
    if (!$header.length) return
    const isScrolled = $(window).scrollTop() > 100
    $header.toggleClass('fixed-header', isScrolled)
    $('.scroll-to-top').toggle(isScrolled)
  }
  updateHeaderStyle()
  $(window).on('scroll', () => {
    clearTimeout(scrollTimer)
    scrollTimer = setTimeout(updateHeaderStyle, 10)
  })
}

const setupDropdownMenu = () => {
  if (!$('.main-header li.dropdown ul').length) return
  $('.main-header li.dropdown .dropdown-btn').remove()
  $('.main-header li.dropdown').append('<div class="dropdown-btn"><span class="fa fa-angle-down"></span></div>')
  
  $('.main-header li.dropdown .dropdown-btn').on('click', function(e) {
    e.stopPropagation()
    $(this).prev('ul').slideToggle(500)
    $(this).parent().toggleClass('open')
  })
  
  $('.main-header .navigation li.dropdown > a').on('click', function(e) {
    if ($(window).width() <= 991) {
      e.preventDefault()
      $(this).parent().find('ul').slideToggle(500)
      $(this).parent().toggleClass('open')
    }
  })
  
  if ($(window).width() > 991) {
    $('.main-header .navigation li.dropdown').hover(
      function() { $(this).find('> ul').stop(true, true).slideDown(300) },
      function() { $(this).find('> ul').stop(true, true).slideUp(300) }
    )
  }
  
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.dropdown').length) {
      $('.main-header li.dropdown ul').slideUp(300)
      $('.main-header li.dropdown').removeClass('open')
    }
  })
}

const setupBootstrapDropdowns = () => {
  // Handle Bootstrap dropdown toggles for cart-box
  $(document).on('click', '.dropdown-toggle', function(e) {
    e.preventDefault()
    e.stopPropagation()
    const $menu = $(this).next('.dropdown-menu')
    
    // Close other dropdowns
    $('.dropdown-menu').not($menu).slideUp(200)
    
    // Toggle current dropdown
    if ($menu.is(':visible')) {
      $menu.slideUp(200)
    } else {
      $menu.slideDown(200)
    }
  })
  
  // Close dropdown when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.dropdown').length) {
      $('.dropdown-menu').slideUp(200)
    }
  })
}

const setupSyncCarousels = () => {
  if (!window.$.fn.owlCarousel) return
  
  // Home testimonials (client-testimonial-carousel + client-thumbs-carousel)
  const $sync3 = $('.client-testimonial-carousel'), $sync4 = $('.client-thumbs-carousel')
  if ($sync3.length && $sync4.length) {
    if (!$sync3.hasClass('owl-loaded')) {
      let syncFlag = false
      const syncDuration = 500
      $sync3.owlCarousel(CAROUSEL_OPTS.test)
      $sync4.owlCarousel(CAROUSEL_OPTS.thumb)
      $sync3.on('changed.owl.carousel', function(e) {
        if (!syncFlag) {
          syncFlag = true
          $sync4.trigger('to.owl.carousel', [e.item.index, syncDuration, true])
          syncFlag = false
        }
      })
      $sync4.on('click', '.owl-item', function() {
        $sync3.trigger('to.owl.carousel', [$(this).index(), syncDuration, true])
      }).on('changed.owl.carousel', function(e) {
        if (!syncFlag) {
          syncFlag = true
          $sync3.trigger('to.owl.carousel', [e.item.index, syncDuration, true])
          syncFlag = false
        }
      })
    } else {
      $sync3.trigger('refresh.owl.carousel')
      $sync4.trigger('refresh.owl.carousel')
    }
  }
}

const setupPlugins = () => {
  if (!window.$) return
  
  initCarousel($('.single-item-carousel'), CAROUSEL_OPTS.single)
  setupSyncCarousels()
  
  // Isotope
  const $container = $('.sortable-masonry .items-container')
  if ($container.length && window.$.fn.isotope) {
    $container.isotope({ filter: '*', masonry: { columnWidth: '.masonry-item.col-lg-3' }, animationOptions: { duration: 0, easing: 'linear' } })
    
    // Conectar botones de filtro
    $('.filter-tabs .filter').on('click', function() {
      const filterValue = $(this).attr('data-filter')
      $('.filter-tabs .filter').removeClass('active')
      $(this).addClass('active')
      $container.isotope({ filter: filterValue })
    })
  }
  
  // MixItUp
  const mixContainer = document.querySelector('.filter-list')
  if (mixContainer && !mixContainer.mixItUpInstance && window.mixitup) {
    mixContainer.mixItUpInstance = window.mixitup(mixContainer)
  }
  
  // Fancybox
  if (window.$.fancybox) {
    $('[data-fancybox]').fancybox({ buttons: ['zoom', 'slideShow', 'fullScreen', 'close'], loop: true })
  }
  
  // WOW
  if (window.WOW) new window.WOW().init()
}

const setupMobileMenu = () => {
  const $mainMenu = $('.main-header .nav-outer .main-menu')
  if (!$mainMenu.length) return
  
  $('.mobile-menu .menu-box .menu-outer').html($mainMenu.html())
  $('.mobile-nav-toggler').on('click', () => $('body').addClass('mobile-menu-visible'))
  $('.mobile-menu .menu-backdrop, .mobile-menu .close-btn').on('click', () => $('body').removeClass('mobile-menu-visible'))
  $('.mobile-menu .navigation li.dropdown .dropdown-btn').on('click', function(e) {
    e.stopPropagation()
    $(this).prev('ul').slideToggle(500)
    $(this).toggleClass('open')
  })
}

const setupUIInteractions = () => {
  if ($('.search-box-outer').length) {
    $('.search-box-outer').on('click', () => $('body').addClass('search-active'))
    $('.close-search').on('click', () => $('body').removeClass('search-active'))
  }
  
  $(document).on('keydown', (e) => {
    if (e.key === 'Escape') $('body').removeClass('search-active')
  })
  
  $('.scroll-to-target').on('click', function() {
    const target = $(this).attr('data-target')
    if (target) $('html, body').animate({ scrollTop: $(target).offset().top }, 1500)
  })
}

const cleanupListeners = () => {
  if (!window.$) return
  
  $(window).off('scroll')
  $(document).off('keydown')
  $(document).off('click')
  $('.search-box-outer').off('click')
  $('.close-search').off('click')
  $('.scroll-to-target').off('click')
  $('.filter-tabs .filter').off('click')
  $('.main-header li.dropdown .dropdown-btn').off('click')
  $('.main-header .navigation li.dropdown > a').off('click')
  $('.main-header .navigation li.dropdown').off('mouseenter mouseleave')
  $('.mobile-nav-toggler').off('click')
  $('.mobile-menu .menu-backdrop').off('click')
  $('.mobile-menu .close-btn').off('click')
  $('.mobile-menu .navigation li.dropdown .dropdown-btn').off('click')
}

export function useJQueryPlugins() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => {
      setupBootstrapDropdowns()
      setupHeaderSticky()
      setupDropdownMenu()
      setupPlugins()
      setupMobileMenu()
      setupUIInteractions()
    }, 300)

    return () => {
      clearTimeout(timer)
      cleanupListeners()
    }
  }, [location.pathname])
}
