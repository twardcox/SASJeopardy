import React, { useState, useEffect } from 'react';
import  {Box, makeStyles, Typography, Grid} from '@material-ui/core';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import axios from 'axios'

// Set url for initial fetch
const _URL = encodeURI(`http://www.jservice.io/api/clues?category=25`);

const useStyle = makeStyles((theme) =>({
  paper: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '50px'
  },
  title: {
    fontFamily: 'anonymous',
    padding: '15px'
  },
  header: {
    fontFamily: 'fantasy',
    fontSize: '2em',
    border: '15px solid black',
    width: '205px',
    height: '100px',
    lineHeight: '100px',

  },
  cardFront: {
    
    border: '15px solid black',
    width: '235px',
    height: '130px',
    lineHeight: '130px',
    padding: '0px',
    '& .MuiTypography-h2': {
      lineHeight: '1.6',
      fontFamily: 'fantasy',
    }
  },
  cardBack: {
    border: '15px solid black',
    width: '235px',
    height: '130px',
    lineHeight: '130px',
    padding: '0px',
    '& .MuiTypography-h2': {
      lineHeight: '1.6',
      // fontFamily: 'fantasy',
      fontSize: '1em'
    }
  },
  
}))

const getContent = async () => {
  try {

    // fetching all clues from the science category
    const response = await axios.get(_URL);

    // filter by date
    const startDate = new Date('01-01-1996').valueOf()
    const endDate = new Date('12-31-1996').valueOf()

    const filterByDate = dateFilteredData(response, startDate, endDate)
    const filterOutNull = nullFilteredData(filterByDate)
    const randomizeArray = shuffle(filterOutNull)
    const finalClues = valueFilter(randomizeArray)
    sortByValue(finalClues)
    return finalClues;
  } catch (e) {
    console.log('error in fetching clues: ', e);
  }
}

// Filters clues by date
const dateFilteredData = (response, min_date, max_date) => {
const fileterData = response.data.filter((clue) => {
  const airedDate = new Date(clue.airdate);
  return airedDate >= min_date && airedDate <= max_date;
  })
  return fileterData;
}

// Filters out null values
const nullFilteredData = (array) => {
const fileterData = array.filter((clue) => clue.value !== null);
  return fileterData;
}

// randomize array with a Fisher-Yates shuffle
// https://javascript.info/task/shuffle
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// populate clue list with 5 questions of different values
const valueFilter = (array) => {
  const valuesChecked = {};
  const clueList = [];

  for ( let i = 0; i < array.length; i++){
    if (clueList.length === 5) {
      return clueList;
    }
    if (valuesChecked[array[i].value]){
      continue;
    } 
    if (!valuesChecked[array[i].value]){
      valuesChecked[array[i].value] = true;
      clueList.push(array[i])
      continue;
    }
  }
  return clueList;
}

// sort clues array by value
const sortByValue = (array) => {
  array.sort((a, b) => {
    return a.value - b.value;
  })
}

const App = () => {
  const [clues, setClues] = useState(null);
  const classes = useStyle();
  
  useEffect(() => {
    let aborted = false;
    
    getContent().then((content) => {
      if (!aborted) {
        setClues(content);
      }    
    },
    (e) => {
      if (!aborted) {
        console.error('Error in load: ', e);
      }
    });
    return () => aborted = true;
    
  }, []);
  
  console.log('clues: ', clues);
  
  

  return (
    <Box className={classes.paper} component='div'>

      <Typography className={classes.title} align='center' variant='h1'>JEOPARDY</Typography>

      {clues && (

        <Grid align='center' container spacing={2} direction='column'>

          <Grid style={{margin: '0px auto', boxSizing: 'border-box'}}>
            <Typography className={classes.header} align='center' dispaly='block' >SCIENCE</Typography>
          </Grid>

          {clues.map((clue, i) =>(

            <Flippy
            key={i}
            flipOnClick={true}
            flipDireciton='horizontal'
            style={{margin: 'auto'}}
            
            >
              <FrontSide className={classes.cardFront}>
              <Typography  variant='h2'> {`$${clue.value}`}</Typography>
              </FrontSide>

              <BackSide  className={classes.cardBack} >
              <Typography variant='h2'> {`${clue.question}`}</Typography>
              </BackSide>

            </Flippy>

            )
          )}
    
          </Grid>)}
    </Box>
  );
}

export default App;
