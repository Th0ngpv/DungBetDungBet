import './App.css'
import Game from './components/Game.tsx';
import logo from './assets/images/colorlogo.png';
import avatar from './assets/images/avatar.png';

function App() {

  return (
    <body>
        {/* header */}
      <header>
        <img src={logo} alt="Ngừng Bet Dừng Bết Logo" />
      </header>

      {/* main */}
      <main>
        {/* roulette Game */}
        <Game />
      </main>
      {/* footer */}
      <footer>
        <p>© 2026 Ngưng Bet Dừng Bết.</p>
      </footer>
      <a
          href="https://www.facebook.com/profile.php?id=61588305654233"
          target="_blank"
          rel="noopener noreferrer"
          className="fb-avatar"
        >
          <img src={avatar} alt="Facebook" />
        </a>
    </body>
  )  
}

export default App
