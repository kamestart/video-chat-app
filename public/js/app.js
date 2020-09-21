fetch('https://pure-anchorage-70580.herokuapp.com/pkhdbbash52471')
    // fetch is using a 'Rest' api that i made. view the code @
  .then(res => res.json())
  .then(data => console.log(data))

const playbtn = document.getElementById("play-btn")
const pausebtn = document.getElementById("pause-btn")
const stopbtn = document.getElementById("stop-btn")
