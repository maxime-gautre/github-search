

timelineFunction = function () {

    var $timeline_block = $('.cd-timeline-block');
    $timeline_block.each(function () {
        if ($(this).offset().top <= $(window).scrollTop() + $(window).height() * 0.75 && $(this).find('.cd-timeline-img').hasClass('is-hidden')) {
            $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
        }
    });
};

getData = function (hasNext, page) {
    $("#loading").show();
    $.get('/search?' + hasNext).done(function (data) {

        $('#end' + page).hide();
        $('#end' + page).html(data);
        setTimeout(function () {
            $("#loading").hide();
            $('#end' + page).show();
        }, 200);
    });
};