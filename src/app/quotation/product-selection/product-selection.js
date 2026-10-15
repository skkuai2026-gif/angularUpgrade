/* Modified by Monisha Pillai */
export function sectionContents(slidesToShow, initialSlide) {
  $('.sectionProduct').fadeIn(function () {
    var sliderElement = $(this).find('.sectionContent .productSlider');
    setTimeout(() => {
      initSlickSlider(sliderElement, slidesToShow, initialSlide);
    }, 5);
  });
}

export function planOptionContents(slidesToShow, initialSlide) {
  $('.planOption').fadeIn(function () {
    var sliderElement = $(this).find('.planOptionSectionContent .productSlider');
    setTimeout(() => {
      initSlickSlider(sliderElement, slidesToShow, initialSlide);
    }, 5);
  });
}

$(document).on('click', '.card.cardProductSelection .videoBanner .videoBtn', function () {
  $(this).closest('.card').find(".cardOverlay[data-content='cardOverlayVideo']").show();
  var videoElement = $(this)
    .closest('.card')
    .find(".cardOverlay[data-content='cardOverlayVideo'] .videoElement")[0];
  playVideo(videoElement);
});
