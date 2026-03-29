import './App.css'
import Game from './components/Game.tsx';

function App() {

  return (
    <>
    
    {/* header */}
    <header>
      <h1>Roulette Wheel</h1>
    </header>

    {/* main */}
    <main>
      {/* roulette Game */}
      <Game />
    </main>
    {/* footer */}
    <footer>
      <p>© 2024 Roulette Game. All rights reserved.</p>
    </footer>
        
    </>
  )  
}

export default App
