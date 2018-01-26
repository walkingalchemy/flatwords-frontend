class App {
  static init(){
    App.navBar = document.getElementById("nav-bar")
    App.mainContent = document.getElementById("main-content")
    App.board = document.querySelector(".board")
    App.hints = document.getElementById("hints")
    App.info = document.getElementById("info")
    App.colors = ["#FBBC05","EA4335","#34A853","#4285F4"]
    App.renderLoginInfo()
  }

  static async handleBoardChoice(event){
    let boardUrl = event.target.selectedOptions[0].value
    let boardJSON = await fetch(boardUrl).then(r => r.json())
    App.currentBoard = new Board(event.target.selectedOptions[0].id, boardJSON)

    if (event.target.id === "non-user-boards"){
      App.createBoardUser()
      App.userBoards.append(event.target.selectedOptions[0])
    } else {
      App.getUserProgress()
    }
  }

  static async renderBoardOptions(){
    let boards = await fetch("http://localhost:3000/api/v1/boards").then(r => r.json())
    for (let apiBoard of boards) {
      let option = document.createElement("option")
      option.value = apiBoard.board_url
      option.innerText = apiBoard.title
      App.chooseBoard.append(option)
    }
  }

  static resetBoard(){
    App.board.innerHTML = ''
    App.board.addEventListener('mouseover', App.boardHoverHandler)
    App.board.addEventListener('mouseout', App.boardHoverHandler)
    App.board.addEventListener("focusin", App.boardFocusHandler)
    App.board.addEventListener("focusout", App.boardFocusHandler)
    App.board.addEventListener('keyup', App.handleKeyInput)
    App.board.addEventListener('keydown', App.handleKeyDown)
    App.hints.innerHTML = "<dl id='across'> <dt>Across</dt> </dl> <dl id='down'> <dt>Down</dt> </dl>"
    App.hints.addEventListener('mouseover', App.hintHoverHandler)
    App.hints.addEventListener('mouseout', App.hintHoverHandler)
    App.info.innerHTML = ''
  }

  static hintHoverHandler(event) {
  	if ((event.target.tagName.toLowerCase() === 'dd') && (event.type === 'mouseover')){
      if (event.target.parentNode.id === 'down'){
        event.target.style.background = App.colors[2]
        document.querySelectorAll(`[data-down='${event.target.id.split('-')[1]}']`).forEach(function(cell){ cell.style.background = App.colors[2] })
      }
      if (event.target.parentNode.id === 'across'){
        event.target.style.background = App.colors[0]
        document.querySelectorAll(`[data-across='${event.target.id.split('-')[1]}']`).forEach(function(cell){ cell.style.background = App.colors[0] })
      }
    }
    if ((event.target.tagName.toLowerCase() === 'dd') && (event.type === 'mouseout')){
      event.target.style.background = ''
      if (event.target.parentNode.id === 'down'){
        document.querySelectorAll(`[data-down='${event.target.id.split('-')[1]}']`).forEach(function(cell){ cell.style.background = '' })
      }
      if (event.target.parentNode.id === 'across'){
        document.querySelectorAll(`[data-across='${event.target.id.split('-')[1]}']`).forEach(function(cell){ cell.style.background = '' })
      }
    }
  }


  static boardHoverHandler(event) {
    if ((event.target.tagName.toLowerCase() === 'input') && (event.type === 'mouseover')){

      if (event.target.dataset.across){
        document.querySelectorAll(`[data-across='${event.target.dataset.across}']`).forEach(function(cell){ cell.style.background = App.colors[0] })
        document.querySelectorAll(`[data-down='${event.target.dataset.down}']`).forEach(function(cell){ cell.style.background = App.colors[2] })
        document.querySelectorAll(`#across-${event.target.dataset.across}`).forEach(function(dd){dd.style.background = App.colors[0]})
      }
      if (event.target.dataset.down) {
        document.querySelectorAll(`[data-across='${event.target.dataset.across}']`).forEach(function(cell){ cell.style.background = App.colors[0] })
        document.querySelectorAll(`[data-down='${event.target.dataset.down}']`).forEach(function(cell){ cell.style.background = App.colors[2] })
        document.querySelectorAll(`#down-${event.target.dataset.down}`).forEach(function(dd){dd.style.background = App.colors[2]})
      }
      event.target.style.background = App.colors[3]

    }
    if ((event.target.tagName.toLowerCase() === 'input') && (event.type === 'mouseout')){
      event.target.style.background = ''
      if (event.target.dataset.across){
        document.querySelectorAll(`[data-across='${event.target.dataset.across}']`).forEach(function(cell){ cell.style.background = '' })
        document.querySelectorAll(`[data-down='${event.target.dataset.down}']`).forEach(function(cell){ cell.style.background = '' })
        document.querySelectorAll(`#across-${event.target.dataset.across}`).forEach(function(dd){dd.style.background = ''})
      }
      if (event.target.dataset.down) {
        document.querySelectorAll(`[data-across='${event.target.dataset.across}']`).forEach(function(cell){ cell.style.background = '' })
        document.querySelectorAll(`[data-down='${event.target.dataset.down}']`).forEach(function(cell){ cell.style.background = '' })
        document.querySelectorAll(`#down-${event.target.dataset.down}`).forEach(function(dd){dd.style.background = ''})
      }
    }
  }

  static boardFocusHandler(event) {
    if ((event.target.tagName.toLowerCase() === 'input') && (event.type === 'focusin')){
      if (event.target.dataset.across){
        document.querySelectorAll(`[data-across='${event.target.dataset.across}']`).forEach(function(cell){ cell.style.background = App.colors[0] })
        document.querySelectorAll(`[data-down='${event.target.dataset.down}']`).forEach(function(cell){ cell.style.background = App.colors[2] })
        document.querySelectorAll(`#across-${event.target.dataset.across}`).forEach(function(dd){dd.style.background = App.colors[0]})
      }
      if (event.target.dataset.down) {
        document.querySelectorAll(`[data-across='${event.target.dataset.across}']`).forEach(function(cell){ cell.style.background = App.colors[0] })
        document.querySelectorAll(`[data-down='${event.target.dataset.down}']`).forEach(function(cell){ cell.style.background = App.colors[2] })
        document.querySelectorAll(`#down-${event.target.dataset.down}`).forEach(function(dd){dd.style.background = App.colors[2]})
      }
      event.target.style.background = App.colors[3]

    }
    if ((event.target.tagName.toLowerCase() === 'input') && (event.type === 'focusout')){
      event.target.style.background = ''
      if (event.target.dataset.across){
        document.querySelectorAll(`[data-across='${event.target.dataset.across}']`).forEach(function(cell){ cell.style.background = '' })
        document.querySelectorAll(`[data-down='${event.target.dataset.down}']`).forEach(function(cell){ cell.style.background = '' })
        document.querySelectorAll(`#across-${event.target.dataset.across}`).forEach(function(dd){dd.style.background = ''})
      }
      if (event.target.dataset.down) {
        document.querySelectorAll(`[data-across='${event.target.dataset.across}']`).forEach(function(cell){ cell.style.background = '' })
        document.querySelectorAll(`[data-down='${event.target.dataset.down}']`).forEach(function(cell){ cell.style.background = '' })
        document.querySelectorAll(`#down-${event.target.dataset.down}`).forEach(function(dd){dd.style.background = ''})
      }
    }
  }

  static renderLoginForm(event){
    event.preventDefault();
    let loginForm = document.createElement("form");
    loginForm.id = "login-form"

    let usernameLabel = document.createElement("label")
    usernameLabel.htmlFor = "username"
    usernameLabel.innerText = "Username:"

    App.username = document.createElement("input");
    App.username.type = "text";
    App.username.id = "username";

    let submit = document.createElement("input")
    submit.type = "submit"
    submit.value = "Login"
    loginForm.append(usernameLabel)
    loginForm.append(App.username)
    loginForm.append(submit)

    App.navBar.removeChild(App.initiateUser)
    App.navBar.append(loginForm)

    loginForm.addEventListener("submit", App.fetchUser)
  }

  static renderCreateAccountForm(event){
    event.preventDefault();
    let createAccountForm = document.createElement("form");
    createAccountForm.id = "create-account-form"

    let usernameLabel = document.createElement("label")
    usernameLabel.htmlFor = "username"
    usernameLabel.innerText = "Username:"

    App.username = document.createElement("input");
    App.username.type = "text";
    App.username.id = "username";

    let submit = document.createElement("input")
    submit.type = "submit"
    submit.value = "Create Account"
    createAccountForm.append(usernameLabel)
    createAccountForm.append(App.username)
    createAccountForm.append(submit)

    App.navBar.removeChild(App.initiateUser)
    App.navBar.append(createAccountForm)

    createAccountForm.addEventListener("submit", App.createUser)
  }

  static async createUser(event){
    event.preventDefault()
    if (App.username.value.match(/\W/)){
      alert("Username cannot contain non-letter characters.")
    } else {
      let userJSON = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        body: JSON.stringify({name: App.username.value})
      }).then(r => r.json())
      if (userJSON["errors"]){
        alert(userJSON["errors"][0])
      } else {
        App.user = new User(userJSON)
        App.renderUserInfo()
      }
    }
  }

  static async fetchUser(event){
    event.preventDefault()
    if (App.username.value.match(/\W/)){
      alert("Username cannot contain non-letter characters.")
    } else {
      let userJSON = await fetch(`http://localhost:3000/api/v1/users/${App.username.value}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
      }).then(r => r.json())
      if (userJSON["errors"]){
        alert(userJSON["errors"][0])
      } else {
        App.user = new User(userJSON)
        App.renderUserInfo()
      }
    }
  }

  static renderUserInfo(){
    App.navBar.removeChild(App.navBar.lastChild)
    App.renderUserDropdowns()
    App.welcomeMessage = document.createElement("p")
    App.welcomeMessage.innerText = `Welcome, ${App.user.name}!  `

    let logout = document.createElement("button")
    logout.id = "logout"
    logout.innerText= "Logout"
    logout.addEventListener("click", App.logoutUser)
    App.welcomeMessage.append(logout)
    App.navBar.append(App.welcomeMessage)
  }

  static async renderUserDropdowns(){
      let user = await fetch(`http://localhost:3000/api/v1/users/${App.user.name}`).then(r => r.json())
      App.nonUserBoards = document.createElement("select")
      App.nonUserBoards.id = "non-user-boards"
      App.nonUserBoards.prompt = "true"
      App.navBar.prepend(App.nonUserBoards)
      App.nonUserBoards.innerHTML = `<option value='' disabled selected hidden>New Boards</option>`


      App.userBoards = document.createElement("select")
      App.userBoards.id = "user-boards"
      App.userBoards.prompt = "true"
      App.navBar.prepend(App.userBoards)
      App.userBoards.innerHTML = `<option value='' disabled selected hidden>${App.user.name}'s Boards</option>`
      if (user["user_boards"]){
        for (let apiBoard of user["user_boards"]) {
          let option = document.createElement("option")
          option.value = apiBoard.board_url
          option.innerText = apiBoard.title
          option.id = apiBoard.id
          App.userBoards.append(option)
        }
      }

      if (user["non_user_boards"]){
        for (let apiBoard of user["non_user_boards"]) {
          let option = document.createElement("option")
          option.value = apiBoard.board_url
          option.innerText = apiBoard.title
          option.id = apiBoard.id
          App.nonUserBoards.append(option)
        }
      }

      App.userBoards.addEventListener("change", App.handleBoardChoice)
      App.nonUserBoards.addEventListener("change", App.handleBoardChoice)
  }

  static logoutUser(event){
    App.user = undefined;
    App.navBar.innerHTML = ""
    App.renderLoginInfo()
    App.resetBoard()

  }

  static renderLoginInfo(){
    App.initiateUser = document.createElement("p")
    App.initiateUser.id = "initiate-user"
    App.innerText = 'Track your progress: '

    App.loginButton = document.createElement("button")
    App.loginButton.id = "login"
    App.loginButton.innerText = "Login"

    App.createAccountButton = document.createElement("button")
    App.createAccountButton.id = "create-account"
    App.createAccountButton.innerText = "Create Account"

    App.initiateUser.append(App.loginButton)
    App.initiateUser.append(App.createAccountButton)

    App.navBar.append(App.initiateUser)


    App.loginButton.addEventListener("click", App.renderLoginForm)
    App.createAccountButton.addEventListener("click", App.renderCreateAccountForm)

    App.userInfo = document.getElementById("user-info")

  }

  static checkCompletion(){
    if (!Array.from(App.board.querySelectorAll("input")).some(el => el.value === "")){
      // console.log("complete")
      if (App.checkValid()){
        // valid board
        App.onSuccess()
      } else {
        // not valid board
        App.onFail()
                // console.log("not valid")
      }
    }


  }

  static renderBoardSelector(){
    App.chooseBoard = document.createElement("select")
    App.chooseBoard.prompt = "true"
    App.navBar.append(App.chooseBoard)
    App.chooseBoard.innerHTML = `<option value='' disabled selected hidden>Please choose...</option>`
    App.renderBoardOptions()
  }


  static checkValid(){
    let inputArr = Array.from(App.board.querySelectorAll("input")).map(input => input.value.toUpperCase())
    let actualArr = App.currentBoard.grid.filter(cell => cell !== ".")
    return (inputArr.join() === actualArr.join())
  }

  static onFail(){
    alert("While you are super good at filling in squares, it appears that some of them are wrong. Keep trying!")
  }

  static async onSuccess(){
    alert("Victory!!!!!")
    fetch(`http://localhost:3000/api/v1/board_users/${App.user.id}/${App.currentBoard.id}`,{
      method: "PATCH",
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      body: JSON.stringify({"user_id": App.user.id, "board_id": App.currentBoard.id, "completed": true})
    })

  }

  static async createBoardUser(){
    let response = await fetch(`http://localhost:3000/api/v1/board_users/`,{
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      body: JSON.stringify({"user_id": App.user.id, "board_id": App.currentBoard.id})
    }).then(r => r.json())
    if (response['errors']){
      console.log(response['errors'][0])
    }
  }

  static handleKeyInput(event){
      App.checkCompletion()
      App.updateUserProgress(event)
  }

  static handleKeyDown(event){
    if (event.key === "ArrowLeft"){
      App.focusOnPreviousInputInRow(event)
    } else if (event.key === "ArrowRight"){
      App.focusOnNextInputInRow(event)
    } else if (event.key === "ArrowUp"){
      App.focusOnPreviousInputInColumn(event)
    } else if (event.key === "ArrowDown"){
      App.focusOnNextInputInColumn(event)
    }
  }

  static focusOnNextInputInRow(event){
    let coordinates = event.target.id.split("item")[1].split("-")// ["3","2"]
    let row = parseInt(coordinates[0])
    let column = parseInt(coordinates[1])
    let newColumn;
    (column + 1 === App.currentBoard.width) ? newColumn = 0 : newColumn = column + 1;
    let nextElement = document.getElementById(`item${row}-${newColumn}`)
    while (nextElement.tagName === "SPAN"){
      (newColumn + 1 === App.currentBoard.width) ? newColumn = 0 : newColumn = newColumn + 1;
      nextElement = document.getElementById(`item${row}-${newColumn}`)
    }
    nextElement.focus()
  }

  static focusOnPreviousInputInRow(event){
    let coordinates = event.target.id.split("item")[1].split("-")// ["3","2"]
    let row = parseInt(coordinates[0])
    let column = parseInt(coordinates[1])
    let newColumn;
    (column === 0) ? newColumn = App.currentBoard.width-1 : newColumn = column - 1;
    let previousElement = document.getElementById(`item${row}-${newColumn}`)
    while (previousElement.tagName === "SPAN"){
      (newColumn === 0) ? newColumn = App.currentBoard.width-1 : newColumn = newColumn - 1;
      previousElement = document.getElementById(`item${row}-${newColumn}`)
    }
    previousElement.focus()
  }

  static focusOnNextInputInColumn(event){
    let coordinates = event.target.id.split("item")[1].split("-")// ["3","2"]
    let row = parseInt(coordinates[0])
    let column = parseInt(coordinates[1])
    let newRow;
    (row + 1 === App.currentBoard.height) ? newRow = 0 : newRow = row + 1;
    let nextElement = document.getElementById(`item${newRow}-${column}`)
    while (nextElement.tagName === "SPAN"){
      (newRow + 1 === App.currentBoard.height) ? newRow = 0 : newRow = newRow + 1;
      nextElement = document.getElementById(`item${newRow}-${column}`)
    }
    nextElement.focus()
  }

  static focusOnPreviousInputInColumn(event){
    let coordinates = event.target.id.split("item")[1].split("-")// ["3","2"]
    let row = parseInt(coordinates[0])
    let column = parseInt(coordinates[1])
    let newRow;
    (row === 0) ? newRow = App.currentBoard.height-1 : newRow = row - 1;
    let previousElement = document.getElementById(`item${newRow}-${column}`)
    while (previousElement.tagName === "SPAN"){
      (newRow === 0) ? newRow = App.currentBoard.height-1 : newRow = newRow - 1;
      previousElement = document.getElementById(`item${newRow}-${column}`)
    }
    previousElement.focus()
  }

  static async updateUserProgress(event){
    let response = await fetch(`http://localhost:3000/api/v1/board_users/progress/${App.user.id}/${App.currentBoard.id}`,{
      method: "PATCH",
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      body: JSON.stringify({"user_id": App.user.id, "board_id": App.currentBoard.id, "index": event.target.dataset.index, "value": event.target.value})
    }).then(r => r.json())
    if (response['errors']){
      console.log(response['errors'][0])
    }
  }

  static async getUserProgress(){
    let response = await fetch(`http://localhost:3000/api/v1/board_users/${App.user.id}/${App.currentBoard.id}`)
      .then(r => r.json())
    for (let index in response["board_user"]["progress"]){
      App.board.children[index].value = response["board_user"]["progress"][index]
    }
  }




}
