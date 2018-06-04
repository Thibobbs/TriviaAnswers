socket.on('newImage', function (img) {

  requests = 0
  displayTimer()

  image.setAttribute('src', img.file)
  question.textContent = img.infos.originalQuestion

  img.infos.originalAnswers.forEach((text, i) => {
    answers.text[i].textContent = text
  })
})

input.addEventListener('change', function (e) {
  var data = e.target.files[0];
  readThenSendFile(data);
});

function readThenSendFile(data) {
  var reader = new FileReader();
  reader.onload = function (evt) {
    var msg = {};
    msg.file = evt.target.result;
    msg.fileName = data.name;
    socket.emit('screenshot', msg);
  }
  reader.readAsDataURL(data);
}
