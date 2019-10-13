import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import {
  Pane,
  Button,
  majorScale,
  FormField,
  TextInputField,
  Textarea,
  SelectField,
  SegmentedControl,
  Dialog,
  toaster,
} from 'evergreen-ui';
import { createReview } from '../graphql/mutations';
import { ratingOptions } from '../utils/ratings';
import { products } from '../utils/products';

function CreateReviewForm() {
  const [isShown, setIsShown] = useState(false);
  const [newProduct, setNewProduct] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newSource, setNewSource] = useState('');
  const [newDate, setNewDate] = useState(new Date());

  async function createNewReview() {
    try {
      const newUrl = `https://curiomodern.com/product/${newProduct}`;

      // Required fields
      let input = {
        url: newUrl,
        author: newAuthor,
        rating: newRating,
      };

      // Note: DynamoDB doesn't like empty string, so only add if necessary
      if (newReview) input.description = newReview;
      if (newSource) input.source = newSource;
      if (newDate) input.date = moment(newDate).format('YYYY-MM-DD');

      const result = await API.graphql(graphqlOperation(createReview, { input }));
      console.log(result);
      toaster.success('Review added successfully!');
      setIsShown(false);
    } catch (error) {
      console.error(error);
      toaster.danger(error.errors[0].message);
    }
  }

  return (
    <Pane>
      <Pane marginTop={majorScale(2)} marginX={majorScale(1)} textAlign="right">
        <Button
          iconBefore="plus"
          appearance="primary"
          intent="success"
          onClick={() => setIsShown(true)}
        >
          Create Review
        </Button>
      </Pane>
      <Dialog
        isShown={isShown}
        title="Add a Review"
        onCloseComplete={() => setIsShown(false)}
        onConfirm={createNewReview}
        confirmLabel="Add Review"
      >
        <Pane>
          <SelectField
            label="Product"
            value={newProduct}
            width="100%"
            onChange={event => setNewProduct(event.target.value)}
          >
            <option value="">- Select Product -</option>
            {products.map(product => (
              <option key={product.value} value={product.value}>{product.name}</option>
            ))}
          </SelectField>
          <TextInputField
            label="Author"
            placeholder="Customer Name"
            width="100%"
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
          />
          <FormField label="Review Description" marginBottom={majorScale(3)}>
            <Textarea
              name="description"
              placeholder="Review"
              width="100%"
              value={newReview}
              onChange={event => setNewReview(event.target.value)}
            />
          </FormField>
          <FormField label="Rating" marginBottom={majorScale(3)}>
            <SegmentedControl
              width="100%"
              options={ratingOptions}
              value={newRating}
              onChange={value => setNewRating(value)}
            />
          </FormField>
          <TextInputField
            label="Source"
            placeholder="Source (ex. Etsy, Wayfair, Website)"
            width="100%"
            value={newSource}
            onChange={event => setNewSource(event.target.value)}
          />
          <FormField label="Date" marginBottom={majorScale(3)}>
            <DatePicker format="y-MM-dd" onChange={date => setNewDate(date)} value={newDate} />
          </FormField>
        </Pane>
      </Dialog>
    </Pane>
  );
}

export default CreateReviewForm;
