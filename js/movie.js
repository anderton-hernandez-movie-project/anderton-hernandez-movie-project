
$(document).ready(function(){
    `use strict`

    let movieArray = [];
    let url = "https://mahogany-dynamic-lip.glitch.me/movies";

    const moviePosters = () => {
        let loader = `<div class="loading posters"><img src="img/loading.gif"></div>`;
        $("#container").html(loader);
        fetch(url)
            .then(resp => resp.json())
            .then(movies => {
                for (let movie of movies) {
                    let i = movie.id;
                    renderMovies(movie, i);
                    getPoster(movie.title, i);
                }
                $(`.loading`).remove()
            });
    }

    moviePosters();

    //============Renders HtML from fetch===========\\
    const renderMovies = (movie, iterator) => {
        //creates the dropdown menus for select
        html = `<option value=${iterator}>${movie.title}</option>`;

        //creates movie posters
        htmlStr = `<div class="posters grow gradient-border"><div>`
        htmlStr += `<h1 class="title">${movie.title}</h1><div class="genre">${movie.genre}</div><div id="image-container${iterator}"></div>`;
        htmlStr += `<div class="underImgContainer"><div class="rating">${createStars(movie)}</div><div class="director">By: ${movie.director}</div></div>`;
        htmlStr += `<div class="description">${movie.plot}</div>`;
        htmlStr += `</div></div>`;
        //pushes created card or dropdown menu to the screen
        $("#container").append(htmlStr);
        $("#selectMenu").append("<option value='-1' selected>Select a movie</option>" + html);
        $("#selectMenu2").append("<option value='-1' selected>Select a movie</option>" + html);
    }

    //========Show the edit menu========\\
    $("#showEdit").click(function() {
        isOpen($("#selectMenu2"))
        isOpen($("#delete-movie"))
        isOpen($("#postMovie"))
        $("#editMovie").toggleClass("hidden1");
        $("#selectMenu").toggleClass("hidden1");
    });
    //hide edit menu
    $("#changeMovie").click(function(){
        $("#editMovie").toggleClass("hidden1");
        $("#selectMenu").toggleClass("hidden1");
    })

    //========show the delete menu========\\
    $(".remove-hidden").click(function() {
        isOpen($("#editMovie"))
        isOpen($("#selectMenu"))
        isOpen($("#postMovie"))
        $("#selectMenu2").toggleClass("hidden1");
        $("#delete-movie").toggleClass("hidden1");
    });
    //hide delete menu
    $("#delete-movie").click(function(){
        $("#selectMenu2").toggleClass("hidden1");
        $("#delete-movie").toggleClass("hidden1");
    })

    //========show the post menu========\\
    $("#post-id").click(function () {
        isOpen($("#editMovie"))
        isOpen($("#selectMenu"))
        isOpen($("#selectMenu2"))
        isOpen($("#delete-movie"))
        $("#postMovie").toggleClass("hidden1");
    });
    //hide post menu
    $("#newMovie").click(function() {
        $("#postMovie").toggleClass("hidden1");
    })
    //=========Close menu if open==========\\
    const isOpen = $id => {
        if (!$id.hasClass(`hidden1`)) {
            $id.toggleClass("hidden1");
        }
    }

    //when the option selected is changed, update the input fields
    $("#selectMenu").change(function(){
        let target = $(this).val()
        console.log(target);

        //grab info from the json file and populate the input fields
        for (let movie of movieArray) {
            if (movie.id == target) {
                $("#newTitle").val(movie.title);
                $("#newGenre").val(movie.genre);
                $("#newRating").val(movie.rating);
                $("#newDirector").val(movie.director);
                $("#newPlot").val(movie.plot);
            }
        }
    })

    //=========Creates stars from rating========\\
    function createStars(movie){
        let html = "";
        for(var i = 0; i < movie.rating; i++){
            html += "<i class=\"fas fa-star\" style='color: yellow'></i>"
        }
        if(movie.rating !== 5){
            for(var j = movie.rating; j < 5; j++){
                html += "<i class=\"fas fa-star\"></i>";
            }
        }
        return html;
    }

    //Edit selected movie
    $("#changeMovie").click(function(){
        let input = $("#selectMenu").val()
        let insert = {
            title: $("#newTitle").val(),
            genre: $("#newGenre").val(),
            rating: $("#newRating").val(),
            director: $("#newDirector").val(),
            plot: $("#newPlot").val()
        }
        let patchOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(insert)
        }
        //PATCH request
        fetch(`${url}/${input}`, patchOptions)
            .then(moviePosters);
    });

    //delete movie
    let deleteOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    $("#selectMenu2").change(function()  {
        let inputVal = $(this).val();
        console.log("hello: " + inputVal);
        $("#delete-movie").click(function() {
            //DELETE request
            fetch(`${url}/${inputVal}`, deleteOptions)
                .then(moviePosters);
        });
    });


    //create a new movie
    $('#newMovie').click((e) => {
        e.preventDefault();

        var addMovie = {
            title: $("#title").val(),
            genre: $("#genre").val(),
            rating: $("#rating").val(),
            director: $("#director").val(),
            plot: $("#plot").val()
        }
        let postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addMovie)
        }
        //POST movie
        fetch(url, postOptions)
            .then(resp => resp.json())
            .then(moviePosters).catch(error => console.log(error))
    });


    //======Gets data from TMDb to create poster image======\\
    const getPoster = (movie, iterator) => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: MPK
            }
        };
        fetch(`https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`, options)
            .then(response => response.json())
            .then(response => {
                response.results.every(function (item) {
                    renderImg(item, movie, iterator)
                })
            })
            .catch(err => console.error(err));
}

    //=======Renders Image with data from TMDb========\\
    const renderImg = (item, movie, iterator) => {
        let dBTitle = item.title.toLowerCase();
        let mTitle = movie.toLowerCase();
        if (mTitle === dBTitle && item.poster_path !== null) {
            let posterPath = item.poster_path
            let url = `https://image.tmdb.org/t/p/w500${posterPath}`
            var img = $('<img/>', {
                src: url,
                alt: 'Movie poster',
                class: 'movie-posters'
            })
            img.appendTo($(`#image-container${iterator}`));
            return false;
        }
    }
});