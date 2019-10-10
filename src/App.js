import React, { useState } from 'react';
import './App.css';
import { PubSub, Auth, API, graphqlOperation } from 'aws-amplify';
import { createReview } from './graphql/mutations';
import awsconfig from './aws-exports';

Auth.configure(awsconfig);
API.configure(awsconfig);
PubSub.configure(awsconfig);

async function createNewReview() {
  const review = {
    url: 'https://chrisjmears.com',
    description: 'Awesome website! 👍',
    author: 'chrisjm',
    rating: 5,
    source: 'website',
  };
  return await API.graphql(graphqlOperation(createReview, { input: review }));
}

function App() {
  const [result, setResult] = useState('Click to add fake reviews');

  async function handleClick() {
    try {
      setResult('Loading...');
      const { data } = await createNewReview();
      setResult(`${data.createReview.url} - ${data.createReview.author} - ${data.createReview.description}`);
    } catch (error) {
      setResult(error);
    }
  }

  return (
    <div className="app">
      <div className="app-header">
        <div className="app-logo">
          <img
            src="https://aws-amplify.github.io/images/Logos/Amplify-Logo-White.svg"
            alt="AWS Amplify"
          />
        </div>
        <h1>Welcome to the Amplify Framework</h1>
      </div>
      <div className="app-body">
        <button onClick={handleClick}>Add data</button>
        <div>{result}</div>
      </div>
    </div>
  );
}

export default App;
