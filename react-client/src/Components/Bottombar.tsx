import { useLocation, useNavigate } from "react-router-dom";

const Bottombar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <nav className="s bottom">
      <a
        className={`${pathname === "/" && "primary-text"}`}
        onClick={() => {
          navigate("/");
        }}
      >
        <i>chat</i>
        <span>Messages</span>
      </a>
      <a
        className={`${pathname === "/files" && "primary-text"}`}
        onClick={() => {
          navigate("/files");
        }}
      >
        <i>files</i>
        <span>Files</span>
      </a>
    </nav>
  );
};

export default Bottombar;
