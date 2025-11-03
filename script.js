// Generate wiki-items dynamically using createElement and appendChild
(function(){
  var breeds = [
    {display: 'Beagle', wiki: 'Beagle', api: 'beagle'},
    {display: 'Siberian Husky', wiki: 'Siberian husky', api: 'husky'},
    {display: 'Pug', wiki: 'Pug', api: 'pug'},
    {display: 'Boxer', wiki: 'Boxer (dog)', api: 'boxer'},
    {display: 'Pomeranian', wiki: 'Pomeranian', api: 'pomeranian'}
  ];

  var container = document.getElementById('wiki-container');

  if (!container) {
    console.error('Container element not found');
    return;
  }

  // For each breed create the DOM structure per template and then fetch data
  breeds.forEach(function(breed){
    // Template:
    // <div class="wiki-item">
    //   <h1 class="wiki-header">Breed X</h1>
    //   <div class="wiki-content">
    //      <p class="wiki-text">Some text...</p>
    //      <div class="img-container"><img class="wiki-img" src=""></div>
    //   </div>
    // </div>

    var item = document.createElement('div');
    item.className = 'wiki-item';

    var header = document.createElement('h1');
    header.className = 'wiki-header';
    header.textContent = breed.display;
    item.appendChild(header);

    var content = document.createElement('div');
    content.className = 'wiki-content';

    var textP = document.createElement('p');
    textP.className = 'wiki-text';
    textP.textContent = 'Loading summary...';
    content.appendChild(textP);

    var imgWrap = document.createElement('div');
    imgWrap.className = 'img-container';

    var img = document.createElement('img');
    img.className = 'wiki-img';
    img.alt = breed.display + ' image';
    // don't set src yet
    imgWrap.appendChild(img);
    content.appendChild(imgWrap);

    item.appendChild(content);
    container.appendChild(item);

    // Fetch random dog image from dog.ceo
    var imgUrl = 'https://dog.ceo/api/breed/' + breed.api + '/images/random';
    fetch(imgUrl).then(function(res){
      if (!res.ok) throw new Error('Image fetch failed');
      return res.json();
    }).then(function(data){
      if (data && data.status === 'success' && data.message) {
        img.src = data.message;
      } else {
        img.alt = 'Image not available';
      }
    }).catch(function(err){
      console.warn('Image load error for', breed.api, err);
      img.alt = 'Image failed to load';
    });

    // Fetch Wikipedia summary for the breed
    var wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(breed.wiki);
    fetch(wikiUrl).then(function(res){
      if (!res.ok) throw new Error('Wiki fetch failed');
      return res.json();
    }).then(function(data){
      if (data && data.extract) {
        // Use the extract provided by the API
        textP.textContent = data.extract;
      } else if (data && data.title) {
        textP.textContent = 'No summary available for ' + data.title + '.';
      } else {
        textP.textContent = 'No summary available.';
      }
    }).catch(function(err){
      console.warn('Wiki load error for', breed.wiki, err);
      textP.textContent = 'Failed to load summary.';
    });

  });

})();
