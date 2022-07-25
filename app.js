const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let vx = 10
let vy = 0

let pommeX = 0
let pommeY = 0

let score = 0

let bugDirection = false

let stopGame = false

let snake = [ {x: 140, y: 150}, {x: 130, y: 150}, {x: 120, y: 150}, {x: 110, y: 150} ]


const direction = (e) => {
    
    if(bugDirection) return
    bugDirection = true

    if(e.key === "ArrowRight" && !(vx === -10)) {vx = 10; vy = 0}
    if(e.key === "ArrowLeft" && !(vx === 10)) {vx = -10; vy = 0}
    if(e.key === "ArrowUp" && !(vy === 10)) {vx = 0; vy = -10}
    if(e.key === "ArrowDown" && !(vy === -10)) {vx = 0; vy = 10}
}
const tableau = []
const directionTactile = e => {

    if(bugDirection) return
    bugDirection = true
    
    let droite = false
    let gauche = false
    let haut = false
    let bas = false
    tableau.push(e.changedTouches[0])
    
    if(tableau[0].clientX < tableau[1].clientX) droite = true
    if(tableau[0].clientX > tableau[1].clientX) gauche = true
    if(tableau[0].clientY > tableau[1].clientY) haut = true
    if(tableau[0].clientY < tableau[1].clientY) bas = true

    if (droite && !(vx === -10)) {vx = 10; vy = 0}
    if (gauche && !(vx === 10)) {vx = -10; vy = 0}
    if (haut && !(vy === 10)) {vx = 0; vy = -10}
    if (bas && !(vy === -10)) {vx = 0; vy = 10}

    tableau.splice(0, tableau.length)
    
}

document.addEventListener('touchmove', directionTactile)

document.addEventListener('keydown', direction)

const draw = () => {
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.height)
    ctx.strokeRect(0, 0, canvas.clientWidth, canvas.height)
}

const dessineMorceau = (morceau) => {
    ctx.fillStyle = '#00fe14'
    ctx.strokeStyle = 'black'
    ctx.fillRect(morceau.x, morceau.y, 10, 10)
    ctx.strokeRect(morceau.x, morceau.y, 10, 10)
}

const dessineSerpent = () => {
    snake.forEach(morceau => {
        dessineMorceau(morceau)
    })
}

const avancerSerpent = () => {
    const head = {x: snake[0].x + vx, y: snake[0].y + vy}
    snake.unshift(head)

    if (finDuJeu()) {
        snake.shift(head)
        recommmencer()
        stopGame = true
        return
    }
    
    const serpentMangePomme = snake[0].x === pommeX && snake[0].y === pommeY

    if(serpentMangePomme) {
        score++
        document.getElementById('score').innerText = score

        creerPomme()
    } 
    else snake.pop()
}

const random = () => {
    return Math.round((Math.random() * 290) / 10) *10
}

const creerPomme = () => {
    pommeX = random()
    pommeY = random()

    snake.forEach((partie) => {
        const serpentPomme = partie.x == pommeX && partie.y == pommeY

        if (serpentPomme) {
            creerPomme()
        }
    })
}

const dessinePomme = () => {
    ctx.fillStyle = 'red'
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.arc(pommeX + 5, pommeY + 5, 5, 0, 2*Math.PI)
    ctx.fill()
    ctx.stroke()
}

const finDuJeu = () => {
    let corpsSnake = snake.slice(1, -1)
    let mordu = false
    corpsSnake.forEach(morceau => {
        if(morceau.x === snake[0].x && morceau.y === snake[0].y) mordu = true
    })

    const sortieMurGauche = snake[0].x < -1
    const sortieMurDroite = snake[0].x > canvas.width - 10
    const sortieMurHaut = snake[0].y < -1
    const sortieMurBas = snake[0].y > canvas.height - 10

    let gameOver = false

    if (mordu || sortieMurGauche || sortieMurDroite || sortieMurHaut || sortieMurBas) {
        gameOver = true
    }

    return gameOver
}

const recommmencer = () => {
    const restart = document.getElementById('recommencer')
    restart.style.display = 'block'
    
    document.addEventListener('keydown', (e) => {
        if(e.key === " ") {
            window.location.reload()
        }
    })
}


const animation = () => {

    if (stopGame === true) return
    setTimeout(() => {
        bugDirection = false
        draw()
        dessinePomme()
        avancerSerpent()
        dessineSerpent()
        
        animation()
    }, 100);
}

animation()
creerPomme()
dessineSerpent()
