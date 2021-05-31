const page = {
  pokemonList: document.querySelector(".pokemon-list ul"),
  cardPokemon: {
    container: document.querySelector(".pokemon-card"),
    title: {
      name: document.querySelector(".pokemon-card-title h3"),
      buttonFavorite: document.querySelector(".pokemon-title button"),
    },
    display: document.querySelector(".pokemon-card-display img"),
    stats: {
      "hp": document.querySelector(".pokemon-card-stats-hp>span"),
      "attack": document.querySelector(".pokemon-card-stats-attack>span"),
      "defense": document.querySelector(".pokemon-card-stats-defense>span"),
      "special-attack": document.querySelector(".pokemon-card-stats-special-attack>span"),
      "special-defense": document.querySelector(".pokemon-card-stats-special-defense>span"),
      "speed": document.querySelector(".pokemon-card-stats-speed>span")
    },
    details: {
      height: document.querySelector(".pokemon-card-details-height>div"),
      weight: document.querySelector(".pokemon-card-details-weight>div"),
      types: document.querySelector(".pokemon-card-details-types>div"),
      abilities: document.querySelector(".pokemon-card-details-abilities>div")
    }
  },
  navigator: {
    offset: 0,
    limit: 20,
    length: 0,
    next: {
      value: true,
      element: document.querySelector(".pokemon-list-next-page")
    },
    previous: {
      value: false,
      element: document.querySelector(".pokemon-list-previors-page")
    }
  }
}

function listPokemon() {
  Pokemon.list(page.navigator.offset, page.navigator.limit)
    .then( pokemons => {
      pokemons.map((pokemon) => {
        if(pokemon.id + page.navigator.offset <= page.navigator.length) {
          page.pokemonList.innerHTML +=
`<li class=" d-flex justify-content-between p-2 my-1" onclick="detailsPokemon(event, '${pokemon.id + page.navigator.offset}')">
  <strong><img src="../Image/pokeball-icon.png" width="20" alt="pokeball" /> No. ${idFormatter(pokemon.id + page.navigator.offset)}</strong>
  <span>${pokemon.name}</span>
</li>`    
        }
      })
    })
}

function clearListPokemon() {
  page.pokemonList.innerHTML = ""
}

function detailsPokemon(e, id) {
  Pokemon.search(id).then( pokemon => {

    page.cardPokemon.title.name.innerHTML = `No. ${idFormatter(pokemon.id)} ${pokemon.name}`
    page.cardPokemon.display.src = `${pokemon.sprite}`

    pokemon.stats.forEach(stat => {
      page.cardPokemon.stats[stat.name].innerHTML = stat.baseStat
    });

    page.cardPokemon.details.height.innerHTML = `${pokemon.details.height/10} m`
    page.cardPokemon.details.weight.innerHTML = `${pokemon.details.weight/10} Kg`
    page.cardPokemon.details.types.innerHTML = pokemon.details.types.map(type => {
      return `
<span class="pokemon-card-details-type badge my-1" style="background-color: var(--color-type-${type.type.name})">
  <img src="../Image/Icons/${type.type.name}.svg" width="15" alt="icone que representa o type ${type.type.name} do pokemon" />
  ${type.type.name}
</span>`
    }).join(" ")
    page.cardPokemon.details.abilities.innerHTML = pokemon.details.abilities.map(ability => {
      return `<span class="badge ${ability["is_hidden"] ? 'pokemon-card-details-abilities-is-hidden' : ''}"/>${ability.ability.name}</span>`
    }).join(" ")
  })
}

function nextPage() {
  
  if(page.navigator.next.value) {
    page.navigator.offset += page.navigator.limit
    clearListPokemon()
    listPokemon()
    updateNavigator()
  }
}

function previorsPage() {
  
  if(page.navigator.previous) {
    page.navigator.offset -= page.navigator.limit
    clearListPokemon()
    listPokemon()
    updateNavigator()
  }
}

function updateNavigator() {
  document.querySelectorAll("button").forEach(el => {
    el.removeAttribute("disabled")
  });

  if(page.navigator.offset + page.navigator.limit < page.navigator.length) {
    page.navigator.next.value = true
  } else {
    page.navigator.next.element.setAttribute("disabled", "")
    page.navigator.next.value = false
  }

  if(page.navigator.offset !== 0) {
    page.navigator.previous.value = true
  } else {
    page.navigator.previous.element.setAttribute("disabled", "")
    page.navigator.previous.value = false
  }
}

function init() {
  page.navigator.length = Pokemon.length()
  updateNavigator()
  listPokemon()
}

