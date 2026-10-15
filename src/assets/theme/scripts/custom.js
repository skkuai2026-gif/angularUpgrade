var ww = $(window).width();
var wh = $(window).height();
var scrollPoint;
var contentDynamicHeightList = ['panel_left', 'rightSideContent'];
var isDisabledCalled = false;

$(document).ready(function () {
  //initTabScroll();
  domEvents();
  //below is for issue faced in IOS that when touchpad opens up the screen size would change
  document.ontouchmove = function (e) {
    e.preventDefault();
  };

  /* Commented below code to enable zoom functionality on iOS and Android. The code prevents zoom on touch gestures. */

  /* document.addEventListener(
    'gesturestart',
    (event) => {
      event.preventDefault();
    },
    false
  ); */
});

function setPgContentHeight() {
  var footerExists = $('.pgContent .tab-pane .formFooter').length;
  if (footerExists > 0) {
    $('.pgContent').css('height', 'calc(100% - 50px)');
  } else {
    $('.pgContent').css('height', '100%');
  }
}

function domEvents() {
  initTooltip();
  // setRiderLeftPanelHeight();

  responsiveBehaviour();
  setTimeout(() => {
    setPageContentDynamicHeight(contentDynamicHeightList);
  }, 15);
  setPgContentHeight();
}
function setScrollAndScreenHeight() {
  setTimeout(() => {
    domEvents();
    removeTooltip();
    setTimeout(() => {
      initTooltip();
      showSpinner();
      if (document.querySelector('.pgContent.scrollDiv') != undefined) {
        scrollPoint = document.querySelector('.pgContent.scrollDiv').scrollTop;
        if (scrollPoint == 0) scrollToTop();
      }
      setTimeout(() => {
        hideSpinner();
      }, 1);
    }, 20);
  }, 50);
}
/**dom ready event ends here */
/* Modified by Monisha Pillai */
function initTooltip() {
  var pos = ww <= 567 ? 'bottom' : 'right';
  $('[data-toggle="tooltip"]').tooltip({ placement: pos });
}

function updatePageSCroll() {
  // setTimeout(() => {
  //   $('.scrollDiv').mCustomScrollbar('update');
  // }, 30);
}

function loadScrollbar(element) {
  // element.each(function () {
  //   var noScroll = $(this).hasClass('noScroll');
  //   var hasBothScroll = $(this).hasClass('scrollXY');
  //   var hasScrollX = $(this).hasClass('scrollX');
  //   var hasScrollBar = $(this).hasClass('mCustomScrollbar');
  //   var scrolllObject = {
  //     advanced: {
  //       autoScrollOnFocus: true,
  //       updateOnContentResize: true,
  //     },
  //     callbacks: {
  //       onInit: function () {
  //         if ($(this).hasClass('pgContent')) {
  //           $('.pgContent').removeClass('isScrolling');
  //           $('.pgContent').css('padding-bottom', '10px');
  //         }
  //       },
  //       onUpdate: function () {
  //         if ($(this).hasClass('pgContent')) {
  //           $('.pgContent').removeClass('isScrolling');
  //           $('.pgContent').css('padding-bottom', '10px');
  //         }
  //       },
  //       whileScrolling: function () {
  //         if ($(this).hasClass('pgContent') && !$(this).find('.stepdata').hasClass('customerPageData')) {
  //           syncTabandHeaderHeight(this);
  //         }
  //       },
  //       onScroll: function () {
  //         if ($(this).hasClass('pgContent')) {
  //           if (ww > 767) {
  //             // setRiderLeftPanelHeight();
  //             setPageContentDynamicHeight(contentDynamicHeightList);
  //           }
  //         }
  //       },
  //     },
  //   };
  //   if (hasBothScroll) {
  //     scrolllObject.axis = 'yx';
  //   }
  //   if (hasScrollX) {
  //     scrolllObject.axis = 'x';
  //   }
  //   if (!noScroll) {
  //     if (hasScrollBar) {
  //       $(this).mCustomScrollbar('update');
  //     } else {
  //       $(this).mCustomScrollbar('destroy');
  //       $(this).mCustomScrollbar(scrolllObject);
  //       $(this).mCustomScrollbar('scrollTo', 'top', {
  //         scrollInertia: 0,
  //       });
  //     }
  //   }
  // });
  // setDefaultFocus();
}
/**custom scrollbar event ends */
function setDefaultFocus() {
  setTimeout(() => {
    if (
      $('.pageData .defaultFocus:first') != undefined &&
      $('.pageData .defaultFocus:first') != null &&
      $('.pageData .defaultFocus:first').length > 0
    ) {
      $('.pageData .defaultFocus:first').focus();
    } else if (
      $('.pageData .selectedValue:input:enabled:visible:first') != undefined &&
      $('.pageData .selectedValue:input:enabled:visible:first') != null &&
      $('.pageData .selectedValue:input:enabled:visible:first ').length > 0 &&
      (($('.pageData .selectedValue:input:enabled:visible:first ')[0].type == 'radio' &&
        $('.pageData :input:enabled:visible:first ')[0].type == 'radio') ||
        ($('.pageData .selectedValue:input:enabled:visible:first ')[0].type == 'checkbox' &&
          $('.pageData :input:enabled:visible:first ')[0].type == 'checkbox'))
    ) {
      $('.pageData .selectedValue:input:enabled:visible:first ').focus();
    } else if (
      $('.pageData :input:enabled:visible:first') != undefined &&
      $('.pageData :input:enabled:visible:first') != null &&
      $('.pageData :input:enabled:visible:first').length > 0
    ) {
      $('.pageData :input:enabled:visible:first').focus();
    } else {
      if (
        $('.dataTables_wrapper .dataTables_filter input:enabled:visible:first') != undefined &&
        $('.dataTables_wrapper .dataTables_filter input:enabled:visible:first') != null
      ) {
        $('.dataTables_wrapper .dataTables_filter input:enabled:visible:first').focus();
      }
    }
    // scrollToTop();
  }, 10);
}
// $(window).on('load', function () {
//   hideLoader();
// });
/**window load event ends */

