import VerificationInput from './components'
import { Switch, Route} from "react-router-dom";
import './App.css';
import Success from './components/Success';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/success" component={Success} />
        <Route exact path="/" component={()=><VerificationInput
          autoFocus
          length={6}
          className="codeContainer"
          inputClassName="codeInput"
          onChangeVerificationCode={() => { }}
        />} />
      </Switch>
    </div>
  );
}

export default App;
