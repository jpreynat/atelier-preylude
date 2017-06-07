$(document).ready(function() {
    // Try to read initial page from landing URL
    var initialLocation = window.location.pathname
        .split('/')
        .slice(-1)[0];

    // Get the container for main-content
    var container = $('#main-content');
    var initialPage = initialLocation ? initialLocation : 'home';
    // This object will cache the ajax loaded pages
    var loadedPages = {};
    var map;
    // Google maps options
    var mapOptions = {
        center: new google.maps.LatLng(45.777919, 3.082568),
        zoom: 17
    };
    // Google maps marker for Atelier Preylude
    var markerAtelier = new google.maps.Marker({
        position: new google.maps.LatLng(45.778444, 3.082543),
        title: 'Atelier Preylude',
        icon: 'img/map-marker-fuschia.png'
    });
    // Owl Carousel options
    var owlOptions = {
        items: 1,
        loop: true,
        margin: 0,
        autoplay: true,
        autoplayTimeout: 3500,
        autoplayHoverPause: true,
        autoplaySpeed: 750,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut'
    };

    // Load initial page
    loadPage(initialPage);

    // Create a link for each navbar item to load pages
    $('#navbar li').each(function(index) {
        var pageName = $(this).attr('data-link');

        // Add the click event listener on each element
        $(this).on('click', function() {
            // Load content
            loadPage(pageName);
        });
    });

    // Load a page and update #main-content container
    function loadPage(
        pageName,
        pushHistory = true
    ) {
        container.animate({
            opacity: 0
        }, 450, 'linear', function() {
            // Mark current menu as active
            setNavLinkActive(pageName);

            // Get content from cache or AJAX
            return Promise.resolve()
            .then(function() {
                if (loadedPages.hasOwnProperty(pageName)) {
                    return loadedPages[pageName];
                }

                var fileName = 'pages/' + pageName + '.html';
                return $.get(fileName);
            })
            .then(function(content) {
                // Set new HTML content
                container.html(content);
                // Save in cache
                loadedPages[pageName] = content;

                // Refresh dynamic content
                // Google Maps
                if (pageName == 'infos') {
                    map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
                    markerAtelier.setMap(map);
                }
                // Carousel
                if (pageName == 'restauration') {
                    $('.owl-carousel').owlCarousel(owlOptions);
                }

                // Push to history when navigating
                if (pushHistory) {
                    window.history.pushState(
                        { pageName: pageName },
                        '',
                        pageName == 'home' ? '.' : pageName
                    );
                }

                // Display new content
                container.animate({
                    opacity: 1
                }, 450, 'linear');
            });
        });
    }

    // Set a nav link as active by name
    function setNavLinkActive(
        pageName
    ) {
        $('#navbar li').each(function(index) {
            $(this).removeClass('active');

            var dataLink = $(this).attr('data-link');
            if (dataLink == pageName) {
                $(this).addClass('active');
            }
        });
    }

    // Handle history updates
    window.onpopstate = function(event) {
        // Get page name from previous state
        var pageName = event.state.pageName;
        loadPage(pageName, false);
    };
});
