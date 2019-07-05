import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { Helmet } from "react-helmet";
import client from "./apollo";
import Main from "./Main";
import CreateRoom from "./CreateRoom";
import Room from "./Room";
import Layout from "./Layout";

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Layout>
          <Helmet>
            <link
              rel="stylesheet"
              href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
              integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
              crossorigin="anonymous"
            />
          </Helmet>
          <Route path="/" exact component={Main} />
          <Route path="/create-room" component={CreateRoom} />
          <Route path="/rooms/:roomId/" component={Room} />
        </Layout>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
