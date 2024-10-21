import React, { useEffect, useState } from 'react'
import SampleBlock from './SampleBlock';

function FreeSoundSearch() {
    const[searchQuery, setSearchQuery] = useState('')
    let searchResults = []
    const [samplesDetails, setSamplesDetails] = useState([])
    const [loading, setLoading] = useState(true)
    const [clickedSearchAtLeastOnce, setClickedSearchAtLeastOnce] = useState(false);
    const [error, setError] = useState('')
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
      let tempSamplesInfo = [];

      // Create an array of promises for all the API calls
      const searchPromise = searchResults.map(async (searchResult) => {
        try {
          const res = await fetch(`https://freesound.org/apiv2/sounds/${searchResult.id}/?token=${apiKey}`);
          const data = await res.json();
          return data; // return the fetched data from each API call
        } catch (err) {
          console.error('Error fetching detailed sample data:', err);
          return null; // Return null if there's an error
        }
      });

      // Wait for all promises to resolve
      tempSamplesInfo = await Promise.all(searchPromise);

      // Filter out any null values if any API calls failed
      const validSamples = tempSamplesInfo.filter(sample => sample !== null);

      // Update state once all API calls are done
      setSamplesDetails(validSamples);
      setLoading(false);

      console.log('Fetched detailed sample data:', validSamples);
      
    }

  
    const handleSearch = (e) => {
      setLoading(true)
      setClickedSearchAtLeastOnce(true);
      e.preventDefault()
      console.log('search query log: ' + searchQuery)
      fetchAPISearchQuery()
    }

    return (
      <div>
        <form onSubmit={handleSearch} className='search-form'>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search for audio samples..."
          />
          <button type ="submit"> Search </button>
        </form>

        <div className="sampleBlockContainer">
          {!clickedSearchAtLeastOnce ? <i className="fa-solid fa-compact-disc kyles-loader"></i> : <></>}
          {loading  && clickedSearchAtLeastOnce ? <i className="fa-solid fa-compact-disc kyles-spinner"></i> : samplesDetails.map(sample => (
            <SampleBlock 
              key={sample.id} 
              sampleData={sample}
            />

            )
          )}
        </div>
        
        {error && <p>Some sorta error fam: {error}</p> }

        {}
        <div></div>
      </div>
    )
  }

export default FreeSoundSearch
