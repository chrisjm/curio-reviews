import React, { useState } from 'react';
import { Pane, Button, Text, Heading, majorScale } from 'evergreen-ui';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { createReview } from './graphql/mutations';
import awsconfig from './aws-exports';

async function createNewReview() {
  const review = {
    url: 'https://chrisjmears.com',
    description: 'Awesome website! 👍',
    author: 'chrisjm',
    rating: 5,
    source: 'website',
  };
  return await API.graphql(graphqlOperation(createReview, { input: review }));
Amplify.configure(awsconfig);

}

function App() {
  const [result, setResult] = useState('Click to add fake reviews');

  async function handleClick() {
    try {
      setResult('Loading...');
      const { data } = await createNewReview();
      setResult(
        `${data.createReview.url} - ${data.createReview.author} - ${data.createReview.description}`
      );
    } catch (error) {
      setResult(error);
    }
  }

  return (
    <Pane display="flex" flexDirection="column">
      <Pane
        padding={majorScale(6)}
        background="linear-gradient(30deg, #f90 55%, #FFC300)"
        boxShadow="1px 2px 4px rgba(0, 0, 0, .3)"
        marginBottom={majorScale(3)}
        textAlign="center"
      >
        <Heading size={900} color="white">
          CURIO Reviews
        </Heading>
      </Pane>
      <Pane marginTop={majorScale(2)} textAlign="center">
        <Button onClick={handleClick}>Add data</Button>
      </Pane>
      <Pane marginTop={majorScale(2)} textAlign="center">
        <Text>{result}</Text>
      </Pane>
    </Pane>
  );
}

export default withAuthenticator(App);
