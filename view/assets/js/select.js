select.buttons.forEach((button, index) => {
  button.addEventListener('click', () =>{

    if(index === answerSelect){
      remove = index
      add = null
      answerSelect = null
    } else{
      add = index
      remove = answerSelect
      answerSelect = index
    }

    let choice = {
      add,
      remove
    }

    socket.emit('set choice', choice)
  })
})

socket.on('get choice', function (results){
  results.forEach((result, index) => {
    select.counts[index].textContent = result
  })
})
