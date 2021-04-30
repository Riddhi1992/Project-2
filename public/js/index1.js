// we use axios to hit our api and get data
axios.get("http://localhost:3000/getPosts").then((res) => {
    populateData(res.data);
});

// render data
const populateData = (data) => {
    console.log(data);
    let card = "";
    let modals = "";
    if (data.length < 0) {
        return;
    }

    for (let i = 0; i < data.length; i++) {
        card += `                
                <div class="col-md-4 px-4">
                    <div class="card post_card p-3">
                        <p class="label">
                            Title: <span>${data[i].title}</span>
                        </p>
                        <p class="label mt-2">
                            Author: <span class="">${data[i].author}</span>
                        </p>
                        <p class="label mt-2">
                            Description: <span class="">${data[i].desc}</span>
                        </p>
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal_${data[i]._id}">
                           View More
                        </button>              
                    </div>
                </div>
            `;

        modals += `
                    <div class="modal fade" id="modal_${data[i]._id}" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                ...
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Save changes</button>
                            </div>
                            </div>
                        </div>
                    </div>
                `;

        // render cards
        document.getElementById("posts_row").innerHTML = card;

        // render modals
        document.getElementById("popUps").innerHTML = modals;
    }
};