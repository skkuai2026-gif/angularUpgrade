$(document).ready(function () {
  //initTabScroll();
  domEvents();
  // setTimeout(() => {
  //   	updatePageSCroll();
  // 	}, 30);
});
function initFnaSlider() {
  var carousels = document.querySelectorAll('.fnaContentSlider');
  for (var i = 0; i < carousels.length; i++) {
    carousel(carousels[i]);
  }
}

function carousel(root) {
  var figure = root.querySelectorAll('.sliderContainer')[0],
    nav = root.querySelector('nav'),
    images = figure.children,
    n = images.length,
    gap = root.dataset.gap || 0,
    bfc = 'bfc' in root.dataset,
    theta = (2 * Math.PI) / n,
    currImage = 0;
  setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));
  window.addEventListener('resize', () => {
    setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));
  });

  setupNavigation();

  function setupCarousel(n, s) {
    var apothem = s / (2 * Math.tan(Math.PI / n));
    figure.style.transformOrigin = `50% 50% ${-apothem}px`;

    for (var i = 0; i < n; i++) images[i].style.padding = `${gap}px`;
    for (i = 1; i < n; i++) {
      images[i].style.transformOrigin = `50% 50% ${-apothem}px`;
      images[i].style.transform = `rotateY(${i * theta}rad)`;
    }
    if (bfc) for (i = 0; i < n; i++) images[i].style.backfaceVisibility = 'hidden';

    rotateCarousel(currImage);
  }

  function setupNavigation() {
    nav.addEventListener('click', onClick, true);

    function onClick(e) {
      e.stopPropagation();

      var t = e.target;
      if (t.tagName.toUpperCase() != 'SPAN') return;

      if (t.classList.contains('next')) {
        currImage++;
      } else {
        currImage--;
      }

      rotateCarousel(currImage);
    }
  }

  function rotateCarousel(imageIndex) {
    figure.style.transform = `rotateY(${imageIndex * -theta}rad)`;
  }
}

$(document).on(
  'click',
  ".fnaContentSlider .sliderContainer .fnaSlide .fnaSliderContent input[type='checkbox']",
  function () {
    if ($(this).is(':checked')) {
      $(this).closest('.fnaSlide').addClass('active');
    } else {
      $(this).closest('.fnaSlide').removeClass('active');
    }
  }
);
$(document).on(
  'click',
  ".card .fna-card-container .fnaSlide .fnaSliderContent input[type='checkbox']",
  function () {
    if ($(this).is(':checked')) {
      $(this).closest('.fnaSlide').addClass('active');
    } else {
      $(this).closest('.fnaSlide').removeClass('active');
    }
  }
);

// $(document).on('click', '.fnaScreen .formFooter .nextStep', function () {
//   var fnaScreenCount = $('.fnaScreen').length;
//   var screenNo = parseInt($(this).closest('.fnaScreen').attr('data-screen-no'));
//   if (screenNo < fnaScreenCount) {
//     $('.fnaScreen').hide();
//     $(".fnaScreen[data-screen-no='" + (screenNo + 1) + "']").fadeIn(function () {
//       //loadScrollbar($('.scrollDiv'));
//       //$('.pgContentFNA.scrollDiv').mCustomScrollbar('scrollTo', 'top');
//       scrollToTop();
//       if (screenNo == 2) {
//         setTimeout(() => {
//           var mode = $('#applicationMode').text();
//           if (mode == 'online') {
//             initFnaSlider();
//           } else if (mode == 'offline') {
//             setTimeout(() => {
//               var sliderElement = $('.sliderContainer');
//               initSlickSlider(sliderElement);
//             }, 15);
//           }
//         }, 50);
//       }

//       if (screenNo == 3) {
//         setRangeSlider();
//       }
//     });
//   }
// });
// $(document).on('click', '.fnaScreen .formFooter .prevStep', function () {
//   var screenNo = parseInt($(this).closest('.fnaScreen').attr('data-screen-no'));
//   if (screenNo > 1) {
//     $('.fnaScreen').hide();
//     $(".fnaScreen[data-screen-no='" + (screenNo - 1) + "']").fadeIn(function () {
//       //loadScrollbar($('.scrollDiv'));
//       //$('.pgContentFNA.scrollDiv').mCustomScrollbar('scrollTo', 'top');
//       scrollToTop();

//       if (screenNo == 4) {
//         initFnaSlider();
//         setRangeSlider();
//       }
//       if (screenNo == 5) {
//         setRangeSlider();
//       }
//     });
//   }
// });

function setRangeSlider() {
  const allRanges = document.querySelectorAll('.fgRange');
  allRanges.forEach((wrap) => {
    const range = wrap.querySelector('.form-control-range');
    const bubble = wrap.querySelector('.bubble');

    range.addEventListener('input', () => {
      setBubble(range, bubble);
    });
    setBubble(range, bubble);
  });
}

function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = val;

  // Sorta magic numbers based on size of the native UI thumb
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}

$(document).on('click', '.sectionCategoryFnA .sectionContent .card', function () {
  //$(this).closest(".sectionContent").find(".card").removeClass("active");
  // $(this).toggleClass('active');
  var categoryName = $(this).find('h5').text();
  var cardColor = $(this).attr('data-card-color');
  $('.sectionProduct_fna').fadeIn(function () {
    $(this).removeClass('nullState');
  });
  $('.sectionProduct_fna').attr('data-section-color', cardColor);
  $('.sectionProduct_fna').find('.sectionHeader h4 span').html(categoryName);
  //loadScrollbar($('.scrollDiv'));
  //$('.pgContentFNA.scrollDiv').mCustomScrollbar('scrollTo', 'top');
  scrollToTop();
});

$(document).on('click', '.sectionProduct_fna .sectionContent .card .cardFooter > a', function (e) {
  var thisCard = $(this).closest('.card');
  thisCard.toggleClass('active');
  var siblingCards = $(this).closest('.sectionContent').find('.card');
  siblingCards.not('.active').addClass('unselected');
  siblingCards.not('.active').find('.cardFooter > a').text('Select Product');
  if (thisCard.hasClass('active')) {
    thisCard.removeClass('unselected');
    $(this).text('Product Selected');
  } else {
    thisCard.addClass('unselected');
    $(this).text('Select Product');
  }

  // $(this).closest(".sectionContent").css("margin-bottom", 30 + "px");
  // loadScrollbar($('.scrollDiv'));
});

function setSignatureHeight() {
  var c = $('#signature canvas'),
    ctx = c[0].getContext('2d');
  setTimeout(function () {
    ctx.canvas.height = 150;
    domEvents();
    // setTimeout(() => {
    //   updatePageSCroll();
    // }, 10);
  }, 20);
}

/********************************* dream timeline 10 ss*******************************************/
