import './App.css';
import DataComponent from './DataComponent';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <img className="app-logo" src="logo512.png" alt="" aria-hidden="true" />
        <div className="app-header__text">
          <h1 className="app-header__title">Aiuto Medicine</h1>
          <p className="app-header__subtitle">Scorte e promemoria dei farmaci</p>
        </div>
      </header>
      <main className="app-main">
        <DataComponent />
      </main>
    </div>
  );
}

export default App;
