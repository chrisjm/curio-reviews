import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import {
  Pane,
  Table,
  Text,
  TextInput,
  Dialog,
  SegmentedControl,
  Textarea,
  Button,
  majorScale,
  toaster,
} from 'evergreen-ui';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import { listReviews } from '../graphql/queries';
import { updateReview, deleteReview } from '../graphql/mutations';

function ReviewsTable() {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState({});

  // Labels
  const [loadReviewsButtonLabel, setloadReviewsButtonLabel] = useState('Load Reviews');
  const [result, setResult] = useState('No reviews loaded.');

  // Update Dialog
  const [updatedUrl, setUpdatedUrl] = useState('');
  const [updatedAuthor, setUpdatedAuthor] = useState('');
  const [updatedReview, setUpdatedReview] = useState('');
  const [updatedRating, setUpdatedRating] = useState(null);
  const [updatedSource, setUpdatedSource] = useState('');
  const [updatedDate, setUpdatedDate] = useState(null);

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

  async function updateSelectedReview() {
    try {
      // Required fields
      let input = {
        id: selectedReview.id,
        url: updatedUrl,
        author: updatedAuthor,
        rating: updatedRating,
      };

      // Note: DynamoDB doesn't like empty string, so only add if necessary
      if (updatedReview) input.description = updatedReview;
      if (updatedSource) input.source = updatedSource;
      if (updatedDate) input.date = moment(updatedDate).format('YYYY-MM-DD');

      // Update review
      const { data } = await API.graphql(graphqlOperation(updateReview, { input }));

      // UI Feedback
      toaster.success('Review updated successfully!');
      closeUpdateDialog();
    } catch (error) {
      console.error(error);
      toaster.danger(error.errors[0].message);
    }
  }

  function showUpdateDialog(review) {
    setSelectedReview(review);
    setUpdatedUrl(review.url);
    setUpdatedAuthor(review.author);
    setUpdatedReview(review.description);
    setUpdatedRating(review.rating);
    setUpdatedSource(review.source);
    setUpdatedDate(review.date);
    setIsUpdateDialogOpen(true);
  }

  function closeUpdateDialog() {
    setIsUpdateDialogOpen(false);
  }

  async function handleDeleteReview(id) {
    const input = { id };

    // Update review
    const { data } = await API.graphql(graphqlOperation(deleteReview, { input }));
    console.log(data);
    // UI Feedback
    toaster.success('Review deleted successfully!');
  }

  return (
    <Pane>
      <Pane marginTop={majorScale(2)} marginX={majorScale(1)}>
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>URL</Table.TextHeaderCell>
            <Table.TextHeaderCell>Author</Table.TextHeaderCell>
            <Table.TextHeaderCell>Review</Table.TextHeaderCell>
            <Table.TextHeaderCell>Rating</Table.TextHeaderCell>
            <Table.TextHeaderCell>Source</Table.TextHeaderCell>
            <Table.TextHeaderCell>Date</Table.TextHeaderCell>
            <Table.TextHeaderCell>Actions</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {reviews.map(review => (
              <Table.Row key={review.id}>
                <Table.TextCell>{review.url}</Table.TextCell>
                <Table.TextCell>{review.author}</Table.TextCell>
                <Table.TextCell>{review.description}</Table.TextCell>
                <Table.TextCell isNumber>{review.rating}</Table.TextCell>
                <Table.TextCell>{review.source}</Table.TextCell>
                <Table.TextCell>{review.date}</Table.TextCell>
                <Table.TextCell>
                  <Button
                    iconBefore="edit"
                    appearance="minimal"
                    intent="none"
                    marginRight={majorScale(1)}
                    onClick={() => showUpdateDialog(review)}
                  >
                    Edit
                  </Button>
                  <Button
                    iconBefore="trash"
                    appearance="minimal"
                    intent="danger"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    Delete
                  </Button>
                </Table.TextCell>
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
      <Dialog
        isShown={isUpdateDialogOpen}
        title="Update Review"
        onConfirm={updateSelectedReview}
        onCloseComplete={closeUpdateDialog}
        confirmLabel="Update Review"
      >
        <Pane>
          <TextInput
            name="url"
            placeholder="https://curiomodern.com/products/..."
            width="100%"
            marginTop={majorScale(1)}
            value={updatedUrl}
            onChange={event => setUpdatedUrl(event.target.value)}
          />
          <TextInput
            name="author"
            placeholder="Customer Name"
            width="100%"
            marginTop={majorScale(1)}
            value={updatedAuthor}
            onChange={event => setUpdatedAuthor(event.target.value)}
          />
          <Textarea
            name="description"
            placeholder="Review"
            width="100%"
            marginTop={majorScale(1)}
            value={updatedReview}
            onChange={event => setUpdatedReview(event.target.value)}
          />
          <SegmentedControl
            width="100%"
            marginTop={majorScale(1)}
            options={ratingOptions}
            value={updatedRating}
            onChange={value => setUpdatedRating(value)}
          />
          <TextInput
            name="source"
            placeholder="Source (ex. Etsy, Wayfair, Website)"
            width="100%"
            marginTop={majorScale(1)}
            value={updatedSource}
            onChange={event => setUpdatedSource(event.target.value)}
          />
          <Pane marginTop={majorScale(1)}>
            <DatePicker
              format="y-MM-dd"
              onChange={date => setUpdatedDate(date)}
              value={updatedDate}
            />
          </Pane>
        </Pane>
      </Dialog>
    </Pane>
  );
}

export default ReviewsTable;