/**loader related functions below */
function hideLoader() {
  $('.preLoader').addClass('swipeUp');
  setTimeout(function () {
    $('.preLoader').fadeOut();
    $('.preLoader').removeClass('swipeUp');
  }, 1500);
}

function showLoader() {
  $('.preLoader').css('opacity', '0.6');
  $('.preLoader').show();
}

function showSpinner() {
  $('.loadersmall').show();
}

function hideSpinner() {
  $('.loadersmall').hide();
}

/**
 * AIML loader starts here
 */
function showImageLoader() {
  $('.aiml-img-loader').show();
}

function hideImageLoader() {
  $('.aiml-img-loader').hide();
}
/**
 * AIML loader ends here
 */
/* the below function will fire when the custom scrollbar crosses a specific top-offset
Note: This event won't fire on window scroll event, it will only get called on mcustomscrollbar event*/
/* Modified by Monisha Pillai */
function pgContentOnScroll(element) {
  if (ww > 567 && !$(element).find('.stepdata').hasClass('customerPageData')) {
    var scrollTop = $(element).scrollTop();
    var fixedPosition = 83;
    var stepHeaderHeight = $(element).find('.stepHeader').outerHeight() + 20;

    if (scrollTop > fixedPosition) {
      $(element).addClass('isScrolling');
      $(element).css('padding-bottom', stepHeaderHeight + 'px');
      if (scrollTop > fixedPosition - stepHeaderHeight) {
        $(element).css('padding-bottom', '10px');
      }
    } else {
      $(element).removeClass('isScrolling');
      $(element).css('padding-bottom', '10px');
    }
    setPageContentDynamicHeight(contentDynamicHeightList);
  }
}

$(document).on('click', '.scrollTop', function () {
  $('.pgContent').animate({ scrollTop: 0 }, 'linear');
});

/* the below click event is to collapse/shift the left menu navigation on ham-burger icon click on page header*/
$(document).on('click', '.btnLeftNav', function () {
  $('body').toggleClass('menuClosed');
  domEvents();
});

