const Footer = ({ text = "FerreControl" }) => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__text">{text}</p>
      </div>
    </footer>
  );
};

export default Footer;
