import React, { useState } from 'react';
import {
  Card,
  Pane,
  Button,
  Text,
  Heading,
  majorScale,
  Table,
  TextInput,
  Textarea,
  Select,
  SegmentedControl,
  toaster,
} from 'evergreen-ui';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import { listReviews } from './graphql/queries';
import { createReview } from './graphql/mutations';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

async function getReviews() {
  return await API.graphql(graphqlOperation(listReviews));
}

function App() {
  // Dashboard
  const [result, setResult] = useState('No reviews loaded.');
  const [loadReviewsButtonLabel, setloadReviewsButtonLabel] = useState('Load Reviews');
  const [reviews, setReviews] = useState([]);

  // Create Form
  const [newProduct, setNewProduct] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newSource, setNewSource] = useState('');
  const [newDate, setNewDate] = useState(new Date());

  const ratingOptions = [
    { label: '⭐', value: 1 },
    { label: '⭐⭐', value: 2 },
    { label: '⭐⭐⭐', value: 3 },
    { label: '⭐⭐⭐⭐', value: 4 },
    { label: '⭐⭐⭐⭐⭐', value: 5 },
  ];

  async function loadReviews() {
    try {
      setResult('Loading...');
      const { data } = await getReviews();
      const reviews = data.listReviews.items;
      setResult(`Found ${reviews.length} reviews.`);
      setloadReviewsButtonLabel('Refresh Reviews');
      setReviews(reviews);
    } catch (error) {
      console.error(error);
      toaster.danger(error.errors[0].message);
    }
  }

  async function createNewReview() {
    try {
      const newUrl = `https://curiomodern.com/product/${newProduct}`;

      // Required fields
      let input = {
        url: newUrl,
        author: newAuthor,
        rating: newRating
      }

      // Note: DynamoDB doesn't like empty string, so only add if necessary
      if (newReview) input.description = newReview;
      if (newSource) input.source = newSource;
      if (newDate) input.date = moment(newDate).format('YYYY-MM-DD');

      const result = await API.graphql(graphqlOperation(createReview, { input }));
      console.log(result);
      toaster.success('Review added successfully!');
    } catch (error) {
      console.error(error);
      toaster.danger(error.errors[0].message);
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
        <Button iconBefore="refresh" appearance="primary" intent="success" onClick={loadReviews}>
          {loadReviewsButtonLabel}
        </Button>
      </Pane>
      <Card
        marginTop={majorScale(2)}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        marginX={majorScale(1)}
        border="default"
        padding={majorScale(3)}
      >
        <Heading size={700}>Add Review</Heading>
        <Select
          marginTop={majorScale(1)}
          value={newProduct}
          onChange={event => setNewProduct(event.target.value)}
        >
          <option value="">- Select Product -</option>
          <option value="maple">Maple CURIO</option>
          <option value="maple-pattern">Maple + Pattern CURIO</option>
          <option value="walnut">Walnut CURIO</option>
          <option value="walnut-pattern">Walnut + Pattern CURIO</option>
          <option value="litter-liner">Litter Liner</option>
        </Select>
        <TextInput
          name="author"
          placeholder="Customer Name"
          width="100%"
          marginTop={majorScale(1)}
          value={newAuthor}
          onChange={event => setNewAuthor(event.target.value)}
        />
        <Textarea
          name="description"
          placeholder="Review"
          width="100%"
          marginTop={majorScale(1)}
          value={newReview}
          onChange={event => setNewReview(event.target.value)}
        />
        <SegmentedControl
          width="100%"
          marginTop={majorScale(1)}
          options={ratingOptions}
          value={newRating}
          onChange={value => setNewRating(value)}
        />
        <TextInput
          name="source"
          placeholder="Source (ex. Etsy, Wayfair, Website)"
          width="100%"
          marginTop={majorScale(1)}
          value={newSource}
          onChange={event => setNewSource(event.target.value)}
        />
        <Pane marginTop={majorScale(1)}>
          <DatePicker format="y-MM-dd" onChange={date => setNewDate(date)} value={newDate} />
        </Pane>
        <Pane marginTop={majorScale(1)}>
          <Button appearance="primary" onClick={createNewReview}>
            Add Review
          </Button>
        </Pane>
      </Card>
    </Pane>
  );
}

export default withAuthenticator(App);
