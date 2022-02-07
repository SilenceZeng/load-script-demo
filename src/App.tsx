import "./styles.css";
import { loadWxScript } from "./utils/wxSdk";

export default function App() {
  const onClick = () => {
    loadWxScript().then((res) => console.log(res));
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button onClick={onClick}>点击</button>
    </div>
  );
}
