// Calling id from _form.ejs

$("#add_review").submit(function(event) {
    alert("Data inserted successfully!")
});

$('#update_review').submit(function(event) {
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}
    $.map(unindexed_array, function(n, i) {
        data[n['title']] = n['value']
    })
    console.log(data);

    var request = {
        "url": `http://localhost:3000/post/update/${data.id}`,
        "method": "PUT",
        "data": data
    }

    $.ajax(request).done(function(response) {
        alert("Data updated successfully!!")
    })
})

if(window.location.pathname == '/review') {
    $ondelete = $(".table tbody td a .delete");
    $ondelete.click(function() {
        var id = $(this).attr("data-id")

        var request = {
            "url": `http://localhost:3000/delete/${id}`,
            "method": "DELETE"
        }
        if(confirm("Do you really want to delete this record?")) {
            $.ajax(request).done(function(response) {
                alert("Data deleted successfully!!")
                location.reload();
            })
        }
    })
}