let searchResult = document.getElementById('search-result')
let searchbar = document.getElementById('input-box')
let resultBox = document.getElementById('result-box')
let dataStore = []

var gimme = document.getElementById('input-box')


// CAPITALIZE FIRST LETTER
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

fetchData()


document.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('submit').click();
    }
});

{
    // Hides search results when mouse leaves the search bar and clicks outside
let sequence = 0
let searchBox = document.getElementById('search-box')
searchBox.addEventListener('mouseleave', function() {
    if (sequence === 0) {
        console.log('mouseleave event');
        sequence = 1;
        document.addEventListener('click', function() {
            if (sequence === 1) {
                console.log('click event');
                searchResult.innerHTML = ''
                // Reset the sequence for future events
                sequence = 0;
            }
        })
    }
})
}


function selectInput(name) {
            searchbar.value = name.innerHTML
            searchResult.innerHTML = ''
        }

// FETCHES DATA TO DISPLAY UNDER SEARCHBAR
async function fetchData() {
    try {

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=1302`)
            .then((res) => {
                const data = res.json()
                // RESPONSE IS THE DATA OF ENTIRE API DATABASE
                return data
            }).then((data) => {
                // RESPONSE IS THE ENTIRE LIST OF POKEMON BY NAME (results) from API DATABASE
                // list of pokemon name stored in dataStore (alphabetical order using sort)
                dataStore = data.results.sort((a,b) => a.name.localeCompare(b.name)) 
                
            })

        // FOR EACH PIECE OF DATA RETRIEVED, make its own html line
        function getHTML(data) {
                console.log("getHTML: " + data.name)
                return data.map(({name}) => generateHTML(name)).join('')
            }
        
        // the html line for each piece of data passed
        function generateHTML(name) {
            return `<li onclick=selectInput(this)>${capitalize(name)}</li>`
        }
        
        // to display the filtered names of pokemon under searchbar
        function display(result) {
            // const content = result.map((list) => {
            //     return generateHTML(list)
            // })

            // in #search-result div if paramter length > 0, then write the line for piece of data matching the filter
            searchResult.innerHTML = result.length ? `<ul>${getHTML(result)}</ul>` : `<ul><li id="noMatch">No Matches</li></ul>`
            

        }

        // for each keypressed the displayed names will be filtered based on those keys
        searchbar.addEventListener('keyup', function(e) {
            
            const currentword = e.target.value // gets the keys in input box

            // filtered data returns filtered strings matching some of the input
            const filteredData = dataStore.filter(results => results.name.toLowerCase().includes(currentword.toLowerCase()))

            // console.log(filteredData) // **testing purpose to see changes from key pressing

            display(filteredData) // calls function to display filtered names under search bar
        })


    } catch(error) {
        console.log(error + 'oopsie')
    }
}

async function fetchPokemon() {
    try {
        searchResult.innerHTML = ''

        const pokemon = document.getElementById('input-box').value.toLowerCase()

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
        if (!response.ok) {
            throw new Error('Could not fetch resource, SORRY')
        } else {
            console.log('Successfully Retrieved Pokemon Data')
        }
        
        const data = await response.json()
        console.log(data)
        console.log(data.name)

        var pokemonDataBox = document.getElementById('result-box')

        const pokemon_sprite = data.sprites.front_default
        const pokemon_name = capitalize(data.name)

        let pleaseMap = true

        function mapper(data) {
            return data.map((element) => capitalize(element.type.name)).join(', ')
        }

        pokemonDataBox.innerHTML = `
            <p>Pokémon Name:</p>
            <h1>${pokemon_name}</h1>
            <img src="${pokemon_sprite}">
            <p><b>Type:</b> ${mapper(data.types)}</p>
        `
        resultBox.classList.add('active')

    } catch(error) {
        console.log(error)
    }
}
