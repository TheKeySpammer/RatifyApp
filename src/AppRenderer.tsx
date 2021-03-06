import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import store from './redux/index';
import { Provider } from 'react-redux';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

const App = React.lazy(() => import(/* webpackChunkName: "App" */ './App'));

const Main = () => {
  return (
    <React.StrictMode>
      <MantineProvider>
        <ModalsProvider>
          <Provider store={store}>
            <Suspense fallback={<div className="loading" />}>
              <App />
            </Suspense>
          </Provider>
        </ModalsProvider>
      </MantineProvider>
      <ToastContainer />
    </React.StrictMode>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
