const socket = io();

let requests = 0
const totalRequests = 4
let initialOffset = 440

const image = document.querySelector('.currentImage')
const input = document.querySelector('.input')
const question = document.querySelector('.question')

const answers = {}
answers.container = document.querySelector('.answers')
answers.answers = answers.container.querySelectorAll('.answer')
answers.text = answers.container.querySelectorAll('.answer__text')
answers.count = answers.container.querySelectorAll('.answer__count')
answers.progress = answers.container.querySelectorAll('.progress__fill')

const select = {}
select.buttons = document.querySelectorAll('.select__button')
select.counts = document.querySelectorAll('.select__count')
let answerSelect = null

const timer = {}
timer.container = document.querySelector('.timer')
timer.circle = timer.container.querySelector('.circle_animation')
timer.time = timer.container.querySelector('h2')
