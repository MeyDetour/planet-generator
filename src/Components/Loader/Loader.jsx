import "./style.css";
export default function Loader({ color }) {
  return (
    <div className="loader">
      <div className="line" style={{ borderColor: color }}>
        <div className="block"></div>
      </div>
    </div>
  );
}
