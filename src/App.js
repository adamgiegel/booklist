import './App.css';
import React, { useState, useEffect } from 'react'

function App() {
  const [inputValue, setInputValue] = React.useState('')
  const [data, setData] = React.useState([])
  const [limit, setLimit] = React.useState(5)
  const [currentNum, setCurrentNum] = React.useState(0)
  const [pageNums, setPageNums] = useState()
  const [message, setMessage] = useState('')

  const getData = (e, term) => {
    setMessage("Loading...")
    e.preventDefault()
    const apiUrl = `https://goodreads-server-express--dotdash.repl.co/search/${term}`;
    fetch(apiUrl)
      .then(res => {
        if (res.status >= 400) {
          setData([])
        } else {
          return res.json()
        }
      })
      .then(data => {
        if (data?.list) {
          setData(data.list)
          setMessage('')
        } else {
          setMessage("Your search returned no results.  Try another one.")
        }
      })
    setInputValue('')
  }

  const handleChange = (e) => {
    setInputValue(e.target.value)
  }

  const onNextClick = () => {
    if (data.length > limit) {
      setLimit(limit + 5)
      setCurrentNum(currentNum + 5)
    }
  }

  const onPreviousClick = () => {
    if (currentNum >= 5) {
      setLimit(limit - 5)
      setCurrentNum(currentNum - 5)
    }
  }

  const onFirstClick = () => {
    setCurrentNum(0)
    setLimit(5)
  }

  const onLastClick = () => {
    let page = data.length / 5
    let pageNum = Math.ceil(page)
    setLimit(pageNum * 5)
    let current = limit - 5
    setCurrentNum(current)
  }

  useEffect(() => {
    setCurrentNum(limit - 5)
  }, [limit])



  useEffect(() => {
    let pageData = data?.length
    if (pageData >= 1) {
      let numberOfPages = Math.ceil(pageData / 5)
      let pageArray = []
      for (let i = 1; i <= numberOfPages; i++) {
        pageArray.push(i)
      }
      setPageNums(pageArray)
    }
  }, [data])

  const goToPage = (e) => {
    const input = e.target.innerText;
    let pages = input * 5
    setLimit(pages)
    let current = pages - 5
    setCurrentNum(current)
  }

  return (
    <div className="searchBox">
      <form onSubmit={(e) => getData(e, inputValue)}>
        <input type="text" onChange={handleChange} value={inputValue}></input>
        <button className="buttons" type='submit'>Search</button>
      </form>
      <div>
        {data?.length >= 1 ?
          //Would typically use id for the key here
          data?.slice(currentNum, limit).map(dataObj => {
            return (
              <div className='dataDiv' >
                <div className='dataObjects'>{dataObj.title}</div>
                <div className='dataObjects'>{dataObj.authorName}</div>
              </div>)
          })
          : <div className="message">{message}</div>
        }
        {data?.length > 5 ?
          <div>
            <button className="buttons" onClick={onFirstClick}>First</button>
            <button className="buttons" onClick={onNextClick}>Next</button>
            {
              pageNums?.map(pages => {
                return (
                  <button className="pageButton" onClick={goToPage}>{pages}</button>)
              })
            }
            <button className="buttons" onClick={onPreviousClick}>Previous</button>
            <button className="buttons" onClick={onLastClick}>Last</button>
          </div>
          : <></>}
      </div>
    </div>
  )
}

export default App;
