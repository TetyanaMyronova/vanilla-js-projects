fetch('https://www.reddit.com/r/montreal.json')
    .then(function(response) {
        return response.json(); // Parsing as JSON returns a Promise, let's chain it
    })
    .then(function(jsonResponse) {
        jsonResponse.data.children
            .map(function(post) {
                post = post.data; // Reddit has a weird format ;)

                // Create a box for each post
                var linkBox = document.createElement('p');

                // Create a link element for each post
                var link = document.createElement('a');
                link.setAttribute('href', post.url);
                link.setAttribute('target', '_blank'); // Make the link open in a new tab
                link.innerText = post.title;

                // Add the link to the paragraph
                linkBox.appendChild(link);

                // Return the paragraph from the map callback
                return linkBox;
            })
            .forEach(function(linkParagraph) {
                document.body.appendChild(linkParagraph);
            });
    });