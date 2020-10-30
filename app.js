const ids = [];

const showAllCards = (res) => {
    /*
    * Este metodo carga toda las cartas en la rejilla central
    */
    let article = document.getElementsByTagName('article')[0];

    for (line in res) {
        let section = document.createElement('section');
        section.id = res[line].id;

        ids.push(parseInt(res[line].id));

        let paragraph = document.createElement('p');

        let id_card = document.createElement('span');
        id_card.classList.add('id-card');
        id_card.innerHTML = '#' + res[line].name;

        let img = document.createElement('img');
        img.src = res[line].image;
        img.classList.add('image-card');

        paragraph.appendChild(id_card);
        paragraph.classList.add('name-card');
        paragraph.textContent = res[line].name;

        section.appendChild(paragraph);
        section.appendChild(img);

        article.appendChild(section);
    }
}

const showCard = (res) => {
    /*
    * Este metodo carga una carta en una ventana modal
    */
    let modal_card = document.getElementById('modal-card');
    let id = document.getElementById('modal-id');
    let name = document.getElementById('modal-name');
    let image = document.getElementById('image-card');
    let quote = document.getElementById('modal-quote')
    let close = document.getElementById('close-modal-card')

    id.textContent = '#' + res.id;
    name.textContent = res.name;
    image.src = res.image;
    quote.textContent = res.quote;

    modal_card.setAttribute('class', 'modal-background');

    close.addEventListener('click', () => {
        let modal_card = document.getElementById('modal-card');

        modal_card.setAttribute('class', 'modal-hidden');
    })
}

const postCard = () => {
    // Mostrar la ventana modal
    let modal_post = document.getElementById('modal-post');
    modal_post.setAttribute('class', 'modal-background');

    //Capturas del boton de enviar y cerrar
    let btn_post = document.getElementById('btn-post');
    let close = document.getElementById('close-modal-post')

    // Extraer datos del formulario 
    let name_card = document.getElementById('add-name-card');
    let img_card = document.getElementById('add-img-card');
    let quote_card = document.getElementById('add-quote-card');

    // Evento: Enviar peticion POST
    btn_post.addEventListener('click', (e) => {
        e.preventDefault();

        //Solucion error envio varias cartas en un click
        e.stopImmediatePropagation();

        //JSON object
        const data = {
            name: name_card.value,
            quote: quote_card.value,
            image: img_card.value
        };

        // Peticion POST de una las cartas
        fetch('http://localhost:8081/mtgdb/card', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json"
            }
        })
            .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))

        //Recargo la pagina para que se vean las cartas recien introducidas
        location.reload();

    })

    //EVENTO: Cerrar ventana
    close.addEventListener('click', () => {
        //Ocultamos la ventana modal
        modal_post.setAttribute('class', 'modal-hidden');

        // Vaciamos los datos del formulario
        name_card.value = "";
        img_card.value = "";
        quote_card.value = "";
    })
}

const putCard = () => {
    // Mostrar la ventana modal
    let modal_put = document.getElementById('modal-put');
    modal_put.setAttribute('class', 'modal-background');

    let btn_put = document.getElementById('btn-put');
    let close = document.getElementById('close-modal-put')

    // Extraer datos del formulario 
    let put_id_card = document.getElementById('put-id-card');
    let put_name_card = document.getElementById('put-name-card');
    let put_img_card = document.getElementById('put-img-card');
    let put_quote_card = document.getElementById('put-quote-card');

    //Cuando se envien los datos
    btn_put.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        const data = {
            name: put_name_card.value,
            quote: put_quote_card.value,
            image: put_img_card.value
        };

        //Si existe una carta con ese id
        if (ids.includes(parseInt(put_id_card.value))) {
            // Peticion PUT de una las cartas
            url = 'http://localhost:8081/mtgdb/card/' + put_id_card.value;
            fetch(url, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            })
                .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))

            location.reload();

        } else {
            alert('no existe una carta con ese id.')
        }



        put_id_card.value = "";
        put_name_card.value = "";
        put_img_card.value = "";
        put_quote_card.value = "";
    })

    //Cerrar ventana
    close.addEventListener('click', () => {
        modal_put.setAttribute('class', 'modal-hidden');
        put_id_card.value = "";
        put_name_card.value = "";
        put_img_card.value = "";
        put_quote_card.value = "";
    })

}

const deleteCard = () => {
    let modal_delete = document.getElementById('modal-delete');
    modal_delete.setAttribute('class', 'modal-background');

    let btn_modal_delete = document.getElementById('btn-delete');
    let close = document.getElementById('close-modal-delete')

    // Extraer datos del formulario 
    let delete_id_card = document.getElementById('delete-id-card');

    //Cuando se envien los datos
    btn_modal_delete.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        //Si existe una carta con ese id
        if (ids.includes(parseInt(delete_id_card.value))) {
            // Peticion DELETE de una las cartas
            url = 'http://localhost:8081/mtgdb/card/' + delete_id_card.value;
            fetch(url, {
                method: 'DELETE'
            })
                .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))

            location.reload();

        } else {
            alert('no existe una carta con ese id.')
        }
        delete_id_card.value = "";
    })

    close.addEventListener('click', () => {
        modal_delete.setAttribute('class', 'modal-hidden');
        delete_id_card.value = "";

    })
}

window.addEventListener('load', () => {
    let article = document.getElementsByTagName('article')[0];

    //Botones de la cabecera.
    let btn_header_post = document.getElementById('btn-header-post');
    let btn_header_put = document.getElementById('btn-header-put');
    let btn_header_delete = document.getElementById('btn-header-delete');

    // Peticion GET de todas las cartas
    fetch('http://localhost:8081/mtgdb/card')
        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => res.json())
        .then(res => showAllCards(res))
        .catch(error => alert('no se han podido recuperar las cartas'));

    // Peticion GET de una sola carta
    article.addEventListener('click', (event) => {
        url = 'http://localhost:8081/mtgdb/card/' + event.target.parentNode.id
        fetch(url)
            .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
            .then(res => res.json())
            .then(res => showCard(res))
            .catch(error => alert('No se ha podido obtener la informacion de la carta.'))
    })

    //Llamando a las funciones que gestionan las ventanas modales.
    btn_header_post.addEventListener('click', () => postCard());
    btn_header_put.addEventListener('click', () => putCard());
    btn_header_delete.addEventListener('click', () => deleteCard());
})