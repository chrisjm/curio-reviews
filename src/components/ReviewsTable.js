import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Pane, Table, Text, Button, majorScale, toaster } from 'evergreen-ui';
import { listReviews } from '../graphql/queries';

function ReviewsTable() {
  const [result, setResult] = useState('No reviews loaded.');
  const [loadReviewsButtonLabel, setloadReviewsButtonLabel] = useState('Load Reviews');
  const [reviews, setReviews] = useState([]);

  async function loadReviews() {
    try {
      setResult('Loading...');
      const { data } = await await API.graphql(graphqlOperation(listReviews));
      const reviews = data.listReviews.items;
      setResult(`Found ${reviews.length} reviews.`);
      setloadReviewsButtonLabel('Refresh Reviews');
      setReviews(reviews);
    } catch (error) {
      console.error(error);
      toaster.danger(error.errors[0].message);
    }
  }

  return (
    <Pane>
      <Pane marginTop={majorScale(2)} marginX={majorScale(1)}>
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>Product</Table.TextHeaderCell>
            <Table.TextHeaderCell>Author</Table.TextHeaderCell>
            <Table.TextHeaderCell>Review</Table.TextHeaderCell>
            <Table.TextHeaderCell>Rating</Table.TextHeaderCell>
            <Table.TextHeaderCell>Source</Table.TextHeaderCell>
            <Table.TextHeaderCell>Date</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {reviews.map(review => (
              <Table.Row key={review.id} isSelectable onSelect={() => alert(review.description)}>
                <Table.TextCell>{review.url}</Table.TextCell>
                <Table.TextCell>{review.author}</Table.TextCell>
                <Table.TextCell>{review.description}</Table.TextCell>
                <Table.TextCell isNumber>{review.rating}</Table.TextCell>
                <Table.TextCell>{review.source}</Table.TextCell>
                <Table.TextCell>{review.date}</Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Pane>
      <Pane marginTop={majorScale(2)} textAlign="center">
        <Text>{result}</Text>
      </Pane>
      <Pane marginTop={majorScale(2)} textAlign="center">
        <Button iconBefore="refresh" appearance="primary" onClick={loadReviews}>
          {loadReviewsButtonLabel}
        </Button>
      </Pane>
    </Pane>
  );
}

export default ReviewsTable;
