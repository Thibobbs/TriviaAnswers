socket.on('results', data => {
  let results = data.results
  console.log(results)
  requests++

  displayTimer()

  let max = indexOfMax(results)
  displayResults(results, max, requests)
})

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

function displayResults(results, max, requests) {
  results.forEach((result, i) => {
    answers.progress[i].style.width = `calc(${result}% + 70px)`
    answers.count[i].innerHTML = `${Math.round(result)}%`
    if(max === i && requests === totalRequests) {
      answers.answers[max].className += ' best'
    }
    else {
      answers.answers[i].classList.remove('best')
    }
  })
}

function displayTimer() {
  timer.circle.style.strokeDashoffset = initialOffset - (requests * (initialOffset / totalRequests))
  timer.time.innerHTML = requests
}
