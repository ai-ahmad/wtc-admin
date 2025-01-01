import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../src/components/PrivateRoute"; // Import PrivateRoute component

import Home from "../src/pages/Home";
import Products from "../src/pages/Products";
import Login from "../src/pages/Login"; 
import store, { persistor } from "./redux/store";
import Applications from "./pages/Applications";
import News from "./pages/News";
import Advertising from "./pages/Advertising";
import Layout from "./pages/Layout";
import Category from "./pages/Category";
import NewsCategory from "./pages/NewsCategory";

const router = createBrowserRouter([
  {
    path: "/app",
    element: 
      <App />
    ,
    children: [
      {
        path: "home", 
        element: 
        <Home />
        
      },
      {
        path: "products", 
        element: 
        <Products />
       
      },
      {
        path: "applications", // Убираем слэш
        element: 
        <Applications />
      },
      {
        path: "news", // Убираем слэш
        element: 
        <News />
        
      },
      {
        path: "advertising", // Убираем слэш и приводим путь к нижнему регистру
        element: 
        <Advertising />
        
      },
      {
        path: "layout", // Убираем слэш и приводим путь к нижнему регистру
        element: 
        <Layout />
      
      },
      {
        path: "category", // Убираем слэш и приводим путь к нижнему регистру
        element: 
        <Category />
      },
      {
        path: "newsCategory", // Убираем слэш и приводим путь к нижнему регистру
        element:
        <NewsCategory />
      
      }
    ],
  },
  {
    path: "/",
    element: (
        <Login />
    ),
  },
]);


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);

