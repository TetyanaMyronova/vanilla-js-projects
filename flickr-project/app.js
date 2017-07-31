
(function(){
    var flickrKey = 'a79dbdd1d24bbdf97f202f74ff0b63ec';

    var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&api_key=';

    var SQUARE_IMG_SUFFIX = 'q';

    function getPhotos(searchTerm) {
        var url = `${flickrAPI}${flickrKey}&text=${searchTerm}`;

        return (
            fetch(url) // Returns a promise for a Response
                .then(response => response.json()) // Returns a promise for the parsed JSON
                .then(data => data.photos.photo)
        );
    }

    var app = document.querySelector('#app');
    var searchForm = app.querySelector('.search-form');
    var searchTherm = app.querySelector('.searchTerm');
    var results = app.querySelector('.results');

    function createFlickrThumb(photoData) {
        var link = document.createElement('a');
        link.setAttribute('href', photoData.large);
        link.setAttribute('target', '_blank');

        var image = document.createElement('img');
        image.setAttribute('src', photoData.thumb);
        image.setAttribute('alt', photoData.title);

        link.appendChild(image);

        return link;
    }



    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var filter = searchTherm.value;
        results.innerText = 'Loading...';
        getPhotos(filter)
            .then(function(result) {
                results.innerText = '';
                result.forEach(function(photo){
                    var url=`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
                    var thumbnail = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${SQUARE_IMG_SUFFIX}.jpg`;

                    var item = createFlickrThumb({
                        thumb:thumbnail,
                        large:url,
                        title:photo.title
                    });
                    results.appendChild(item);
                })
            });
    });

    // var last_known_scroll_position = 0;
    // var ticking = false;
    //
    // function doSomething(scroll_pos) {
    //     // do something with the scroll position
    // }
    //
    // window.addEventListener('scroll', function(e) {
    //     last_known_scroll_position = window.scrollY;
    //     if (!ticking) {
    //         window.requestAnimationFrame(function() {
    //             doSomething(last_known_scroll_position);
    //             ticking = false;
    //         });
    //     }
    //     ticking = true;
    // });
})();
