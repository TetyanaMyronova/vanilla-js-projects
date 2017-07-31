var app = document.querySelector('#app');
var form = app.querySelector('.flickr-form');
var input = form.querySelector('.search-input');
var container = app.querySelector('.photos-container');

var FLICKR_API_KEY = 'be7e284c7c8bc84c932bccd6c537f5b7';
var SQUARE_IMG_SUFFIX = '_q';

function getPhotos(query) {
    var url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&api_key=${FLICKR_API_KEY}&text=${query}`;

    return (
        fetch(url)
            .then(r => r.json())
            .then(data => data.photos.photo)
    );
}

function buildPhoto(photo) {
    /*
     1. Create a new <li> DOM element for the current photo
     2. Create an <img> element and give it the appropriate src
     3. Append the <img> to the <li>
     4. Append the <li> to my container
     */

    var li = document.createElement('li');
    var img = document.createElement('img');
    img.src = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}${SQUARE_IMG_SUFFIX}.jpg`;
    li.appendChild(img);

    return li;
}

form.addEventListener('submit', event => {
    event.preventDefault();

    var query = input.value;
    getPhotos(query)
        .then(photos => {
            photos.forEach(photo => {
                container.appendChild(buildPhoto(photo));
            });

        })
        .catch(console.error)
})