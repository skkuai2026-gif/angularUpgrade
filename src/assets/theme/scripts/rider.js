$(document).on('click', 'a[data-toggle="tab"],a[data-toggle="pill"]', function (e) {
  // // alert('tab is clicked');
  // var current_data_target = $(e.target).attr('data-target');
  // if (current_data_target == '#step_selectProduct') {
  //     var sliderElement = $('.productCategorySlider');

  //     if (sliderElement.length == 0) {
  //         sliderElement = $('.sectionContent .productSlider');
  //     }
  //     initSlickSlider(sliderElement);
  // } else if (current_data_target == '#rider') {
  //     setRiderLeftPanelHeight();
  // }
  // loadScrollbar($('.scrollDiv'));
  setTimeout(function () {
    if (current_data_target == '#rider') {
      // setRiderLeftPanelHeight();
    }
    setPageContentDynamicHeight(contentDynamicHeightList);
    // udatePageSCroll();
    $('.panel_left').removeClass('active');
    if ($(e.target).parents('.navVertical').length) {
      // $('.pgContent').mCustomScrollbar('scrollTo', 'top', {
      //   scrollInertia: 0,
      // });
      scrollToTop();
      $('.stepTabData').find('.form-control[type!=hidden]:first').focus();
    }
  }, 1000);
});

function responsiveBehaviour() {
  if (ww <= 567) {
    responsiveRider();
  }
}

function responsiveRider() {
  var countOfRiderRefContainer = $('.riderRefContainer').length;
  if (ww <= 567 && countOfRiderRefContainer > 0) {
    $('.riderRefContainer').addClass('active');
    //$('.riderRefContainer.scrollDiv').mCustomScrollbar('destroy');
    $('.riderRefContainer').css('overflow-x', 'auto');
    // loadScrollbar($('.riderRefContainer'));
  }
}

/**rider functionality starts */
$(document).on('click', '.cardRiderRef', function () {
  $(this).toggleClass('active');
  var selectedCard = $(this);
  selectRider(selectedCard);
});

function selectRider(selectedCard) {
  var riderTitle = selectedCard.find('h5').text();
  var riderID = selectedCard.attr('id');
  var dropComponent = selectedCard.closest('.innerVerticalTab').find('.ivtRight > .row');
  var dropContent = $('#selectedRiderCardContent').html();
  if (ww > 567) {
    dropComponent.append('<div class="col-lg-6">' + dropContent + '</div>');
  } else {
    dropComponent.prepend('<div class="col-lg-6">' + dropContent + '</div>');
  }
  dropComponent.find('>div:last-child').find('.cardRider .card-header > h5').text(riderTitle);
  dropComponent.find('>div:last-child').find('.cardRider').attr('data-card-ref', riderID);
}

$(document).on('click', '.cardRider .headerActions .flipper', function () {
  $(this).parent().find('.innerOverlay').fadeIn();
});
$(document).on('click', '.cardRider .headerActions .innerOverlay .btnYes', function (e) {
  e.stopPropagation();
  var cardRefId = $(this).closest('.cardRider').attr('data-card-ref');
  $(this)
    .closest('.innerVerticalTab')
    .find('.ivtLeft .cardRiderRef#' + cardRefId)
    .removeClass('active');
  $(this).closest('.cardRider').parent().remove();
});

$(document).on('click', '.cardRider .headerActions .innerOverlay .btnNo', function (e) {
  e.stopPropagation();
  $(this).closest('.innerOverlay').fadeOut();
});

$(document).on('click', '.cardRiderRef > .cardImg > .videoBanner > .videoBtn', function (e) {
  e.stopPropagation();
  $('.modalRiderPopup').modal('show');
});

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

$(document).on('click', '.card .editCardDetails', function () {
  $(this).closest('.card').find(".cardOverlay[data-content='cardOverlayEditDetails']").show();
  // loadScrollbar($('.scrollDiv'));
});

$(document).on('click', '.card.cardRider .videoBanner .videoBtn', function () {
  $(this).closest('.card').find(".cardOverlay[data-content='cardOverlayVideo']").show();
  var videoElement = $(this)
    .closest('.card')
    .find(".cardOverlay[data-content='cardOverlayVideo'] .videoElement")[0];
  playVideo(videoElement);
});
/**rider functionality ends */

// function setRiderLeftPanelHeight() {
//     var countOfRiderRefContainer = $('.riderRefContainer').length;
//     if (ww > 567 && countOfRiderRefContainer > 0) {
//         var rOffset = $('.riderRefContainer').offset().top;
//         var formFooterHeight = $('.formFooter').outerHeight();
//         var riderRefContainerHeight = wh - rOffset - formFooterHeight;
//         $('.riderRefContainer').height(riderRefContainerHeight);
//         $('.riderRefContainer').css(
//             'max-height',
//             riderRefContainerHeight + 'px'
//         );
//     }
// }
// function setRiderLeftPanelHeight() {
//     var countOfRiderRefContainer = $('.riderRefContainer').length;
//     if (ww > 567 && countOfRiderRefContainer > 0) {
//         var rOffset = $('.riderRefContainer').offset().top;
//         var formFooterHeight = $('.formFooter').outerHeight();
//         var riderRefContainerHeight = wh - rOffset - formFooterHeight;
//         $('.riderRefContainer').height(riderRefContainerHeight);
//         $('.riderRefContainer').css(
//             'max-height',
//             riderRefContainerHeight + 'px'
//         );
//     }
// }
