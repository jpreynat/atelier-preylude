$(document).ready(function () {
    // Get the container for main-content
    var container = $('#main-content'),
        initialPage = 'home',
    // This object will cache the ajax loaded pages
        loadedPages = {},
        map,
    
    // Google maps options
        mapOptions = {
          center: new google.maps.LatLng(45.777919, 3.082568),
          zoom: 17
        },
    // Google maps marker for Atelier Preylude
        markerAtelier = new google.maps.Marker({
          position: new google.maps.LatLng(45.778444, 3.082543),
          title: 'Atelier Preylude',
          icon: '../img/map-marker-themed.png'
      });
    
    // Load home page
    $.get('pages/' + initialPage + '.html', function (content) {
        container.html(content);
        loadedPages[initialPage] = content;
    });
    
    // Create a link for each navbar item to load pages
    $('#navbar li').each(function (index) {
        var pageName = $(this).attr('data-link'),
            link = 'pages/' + pageName + '.html';
    // Add the click event listener on each element
        $(this).on('click', function () {
            container.animate({
                opacity: 0
            }, 450, 'linear', function () {
            
                if (loadedPages.hasOwnProperty(link)) {
                    container.html(loadedPages[link]);
                    // Load google maps
                    if (pageName === 'infos') {
                        map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
                        markerAtelier.setMap(map);
                    }
                    container.animate({
                        opacity: 1
                    }, 450, 'linear');
                }
                else {
                    $.get(link, function (content) {
                        container.html(content);
                        loadedPages[link] = content;
                        // Load google maps
                        if (pageName === 'infos') {
                            map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
                            markerAtelier.setMap(map);
                        }
                        container.animate({
                            opacity: 1
                        }, 450, 'linear');
                    });
                }
            });
        });
    });
});