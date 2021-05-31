
class Pokemon {

  constructor(id, name, sprite, stats, details) {
    this.id = id
    this.name = name
    this.sprite = sprite
    this.stats = stats
    this.details = details
  }

  static idFormatter(id) {
    return ("0000" + id).slice(-4)
  }

  static url() {
    return "https://pokeapi.co/api/v2"
  }

  static list(offset = 0, limit = 20) {
    return fetch(`${this.url()}/pokemon?offset=${offset}&limit=${limit}`, { method: 'get' })
      .then(res => res.json())
      .then(pokemons => {
        return pokemons.results.map( (pokemon, id) => {
          return {
            name: pokemon.name,
            id: id + 1
          }
        })
      })
  }

  static search(id) {
    if(id > 0) {
      return fetch(`${this.url()}/pokemon/${id}`, { method: 'get' })
        .then(res => res.json())
        .then(pokemon => {
          return new Pokemon(
            pokemon.id,
            pokemon.name,
            pokemon.sprites.other["official-artwork"].front_default,
            pokemon.stats.map(e => {
              return {
                baseStat: e.base_stat,
                name: e.stat.name,
                effort: e.effort
              }
            }),
            {
              height: pokemon.height,
              weight: pokemon.weight,
              types: pokemon.types,
              abilities: pokemon.abilities
            }
          )
        })
    } 
  }

  static length() {
    return 898
  }
}