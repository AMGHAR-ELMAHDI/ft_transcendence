import React from "react";

function NotFound() {
  return (
    <div className="NotFound">
      <h1>404 PAGE NOT FOUND</h1>
          <img src="../../public/homer.gif" alt="homer" />
          <iframe
            // style="border-radius:12px"
            src="https://open.spotify.com/embed/playlist/0oWlGn1tCtTDNAemGaSwQ3?utm_source=generator&theme=0"

            width="90%"
            height="500"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
  );
}

export default NotFound;
