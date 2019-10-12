import React from 'react';
import { Pane } from 'evergreen-ui';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import awsconfig from './aws-exports';
import ReviewsTable from './components/ReviewsTable';
import CreateReview from './components/CreateReview';
import Header from './components/Header';

Amplify.configure(awsconfig);

function App() {
  return (
    <Pane display="flex" flexDirection="column">
      <Header />
      <CreateReview />
      <ReviewsTable />
    </Pane>
  );
}

export default withAuthenticator(App);
