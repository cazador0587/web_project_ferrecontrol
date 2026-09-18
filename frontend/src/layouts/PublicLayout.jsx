const PublicLayout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>FerreControl</h1>
      </header>

      <main>{children}</main>

      <footer>
        <p>FerreControl</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