/**the below 2 events refreshes the mcustom scrollbar on tab clicks */
// $('.card').on('shown.bs.collapse', function (e) {
//   updatePageSCroll();
// });
$(document).on('click', 'a[data-toggle="tab"],a[data-toggle="pill"]', function (e) {
  setTimeout(function () {
    var current_data_target = $(e.target).attr('data-target');
    var current_data_toggle = $(e.target).attr('data-toggle');
    if (current_data_target == '#select_product') {
      var sliderElement = $('.productCategorySlider');
      initSlickSlider(sliderElement);
    }
    setPageContentDynamicHeight(contentDynamicHeightList);

    $('.panel_left').removeClass('active');
    if ($(e.target).parents('.navVertical').length) {
      scrollToTop();
      $('.stepTabData').find('.form-control[type!=hidden]:first').focus();
    }
  }, 1000);
});

/** product selection functionality starts here */

/* Modified by Monisha Pillai */
function initSlickSlider(sliderElement, slidesToShow, initialSlide) {
  if (sliderElement.hasClass('slick-slider')) {
    sliderElement.slick('unslick');
  }
  var slideCount = 3;
  if (slidesToShow != undefined) {
    slideCount = slidesToShow;
  } else {
    slideCount = 3;
  }
  var initialScreen = 0;
  if (initialSlide != undefined) {
    initialScreen = initialSlide;
  }
  sliderElement.slick({
    slidesToShow: slideCount,
    infinite: false,
    initialSlide: initialScreen,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          focusOnSelect: true,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
          dots: true,
          focusOnSelect: true,
        },
      },
    ],
  });
}

$(document).on('click', '.closePopup', function () {
  var videoElement = $(this).closest('.modal').find('.videoElement');
  if (videoElement && videoElement.length > 0) {
    pauseVideo(videoElement[0]);
  }
  $(this).closest('.modal').modal('hide');
});

/** product selection functionality ends here */

/**responsive behaviour ends */
function responsiveBehaviour() {
  if (ww <= 768) {
    responsiveStepper();
  }
}

function responsiveStepper() {
  var radialProgressBar = '';
  var totalSteps = $('.stepdata .stepHeader > .nav-tabs > li').length;
  $('.stepdata .stepHeader > .nav-tabs > li').each(function () {
    var currentTabIndex = $(this).index() + 1;
    var rotationDegValue = (currentTabIndex / totalSteps) * 180;
    radialProgressBar =
      '<div class="progressRadial"><div class="mask full" style="transform: rotate(' +
      rotationDegValue +
      'deg);"><div class="fill" style="transform: rotate(' +
      rotationDegValue +
      'deg);"></div></div><div class="mask half"><div class="fill" style="transform: rotate(' +
      rotationDegValue +
      'deg);"></div></div><div class="inside-circle">' +
      currentTabIndex +
      '/' +
      totalSteps +
      '</div></div>';

    $(this).find('> a .progressRadial').remove();
    $(this).find('> a').prepend(radialProgressBar);
  });
}

/**the below function will open validation error modal on stepper error icon click */
$(document).on('click', '.stepdata .card-header > .nav-tabs .nav-item.error > i > span', function () {
  $('.modalWithHeader').modal('show');
});
/**stepper event starts here */

function playVideo(videoElement) {
  videoElement.play();
}

function pauseVideo(videoElement) {
  videoElement.pause();
}
/**video scripts ends here */

/**the below function is called directly on input field to restrict only number on input[type=text] fields */
function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) return false;

  return true;
}

/**functionality for coverage > plan > fund allocation graph starts */
var pieColorArray = [];
$('.fundsContent .blockList > li').each(function () {
  var colorValue = $(this).find('h5').css('color');
  pieColorArray.push(colorValue);
});

$(document).on('blur', '.fundsContent .blockList > li > span > input', function () {
  var newSeriesData = [];
  var currentSeriesData = fundAllocationGraph.series[0].data;
  for (var i = 0; i < currentSeriesData.length; i++) {
    newSeriesData.push({
      name: currentSeriesData[i].name,
      y: parseInt($('.fundsContent .blockList > li').eq(i).find('span > input').val()),
    });
  }
  fundAllocationGraph.series[0].setData(newSeriesData, true);
});

/**functionality for coverage > plan > fund allocation graph ends */

/**the below click event will pause youtube video and close the popup */
$(document).on('click', '.cardOverlay .cardOverlayActions > a', function () {
  var videoElement = $(this).closest('.cardOverlay').find('.videoElement');
  if (videoElement && videoElement.length > 0) {
    pauseVideo(videoElement[0]);
  }
  $(this).closest('.cardOverlay').fadeOut();
});

