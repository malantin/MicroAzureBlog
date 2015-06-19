$(function() {
    var client = new WindowsAzure.MobileServiceClient('https://yourmobileservice.azure-mobile.net/', 'yourapplicationsecret'),
        postsTable = client.getTable('posts');

    // Read current data and rebuild UI.
    // If you plan to generate complex UIs like this, consider using a JavaScript templating library.
    function refreshPosts() {
        var query = postsTable;

        query.read().then(function(posts) {
            var listItems = $.map(posts, function(item) {
                return $('<li>')
                    .attr('data-posts-id', item.id)
                    .append($('<button class="item-delete">Delete</button>'))
                    .append($('<div>').append($('<input class="item-title">').val(item.title)))
                    .append($('<div>').append($('<input class="item-text">').val(item.text)));
            });

            $('#posts').empty().append(listItems).toggle(listItems.length > 0);
            $('#summary').html('<strong>' + posts.length + '</strong> item(s)');
        }, handleError);
    }

    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        $('#errorlog').append($('<li>').text(text));
    }

    function getPostId(formElement) {
        return $(formElement).closest('li').attr('data-posts-id');
    }

    // Handle insert
    $('#add-item').submit(function(evt) {
        var textbox = $('#new-item-text'),
            itemText = textbox.val();
        var textbox2 = $('#new-item-title'),
            itemTitle = textbox2.val();
        if (itemText !== '') {
            postsTable.insert({title: itemTitle, text: itemText}).then(refreshPosts, handleError);
        }
        textbox.val('').focus();
        evt.preventDefault();
    });

    // Handle update
    $(document.body).on('change', '.item-text', function() {
        var newText = $(this).val();
        postsTable.update({ id: getPostId(this), text: newText }).then(null, handleError);
    });

    $(document.body).on('change', '.item-title', function() {
        var newText = $(this).val();
        postsTable.update({ id: getPostId(this), title: newText }).then(null, handleError);
    });

    // Handle delete
    $(document.body).on('click', '.item-delete', function () {
        postsTable.del({ id: getPostId(this) }).then(refreshPosts, handleError);
    });

    // On initial load, start by fetching the current data
    refreshPosts();
});