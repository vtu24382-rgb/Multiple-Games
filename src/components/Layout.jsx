export default function Layout({ children }) {
  return (
    <div className="container">
      <header className="header">
        <h1>Multi-Game Website</h1>
        <p>Play your favorite games in one place</p>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}