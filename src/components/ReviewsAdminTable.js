import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import {
  Icon,
  Pane,
  Heading,
  Table,
  Text,
  TextInputField,
  Dialog,
  FormField,
  SegmentedControl,
  Textarea,
  Button,
  Switch,
  SelectField,
  majorScale,
  toaster,
} from 'evergreen-ui';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import times from 'lodash/times';
import { useMediaQuery } from 'react-responsive';
import { updateReview, deleteReview } from '../graphql/mutations';
import { ratingOptions } from '../utils/ratings';
import {
  products,
  productValueFromUrl,
  productUrlFromValue,
  productNameFromUrl,
} from '../utils/products';

const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 976 });
  return isMobile ? children : null;
};

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 975 });
  return isDesktop ? children : null;
};

function ReviewsAdminTable({ reviews }) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState({});

  // Update Dialog
  const [updatedUrl, setUpdatedUrl] = useState('');
  const [updatedAuthor, setUpdatedAuthor] = useState('');
  const [updatedReview, setUpdatedReview] = useState('');
  const [updatedRating, setUpdatedRating] = useState(null);
  const [updatedSource, setUpdatedSource] = useState('');
  const [updatedDate, setUpdatedDate] = useState(null);
  const [updatedIsApproved, setUpdatedIsApproved] = useState(false);

  async function updateSelectedReview() {
    try {
      // Required fields
      let input = {
        id: selectedReview.id,
        url: updatedUrl,
        author: updatedAuthor,
        rating: updatedRating,
        isApproved: updatedIsApproved,
      };

      // Note: DynamoDB doesn't like empty string, so only add if necessary
      if (updatedReview) input.description = updatedReview;
      if (updatedSource) input.source = updatedSource;
      if (updatedDate) input.date = moment(updatedDate).format('YYYY-MM-DD');

      await API.graphql(graphqlOperation(updateReview, { input }));

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
    setUpdatedIsApproved(review.isApproved);
    setIsUpdateDialogOpen(true);
  }

  function showDeleteDialog(review) {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  }

  function closeUpdateDialog() {
    setIsUpdateDialogOpen(false);
  }

  async function handleDeleteReview(id) {
    try {
      const input = { id };
      await API.graphql(graphqlOperation(deleteReview, { input }));
      toaster.success('Review deleted successfully!');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
      toaster.danger(error.errors[0].message);
    }
  }

  async function handleUpdateApproved(id, isApproved) {
    try {
      const input = {
        id,
        isApproved,
      };

      await API.graphql(graphqlOperation(updateReview, { input }));

      if (isApproved) {
        toaster.success('Review approved!');
      } else {
        toaster.success('Review ignored.');
      }
    } catch (error) {
      console.error(error);
      toaster.danger(error.errors[0].message);
    }
  }

  return (
    <Pane>
      <Pane marginTop={majorScale(2)} marginX={majorScale(1)}>
        <Desktop>
          <Table>
            <Table.Head>
              <Table.TextHeaderCell>Product</Table.TextHeaderCell>
              <Table.TextHeaderCell>Review</Table.TextHeaderCell>
              <Table.TextHeaderCell>Rating</Table.TextHeaderCell>
              <Table.TextHeaderCell>Approved?</Table.TextHeaderCell>
              <Table.TextHeaderCell>Actions</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
              {reviews.map(review => (
                <Table.Row key={review.id}>
                  <Table.TextCell>{productNameFromUrl(review.url)}</Table.TextCell>
                  <Table.TextCell>{review.description}</Table.TextCell>
                  <Table.TextCell>
                    {times(review.rating, () => (
                      <Icon icon="star" color="warning" />
                    ))}
                    {times(5 - review.rating, () => (
                      <Icon icon="star-empty" color="warning" />
                    ))}
                  </Table.TextCell>
                  <Table.TextCell>
                    <Switch
                      height={24}
                      checked={review.isApproved}
                      onChange={event => handleUpdateApproved(review.id, event.target.checked)}
                    />
                  </Table.TextCell>
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
                      onClick={() => showDeleteDialog(review)}
                    >
                      Delete
                    </Button>
                  </Table.TextCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Desktop>
        <Mobile>
          {reviews.map(review => (
            <Pane
              key={review.id}
              border="default"
              padding={majorScale(2)}
              display="flex"
              justifyContent="center"
              flexDirection="column"
              marginTop={majorScale(2)}
            >
              <Pane display="flex" justifyContent="space-between">
                <Heading size={500}>{productNameFromUrl(review.url)}</Heading>
                <Pane textAlign="right">
                  {times(review.rating, () => (
                    <Icon icon="star" color="warning" />
                  ))}
                  {times(5 - review.rating, () => (
                    <Icon icon="star-empty" color="warning" />
                  ))}
                </Pane>
              </Pane>
              <Text marginY={majorScale(2)}>{review.description}</Text>
              <Pane display="flex" marginTop={majorScale(1)} justifyContent="space-between" alignItems="center">
                <Pane>
                  <Button
                    iconBefore="edit"
                    appearance="primary"
                    intent="none"
                    marginRight={majorScale(1)}
                    onClick={() => showUpdateDialog(review)}
                  >
                    Edit
                  </Button>
                  <Button
                    iconBefore="trash"
                    appearance="primary"
                    intent="danger"
                    onClick={() => showDeleteDialog(review)}
                  >
                    Delete
                  </Button>
                </Pane>
                <Pane display="flex" flexDirection="column" justifyContent="center">
                  <Heading size={200} marginBottom={majorScale(1)}>Approved?</Heading>
                  <Switch
                    height={24}
                    checked={review.isApproved}
                    onChange={event => handleUpdateApproved(review.id, event.target.checked)}
                  />
                </Pane>
              </Pane>
            </Pane>
          ))}
        </Mobile>
      </Pane>
      <Dialog
        isShown={isUpdateDialogOpen}
        title="Update Review"
        onConfirm={updateSelectedReview}
        onCloseComplete={closeUpdateDialog}
        confirmLabel="Update Review"
      >
        <Pane>
          <SelectField
            label="Product"
            width="100%"
            value={productValueFromUrl(updatedUrl)}
            onChange={event => setUpdatedUrl(productUrlFromValue(event.target.value))}
          >
            <option value="">- Select Product -</option>
            {products.map(product => (
              <option key={product.value} value={product.value}>
                {product.name}
              </option>
            ))}
          </SelectField>
          <TextInputField
            label="Product URL"
            placeholder="https://curiomodern.com/products/..."
            width="100%"
            value={updatedUrl}
            onChange={event => setUpdatedUrl(event.target.value)}
          />
          <TextInputField
            label="Author"
            placeholder="Customer Name"
            width="100%"
            value={updatedAuthor}
            onChange={event => setUpdatedAuthor(event.target.value)}
          />
          <FormField label="Review Description" marginBottom={24}>
            <Textarea
              width="100%"
              value={updatedReview}
              onChange={event => setUpdatedReview(event.target.value)}
            />
          </FormField>
          <FormField label="Rating" marginBottom={24}>
            <SegmentedControl
              width="100%"
              options={ratingOptions}
              value={updatedRating}
              onChange={value => setUpdatedRating(value)}
            />
          </FormField>
          <TextInputField
            label="Source"
            placeholder="Source (ex. Etsy, Wayfair, Website)"
            width="100%"
            value={updatedSource}
            onChange={event => setUpdatedSource(event.target.value)}
          />
          <FormField label="Date" marginBottom={24}>
            <DatePicker
              format="y-MM-dd"
              onChange={date => setUpdatedDate(date)}
              value={updatedDate}
            />
          </FormField>
          <FormField label="Approved?" marginBottom={24}>
            <Switch
              height={24}
              checked={!!updatedIsApproved}
              onChange={event => setUpdatedIsApproved(event.target.checked)}
            />
          </FormField>
        </Pane>
      </Dialog>
      <Dialog
        isShown={isDeleteDialogOpen}
        title="Delete Review"
        intent="danger"
        onConfirm={() => handleDeleteReview(selectedReview.id)}
        onCloseComplete={() => setIsDeleteDialogOpen(false)}
        confirmLabel="Delete Review"
      >
        Are you sure you want to delete this review?
      </Dialog>
    </Pane>
  );
}

export default ReviewsAdminTable;