/* Modified by Monisha Pillai */
/**scrollable functionality starts */
function initTabScroll(element) {
  element.each(function () {
    if ($(this).hasClass('slick-slider')) {
      $(this).slick('unslick');
    }
    $(this).slick({
      variableWidth: true,
      slidesToShow: 3,
      infinite: false,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 567,
          settings: {
            slidesToShow: 1,
            dots: true,
          },
        },
      ],
    });
  });
}

$(document).on('click', '.productSlider .card > .cardImg > .videoBanner > .videoBtn', function (e) {
  $(this).hide();
  $(this)
    .parent()
    .find('.videoElement')
    .show(function () {
      var videoElement = $(this)[0];
      playVideo(videoElement);
    });
});
/*below event click will trigger congratulation popup on stepper complete button click*/
$(document).on('click', '.btnLinkToEAppSuccess', function () {
  $('.modalSuccess').modal('show');
});

$(document).on('focus', '.table tbody tr td > div > .form-control', function () {
  $(this).parent().addClass('focused');
});
$(document).on('blur', '.table tbody tr td > div > .form-control', function () {
  $(this).parent().removeClass('focused');
});

function setPageContentDynamicHeight(componentClassList) {
  if (componentClassList != undefined && componentClassList.length != undefined) {
    for (var i = 0; i < componentClassList.length; i++) {
      var countOfRightSideContent = $('.' + componentClassList[i]).length;
      if (ww > 768 && countOfRightSideContent > 0) {
        $('.' + componentClassList[i]).each(function () {
          var rightSideContentCurrentHeight = $(this).outerHeight();
          var pgContentHeight = $('.pgContent').outerHeight();
          var rsOffset = $(this).offset().top;
          var formFooterHeight = $('.formFooter').outerHeight();
          var rightSideContentHeight = wh - rsOffset - formFooterHeight - 10;
          $(this).css('height', rightSideContentHeight + 'px');
        });
      }
    }
  }
}

$(document).on('click', '.panel_left > .panel_left_icon', function (e) {
  e.stopPropagation();
  $(this).closest('.panel_left').toggleClass('active');
});

/**hide on body click */
$(document).on('click', function (e) {
  var container = $('.panel_left.active');
  if (!container.is(e.target) && container.has(e.target).length === 0) {
    $('.panel_left').removeClass('active');
  }
});

/**Modal related functions */
/* Modified by Monisha Pillai */
function openPopup(id) {
  setTimeout(() => {
    // $('#' + id).modal({ backdrop: 'static', keyboard: false });
    $('#' + id).modal('show');
    $('#' + id).css('display', 'block');
    $('div').removeClass('modal-backdrop');
  }, 10);
}

function openModal(id) {
  // if (id === undefined) return;
  setTimeout(() => {
    $('#' + id).modal({ backdrop: 'static', keyboard: false });
    $('#' + id).modal('show');
  }, 0);
}

function closeModal(id) {
  setTimeout(() => {
    $('#' + id).modal('hide');
    $('div').removeClass('modal-backdrop fade');
    setTimeout(() => {
      scrollToTop();
    }, 50);
  }, 10);
}

$(document).on('click', "a[data-element-for='quickLinks']", function () {
  var data_target_value = $(this).attr('data-target');
  //$('.pgContent.scrollDiv').mCustomScrollbar("scrollTo", "#"+data_target_value);
  var height =
    $('.stepHeader').outerHeight() != undefined || $('.stepHeader').outerHeight() != null
      ? $('.stepHeader').outerHeight()
      : 0;
  var positionToScroll =
    $('#' + data_target_value)
      .closest('.block')
      .position().top - height;
  // $('.pgContent.scrollDiv').mCustomScrollbar('scrollTo', positionToScroll, {
  //   timeout: 0,
  //   scrollInertia: 200,
  // });
  $('.pgContent').animate(
    {
      scrollTop: positionToScroll,
    },
    2000
  );
});

//Edited by Monisha Pillai
/**method used for destroying tooltip */
function removeTooltip() {
  $('div.tooltip').remove();
}

function closePopup(id) {
  $('#' + id).modal('hide');
  $('div').removeClass('modal-backdrop fade show');
}

