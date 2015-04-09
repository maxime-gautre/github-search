'use strict';

(function () {

    $(document).ready(function ($) {

        // navbar
        $('.button-collapse').sideNav();
        $('div#search').slideUp();
        $('div#savedRepos').slideUp();
        // init select
        $('select').material_select();
        // init date
        $('.datepicker').pickadate({
            formatSubmit: 'yyyy-mm-dd'
        });
        $('#loading').hide();

        // Toggle search
        $('a#toggle-search').click(function () {
            var search = $('div#search');
            search.is(':visible') ? search.slideUp() : search.slideDown(function () {
                search.find('input').focus();
            });
            return false;
        });

        //Toggle bookmarks
        $('a#toggle-bookmarks').click(function () {
            var search = $('div#savedRepos');
            search.is(':visible') ? search.slideUp() : search.slideDown(function () {
                search.find('input').focus();
            });
            return false;
        });

        /*
         Forms
         */
        $('#buttonAdvancedSearch').click(function () {

            fadeInImage('#advancedSearch');
            $('#classicSearch').hide();
            $('#advancedSearch').show();
        });

        $('#hideAdvancedSearch').click(function () {
            fadeInImage('#classicSearch');
            $('#classicSearch').show();
            $('#advancedSearch').hide();
        });

        $('input[type=radio][name=signForks]').change(function () {
            if (this.value === 'limit') {
                $('#limitForks').removeAttr('disabled');
            } else {
                $('#limitForks').attr('disabled', 'disabled');
            }
        });

        $('input[type=radio][name=signSize]').change(function () {
            if (this.value === 'limit') {
                $('#limitSize').removeAttr('disabled');
            } else {
                $('#limitSize').attr('disabled', 'disabled');
            }
        });

        $('input[type=radio][name=signStars]').change(function () {
            if (this.value === 'limit') {
                $('#limitStars').removeAttr('disabled');
            } else {
                $('#limitStars').attr('disabled', 'disabled');
            }
        });
        /*
         End forms
         */

        // timeline
        $('#timelineLink').click(function () {

            var $timeline_block = $('.cd-timeline-block');
            var options = [];

            $timeline_block.each(function () {
                $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
                options.push({
                    selector: $(this),
                    offset: 0,
                    callback: 'timelineFunction()'
                });
            });

            scrollFire(options);
        });

        // Indexeddb

        $('button#saveRepo').hide();
        $('button#doneRepo').hide();
        $('button#deleteRepo').hide();

        $('button#saveRepo').click(function () {
            uiActions.addRepo();
        });

        $('button#deleteRepo').click(function () {
            uiActions.deleteRepo();
        });

    });
})();