// Import socket
import { appSocket } from '../config'

let allChoices = [0, 0, 0]

function choiceUpdate(choice) {
  if (choice.add !== null) {
    allChoices[choice.add] += 1;
  }

  if (choice.remove !== null) {
    allChoices[choice.remove] -= 1;
  }
  appSocket.emit('get choice', allChoices);
}

export { allChoices, choiceUpdate }
