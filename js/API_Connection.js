const d = document,
    $site = d.getElementById("site"),
    $posts = d.getElementById("posts"),
    $loader = d.querySelector(".loader"),
    $template = d.getElementById("post-template").content,
    $fragment = d.createDocumentFragment(),
    DOMAIN = "https://lucyLara.com",
    SITE = `${DOMAIN}/wp-json`,
    API_WP = `${SITE}/wp/v2`,
    POSTS = `${API_WP}/posts?_embed`,
    PAGES = `${API_WP}/pages`,
    CATEGORIES = `${API_WP}/categories`;

export const getSiteData = () => {
    fetch(SITE)
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(json => {
            console.log(json)

            $site.innerHTML = `
                <h3>Sitio Web</h3>
                <h2>
                    <a href="${json.url}" target="_blank">${json.name}</a>
                </h2>
                <p>${json.description}</p>
                <p>${json.timezone_string}</p>
            `
        })
        .catch(error => {
            let message = error.statusText || "Ocurrió un error."

            console.log(error)

            $site.innerHTML = `<p>Error ${error.status}: ${message}</p>`
        })
}

export const getPost = () => {
    $loader.style.display = "block"

    fetch(POSTS)
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(json => {
            console.log(json)

            json.forEach((el) => {
                let categories = ``,
                    tags = ``

                el._embedded["wp:term"][0].forEach((li) => categories += `<li>${li.name}</li>`)
                el._embedded["wp:term"][1].forEach((li) => tags += `<li>${li.name}</li>`)

                $template.querySelector(".post-image").src = el._embedded["wp:featuredmedia"][0].source_url
                $template.querySelector(".post-image").alt = el.title.rendered
                $template.querySelector(".post-title").innerHTML = el.title.rendered
                $template.querySelector(".post-author").innerHTML = `
                    <img src='${el._embedded.author[0].avatar_urls['48']}' alt='${el._embedded.author[0].name}'>
                    <figcaption>${el._embedded.author[0].name}</figcaption>
                `
                $template.querySelector(".post-date").innerHTML = new Date(el.date).toLocaleDateString()
                $template.querySelector(".post-link").href = el.link
                $template.querySelector(".post-excerpt").innerHTML = el.excerpt.rendered.replace("[&hellip;]", "...")
                $template.querySelector(".post-category").innerHTML=`
                    <p>Categorias:</p>
                    <ul>${categories}</ul>
                `
                $template.querySelector(".post-tags").innerHTML=`
                    <p>Etiquetas:</p>
                    <ul>${tags}</ul>
                `
                $template.querySelector(".post-content > article").innerHTML = el.content.rendered
                
                let $clone = d.importNode($template, true)
                $fragment.appendChild($clone)
            })

            $posts.appendChild($fragment)
            $loader.style.display = "none"
        })
        .catch(error => {
            let message = error.statusText || "Ocurrió un error."

            console.log(error)

            $site.innerHTML = `<p>Error ${error.status}: ${message}</p>`
            $loader.style.display = "none"
        })
}