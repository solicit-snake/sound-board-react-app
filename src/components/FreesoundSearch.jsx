import React, { useEffect, useState } from 'react'

function FreeSoundSearch() {
    const[searchQuery, setSearchQuery] = useState('')
    let searchResults = [];
    const[samplesDetails, setSamplesDetails] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('');
    const apiKey = import.meta.env.VITE_FREESOUND_API_KEY
    let searchUrl = `https://freesound.org/apiv2/search/text/?query=` + `${searchQuery}&token=${apiKey}&page_size=8`
    

    //searches the sound library for the query and saves as array

    async function fetchAPISearchQuery(){
      setLoading(true)
      try {
          let res = await fetch(searchUrl)
          let data = await res.json();
          
          //if there are more than 8 samples, do the api call again but with a random page number
          if(data.count > 8){
            let totalNumberOfPossiblePages = Math.floor(data.count / 8)
            let randomPageNumber = Math.floor(Math.random() * (totalNumberOfPossiblePages + 1))

            //makes sure that the number isn't 0
            randomPageNumber = (randomPageNumber === 0) ? 1 : randomPageNumber 
            
            res = await fetch(searchUrl + '&page=' + randomPageNumber)
            data = await res.json();
          }

          searchResults = data.results
          console.log('got serch result:')
          console.log(searchResults)
          await fetchAPIDetailedSampleData();
      } catch (error) {
          setError(error)
          console.log('failed to fetch samples: ' + error)
      } 
    }

    //gets intricate information about each found search result
    async function fetchAPIDetailedSampleData(){
      let tempSamplesInfo = []
      searchResults.map(async (searchResult) => {
        try {
          const res = await fetch(`https://freesound.org/apiv2/sounds/${searchResult.id}/?token=${apiKey}`)
          const data = await res.json()
          tempSamplesInfo.push(data)
          console.log(data)
        } catch (err) {
          
        }
      })
      
    }

  
    const handleSearch = (e) => {
      e.preventDefault()
      console.log('search query log: ' + searchQuery)
      fetchAPISearchQuery()
      
    }

    return (
      <div>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search for samples..."
          />
          <button type ="submit"> Search </button>
        </form>
      </div>
    )
  }

export default FreeSoundSearch