function isMobileCheck() {
  let check = false;
  (function (a) {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Macintosh|Opera Mini/i.test(navigator.userAgent) ||
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
        navigator.platform
      )
    )
      check = true;
  })(
    navigator.userAgent ||
      navigator.vendor ||
      window.opera ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
  return check;
}

function isLandscapeMode() {
  let check = true;
  if (window.innerHeight > window.innerWidth) {
    check = false;
  }
  return check;
}

// rider video starts

$('.modalRiderPopup').on('shown.bs.modal', function () {
  var videoElement = $('.modalRiderPopup').find('.videoElement')[0];
  playVideo(videoElement);
});

$('.modalRiderPopup').on('hidden.bs.modal', function () {
  var videoElement = $('.modalRiderPopup').find('.videoElement');
  if (videoElement && videoElement.length > 0) {
    pauseVideo(videoElement[0]);
  }
});
$(document).on('click', '.card.cardRider .videoBanner .videoBtn', function () {
  $(this).closest('.card').find(".cardOverlay[data-content='cardOverlayVideo']").show();
  var videoElement = $(this)
    .closest('.card')
    .find(".cardOverlay[data-content='cardOverlayVideo'] .videoElement")[0];
  playVideo(videoElement);
});
$(document).on('click', '.cardOverlay .cardOverlayContent .fa-close', function () {
  $(this).closest('.card').find(".cardOverlay[data-content='cardOverlayVideo']").hide();
  var videoElement = $(this)
    .closest('.card')
    .find(".cardOverlay[data-content='cardOverlayVideo'] .videoElement")[0];
  pauseVideo(videoElement);
});
// rider video ends

function scrollToTop() {
  $('.pgContent').stop().animate({ scrollTop: 0 }, 5, 'linear');
}

function searchScrollToTop() {
  $('.pgContent .symSearch').stop().animate({ scrollTop: 0 }, 5, 'linear');
}

function setScrollFocus(id) {
  if (isDisabledCalled == true) {
    setTimeout(() => {
      if (document.getElementById(id) != undefined && document.getElementById(id) != null)
        document.getElementById(id).focus();
      setTimeout(() => {
        $('.pgContent').stop().animate({ scrollTop: scrollPoint }, 5, 'linear');
        enableScroll();
      }, 10);
    }, 20);
  }
}

function preventScroll(e) {
  e.preventDefault();
  e.stopPropagation();
  // return false;
}

function disableScroll() {
  scrollPoint = document.querySelector('.pgContent.scrollDiv').scrollTop;
  document.querySelector('.pgContent.scrollDiv').addEventListener('wheel', preventScroll);
  isDisabledCalled = true;
}

function enableScroll() {
  if (
    document.querySelector('.pgContent.scrollDiv') != undefined &&
    document.querySelector('.pgContent.scrollDiv') != null &&
    isDisabledCalled == true
  )
    document.querySelector('.pgContent.scrollDiv').removeEventListener('wheel', preventScroll);
  isDisabledCalled = false;
}

function commarize(val, min) {
  min = min || 1e3;
  if (val >= min) {
    var units = ['k', 'M', 'B', 'T'];
    var order = Math.floor(Math.log(val) / Math.log(1000));
    var unitname = units[order - 1];
    var num = val / 1000 ** order;
    return num + unitname;
  }
  return val.toLocaleString();
}

function removeActiveElmFocus() {
  document.activeElement.blur();
}

function setFocus(id) {
  this.setTimeout(() => {
    if (document.getElementById(id) !== null) {
      document.getElementById(id).focus();
    }
  }, 15);
}

//Eforms functionality events trigger functions start here

/**
 * Validates a field based on its ID by dynamically calling a function named after the field's ID.
 *
 * @param event - The event object associated with the field. It is expected to contain an `id` property.
 * @param boolean - A boolean value (currently unused in the function).
 *
 * This function constructs a function name by appending '_change' to the field's ID and attempts to call it using `eval`.
 * If the function does not exist, an error message is logged to the console.
 */
function validateField(event, boolean) {
  const id = event.id;
  const functionName = id + '_change';
  try {
    // Construct the function call string
    const functionCall = `${functionName}(event)`;
    // Create a new Function object that will call the dynamic function
    const func = new Function('event', `return ${functionCall};`);
    // Call the function with the provided arguments
    func(event);
  } catch (error) {
    console.log(functionName + ' is not a function');
  }
}

