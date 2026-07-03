import { useEffect, useState } from "react";

const Appbar = () => {
  const [originQrCode, setoriginQrCode] = useState("");
  useEffect(() => {
    setoriginQrCode(window.location.href);
  }, []);

  function copyTextToClipboard() {
    // navigator.clipboard wont work as it need srcure context so legacy method:
    // Create a temporary hidden textarea element
    const textArea = document.createElement("textarea");
    textArea.value = originQrCode;

    // Avoid scrolling to bottom on mobile
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy"); // Legacy fallback
      if (successful) {
        alert("Copying successful");
      } else {
        alert("Copying failed");
      }
    } catch (err) {
      alert("Oops, unable to copy");
    }

    document.body.removeChild(textArea);
  }
  return (
    <header className="fill">
      <nav>
        <button className="circle transparent s">
          <i>wifi</i>
        </button>
        <h6 className="max s">Wifi share</h6>
        <div className="max m l"></div>
        <button className="m l">
          <i>computer</i>
          <span>{originQrCode}</span>
        </button>

        <div className="s">
          <button className="circle transparent">
            <i>menu</i>
          </button>
          <menu className="left group no-wrap">
            <li>
              <div>
                {/* card goes here */}
                <article>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* <img className="circle large" src="/beer-and-woman.svg"> */}
                    <i>qr_code</i>
                    <div className="max">
                      <div>{originQrCode}</div>
                    </div>
                  </div>
                  <nav>
                    <button
                      className="responsive"
                      onClick={copyTextToClipboard}
                    >
                      Copy url
                    </button>
                  </nav>
                </article>
                {/* card ends here */}
              </div>
            </li>
          </menu>
        </div>
        {/* <button className="circle transparent">
          <i>menu</i>
        </button> */}
      </nav>
    </header>
  );
};

export default Appbar;
