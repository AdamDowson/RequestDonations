const Screen = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile'
};

$(document).ready(function () {

  // LINKS ARE NOW IN /src/js/links.js

  // NAV BAR MENU
  var currentScreen = screenType();
  loadVideoForGivenDevice();


  $(window).resize(function(){
    const resizedToScreen = screenType();
    if(resizedToScreen !== currentScreen){
      currentScreen = resizedToScreen;
      loadVideoForGivenDevice();
    }
  });

  function loadVideoForGivenDevice(){
    const jumbo = $('#jumbo');
    const video = $('#bgvid');
    video.empty();

    const clone = video.clone();
    video.remove();

    if (currentScreen === Screen.MOBILE) {
      clone.append('<source src="assets/videos/MKR_Bg_Only.webm" type="video/webm">');
      clone.append('<source src="assets/videos/MKR_Bg_Only.mp4" type="video/mp4">');
    } else {
      clone.append('<source  src="assets/videos/MKR_Bg_video_HD.mp4" type="video/mp4">');
    }

    jumbo.append(clone);
  }

  function screenType(){
    return window.matchMedia('(max-width: 768px)').matches ? Screen.MOBILE : Screen.DESKTOP;
  }

  delete Hammer.defaults.cssProps.userSelect;

  var hammertime = new Hammer(document.body);
  hammertime.get('swipe').set({direction: Hammer.DIRECTION_HORIZONTAL});

  hammertime.on("swipeleft", function () {
    $('#content').removeClass('menu-opened');
  });

  hammertime.on("swiperight", function () {
    $('#content').addClass('menu-opened');
  });

  $('body').click(function (e) {
    var menuClicked;
    if ($(e.target).hasClass('menu-category')) {
      menuClicked = $(e.target).parent();
    }
    if ($(e.target).parent().hasClass('menu-category')) { // caret clicked
      menuClicked = $(e.target).parent().parent();
    }
    if (menuClicked) {
      if (!menuClicked.hasClass('active')) {
        $('.menu-container').removeClass('active')
      }
      menuClicked.toggleClass('active')
    } else {
      $('.menu-container').removeClass('active')
    }
  })

  // MOBILE MENU
  $("#menu-bars").click(function () {
    $('#content').toggleClass('menu-opened');
  })

  // VIDEOS
  var videoIds = {
    "dai-overview": 247715133,
    "dai-stablecoin-system": 247715549,
    "mkr-governance-token": 0
  };

  $('.js-show-vid').click(function (e) {
    e.preventDefault();
    var vidName = $(this).data('vid');
    var id = videoIds[vidName];
    if (!id) {
      console.error('Invalid video name "' + vidName + '"');
      return;
    }
    $('#videos').html('<div class="video-background">' +
      '<i class="fa fa-times close-vid-btn" aria-hidden="true"></i>' +
      '<iframe src="https://player.vimeo.com/video/' + id + '?autoplay=1" ' +
      'width="640" height="480" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>' +
      '</iframe></div>');
    $('.close-vid-btn,.video-background').click(function () {
      $('#videos').html('');
    })
  })

  $('.js-close').click(function () {
    $(this).parent().remove();
  });

  // SVG fallback
  if (!Modernizr.svgasimg) {
    $("#logo").attr("src", "assets/img/MKR-logo-rounded.png");
  }

  $("#subscribe .button").click(function () {
    // Removes focus of the button.
    $(this).blur();
  });
});