/**
 * Placeholder function for handling the focus event on a field.
 *
 * @param event - The event object associated with the focus event.
 *
 * Currently, this function does not perform any actions.
 */
function fieldFocus(event) {}

/**
 * Placeholder function for handling the blur event on a field.
 *
 * @param event - The event object associated with the blur event.
 *
 * Currently, this function does not perform any actions.
 */
function fieldBlur(event) {}

/**
 * Initializes a select box field.
 *
 * @param id - The ID of the select box element.
 * @param isReadOnly - A boolean indicating whether the select box is read-only.
 *
 * Currently, this function does not perform any actions.
 */
function HtmlSelectBox(id, isReadOnly) {}

/**
 * Initializes a radio button field.
 *
 * @param id - The ID of the radio button element.
 * @param paramCount - A parameter count for additional settings (currently unused).
 *
 * Currently, this function does not perform any actions.
 */
function HtmlRadioButton(id, paramCount) {}

/**
 * Updates the value and hidden input field based on the state of a checkbox.
 *
 * @param obj - The checkbox element.
 *
 * If the checkbox is checked, its value is set to 'YES', and a corresponding hidden input field is updated.
 * If the checkbox is unchecked, its value is set to 'NO', and the hidden input field is updated accordingly.
 * The `catchevent` function is then called with the checkbox element.
 */
function inputFieldCheckClicked(obj) {
  if (obj.checked) {
    obj.value = 'YES';
    var chkHidObj = document.getElementById(obj.id + '_hid');
    if (chkHidObj != null) {
      chkHidObj.setAttribute('name', obj.name + '_hid');
      chkHidObj.value = 'YES';
    }
  } else {
    obj.value = 'NO';
    var chkHidObj = document.getElementById(obj.id + '_hid');
    if (chkHidObj != null) {
      chkHidObj.setAttribute('name', obj.name);
      chkHidObj.value = 'NO';
    }
  }
  catchevent(obj);
  return false;
}

/**
 * Calls the `validateField` function for the given event object.
 *
 * @param eventObj - The event object to be validated.
 *
 * This function invokes the `validateField` function with the provided event object.
 */
function catchevent(eventObj) {
  this.validateField(eventObj);
}

/**
 * Updates the title attribute of a select element with the text of the selected option.
 *
 * @param obj - The select element.
 *
 * This function sets the `title` attribute of the select element to the text of the currently selected option.
 * It uses a try-catch block to handle any potential errors.
 */
function doOnChangeSelect(obj) {
  try {
    var selectedText = obj.options[obj.selectedIndex].text;
    obj.title = selectedText;
  } catch (e) {}
}

/**
 * Triggers a 'change' event on the specified element.
 *
 * @param element - The element on which to trigger the change event.
 *
 * This function creates a new 'change' event and dispatches it on the given element.
 */
function triggerChangeEvent(element) {
  if (element) {
    var event = new Event('change');
    element.dispatchEvent(event);
  }
}

// let elementVisibilityState = {};
// function setVisibilityState(elementIds, isVisible) {
//   const elementsIds = elementIds.split(',');
//   elementsIds.forEach((id) => {
//     const trimmedId = id.trim();
//     elementVisibilityState[trimmedId] = isVisible;
//   });
// }

// function applyAllVisibilityStates(elementRef) {
//   // Iterate over the keys (element IDs) in the elementVisibilityState object
//   for (let elementId in elementVisibilityState) {
//     if (elementVisibilityState.hasOwnProperty(elementId)) {
//       const element = document.getElementById(elementId);
//       const labelElement = elementRef.nativeElement.querySelector(`label[for="${elementId}"]`);
//       if (element || labelElement) {
//         // Apply the saved visibility state to the element
//         labelElement.style.display = elementVisibilityState[elementId] ? 'inline-block' : 'none';
//         element.style.display = elementVisibilityState[elementId] ? 'inline-block' : 'none';
//       }
//     }
//   }
// }

//Eforms functionality events trigger functions end here

/* the below click event is to collapse/shift the left menu navigation on any click on screen*/
$(document).on('click', '.pgContent,.card-body,button,i,a', function () {
  if (!$('body').hasClass('menuClosed') && $('div').hasClass('leftNav')) {
    $('body').toggleClass('menuClosed');
  }
});
