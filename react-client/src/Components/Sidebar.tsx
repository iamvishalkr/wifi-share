import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useLocation, useNavigate } from "react-router-dom";
import { useMyContext } from "../provider/MyContext";

const Sidebar = () => {
  const { devicesArr } = useMyContext();
  const [originQrCode, setoriginQrCode] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    setoriginQrCode(window.location.href);
  }, []);
  return (
    <nav className="m l scroll max left fill">
      <header style={{ width: "100%" }}>
        <button className="extra transparent">
          <i>wifi</i>{" "}
          <span
            style={{
              fontSize: 24,
              marginLeft: "4px",
            }}
          >
            Wifi Share
          </span>
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div
            className=""
            style={{
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                paddingTop: "8px",
                paddingBottom: "8px",
                maxWidth: "200px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <QRCode
                value={originQrCode}
                height={"80px"}
                style={{ maxHeight: "80px" }}
              />
            </div>
            <div className="primary">Scan to connect</div>
            <div style={{ marginTop: "4px" }}>{originQrCode}</div>
          </div>
        </div>
      </header>
      <button
        className={`${pathname !== "/" && "border"} responsive`}
        style={{ marginBottom: "16px" }}
        onClick={() => {
          navigate("/",{replace:true});
        }}
      >
        <i>chat</i>
        <span>Messages</span>
      </button>
      <button
        className={`${pathname !== "/files" && "border"} responsive`}
        onClick={() => {
          navigate("/files",{replace:true});
        }}
      >
        <i>files</i>
        <span>Files</span>
      </button>

      <div style={{ marginTop: "16px", marginBottom: "8px" }}>
        connected devices:
      </div>
      <div>
        <ul
          className="list border"
          style={{
            maxWidth: "200px",
            backgroundColor: "var(--surface)",
            borderRadius: "8px",
          }}
        >
          {devicesArr.map((m) => (
            <li key={m}>
              {m.startsWith("PC") ? <i>computer</i> : <i>mobile</i>}
              <div className="max" style={{ overflow: "hidden" }}>
                <h6
                  style={{
                    fontSize: "14px",
                    lineClamp: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {m}
                </h6>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
