import "../css/NotFound.css";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="ContainerContainer">
      <div className="NotFoundContainer">
        <div className="NotFound">
          <h1>404 PAGE NOT FOUND</h1>
          <Link to={"/"}>
            <h1 id="GoHome">Home</h1>
          </Link>
        </div>
        <img className="HomerGif" src="/homer.gif" alt="homer" />
        <div className="Spotify">
          <iframe
            src="https://open.spotify.com/embed/playlist/0oWlGn1tCtTDNAemGaSwQ3?utm_source=generator&theme=0"
            width="100%"
            height="400"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
