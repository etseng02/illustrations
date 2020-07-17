import React, { useState } from "react"

const Menu = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("")
  const [selectedSubMenuItem, SetSelectedSubMenuItem] = useState("")

  const handleBackButton = () => {
    if (selectedSubMenuItem) {
      SetSelectedSubMenuItem("")
    } else {
      setSelectedMenuItem("")
    }
  }

  return (
    <>
      <div class="bg-gray-200 m-auto mt-16 w-3/5 lg:w-4/12 p-6 ">
        <button onClick={() => handleBackButton()}>Back</button>
        <div class="flex flex-col space-y-4">
          {selectedMenuItem === "" && (
            <>
              <button onClick={() => setSelectedMenuItem("play")}>Play</button>
              <button>How to Play</button>
              <button>Settings</button>
              <button>About</button>
            </>
          )}

          {selectedMenuItem === "play" && selectedSubMenuItem === "" && (
            <>
              <button id="join-room" onClick={() => {}}>
                Join Room
              </button>
              <button id="create-room" onClick={() => {}}>
                Create Room
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Menu
