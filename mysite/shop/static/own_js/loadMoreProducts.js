$(document).ready(function(){
  $('#lazyLoadLink').on('click', function() {
    var link = $(this);
    var page = link.data('page');

    $.ajax({
      type: 'post',
      url: 'lazy_load_posts',
      data: {
        'page': page,
        'csrfmiddlewaretoken': window.CSRF_TOKEN // from index.html
      },
      success: function(data) {
        // if there are still more pages to load,
        // add 1 to the "Load More Posts" link's page data attribute
        // else hide the link
        console.log(page);
        console.log(data.has_next);
        if (data.has_next) {
            link.data('page', page+1);
        } else {
          link.hide();
        }
        // append html to the posts div
        $('#products').append(data.products_html);
      },
      error: function(xhr, status, error) {
        // shit happens friends!
      }
    });
  });
});