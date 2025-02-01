var mode_show = document.querySelector("#mode")
var selection_btns = document.querySelector(".selection-btns")
var one_vs_one_btn = document.querySelector("#one-vs-one")
var one_vs_pc_btn = document.querySelector("#one-vs-pc")
var board = document.querySelector(".board")
var cells = document.querySelectorAll(".cell")
var status_text = document.querySelector("#status")
var restart_btn = document.querySelector("#restart")
var reset_btn = document.querySelector("#reset")

var vs_pc = false
var is_game_active = false
var current_player = "O"
var board_state = ["", "", "", "", "", "", "", "", ""]

// Winning Patterns:
// 0  1  2
// 3  4  5
// 6  7  8

var winning_patterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

// Adding Event listners
cells.forEach((cell) => cell.addEventListener("click", handleCellClick))
restart_btn.addEventListener("click", () => { if (!is_game_active) { startGame(vs_pc) } })
reset_btn.addEventListener("click", () => startGame(vs_pc))
one_vs_one_btn.addEventListener("click", () => startGame(false));
one_vs_pc_btn.addEventListener("click", () => startGame(true));


// Start Game Function
function startGame(vsComputer) {
    is_game_active = true
    vs_pc = vsComputer
    board_state.fill("")
    cells.forEach((cell) => {
        cell.textContent = ""
        cell.classList.remove("taken")
        cell.classList.remove("winner")
    });
    current_player = "O"
    status_text.textContent = `${current_player}'s turn`
    if (vs_pc) {
        mode_show.textContent = "Single Player Mode!"
    }
    else {
        mode_show.textContent = "Two Players Mode!"
    }

}


// Click Handling Function
function handleCellClick(event) {
    var cell = event.target
    var index = cell.dataset.index

    if (board_state[index] || !is_game_active) return

    board_state[index] = current_player
    cell.textContent = current_player
    cell.classList.add("taken")

    if (checkWin()) {
        status_text.textContent = `${current_player} wins!`
        is_game_active = false
    }
    else if (board_state.every((cell) => cell)) {
        status_text.textContent = "It's a draw!"
        is_game_active = false
    }
    else {
        switchPlayer()

        if (vs_pc && current_player === "X") {
            setTimeout(pcMove, 500)
        }
    }
}

// Player Switching Function
function switchPlayer() {
    current_player = current_player === "O" ? "X" : "O"
    status_text.textContent = `${current_player}'s turn`
}

// AI move Function
function pcMove() {
    var empty_cells = board_state
        .map((value, index) => value === "" ? index : null) // Get indices of empty cells
        .filter(index => index !== null); // Filter out the null values


    var random_index = empty_cells[Math.floor(Math.random() * empty_cells.length)]

    board_state[random_index] = current_player
    cells[random_index].textContent = current_player
    cells[random_index].classList.add("taken")

    if (checkWin()) {
        status_text.textContent = `${current_player} wins!`
        is_game_active = false
    }
    else if (board_state.every((cell) => cell)) {
        status_text.textContent = "It's a draw!"
    }
    else {
        switchPlayer()
    }
}


// Winning Check Function
function checkWin() {
    return winning_patterns.some((pattern) => {
        if (pattern.every((index) => board_state[index] === current_player)) {
            highlightWinningCells(pattern)
            return true
        }
        return false
    })
}

// Winner Indication Function
function highlightWinningCells(winning_patterns) {
    winning_patterns.forEach((index) => {
        cells[index].classList.add("winner")
    })
}