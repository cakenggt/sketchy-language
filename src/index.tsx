import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import { loadCourses } from "./actions";
import App from "./components/App";
import rootReducer from "./reducers";
import { configureStore } from "./utils/store";

const store = configureStore(rootReducer);

loadCourses()(store.dispatch);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
