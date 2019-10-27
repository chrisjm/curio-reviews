import React from 'react';
import { Icon, Pane, Text, majorScale } from 'evergreen-ui';
import times from 'lodash/times';
import moment from 'moment';
import { productNameFromUrl } from '../utils/products';

function ReviewsList({ reviews }) {
  return (
    <Pane marginX={majorScale(2)}>
      {reviews.map(review => (
        <Pane
          key={review.id}
          border="default"
          padding={majorScale(2)}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          marginTop={majorScale(1)}
        >
          <Pane display="flex" justifyContent="space-between">
            <Text color="dark">
              {review.description}
            </Text>
            <Pane textAlign="right" flexBasis={200} flexGrow={1}>
              {times(review.rating, () => (
                <Icon icon="star" color="warning" />
              ))}
              {times(5 - review.rating, () => (
                <Icon icon="star-empty" color="warning" />
              ))}
            </Pane>
          </Pane>
          <Pane marginTop={majorScale(1)} display="flex" justifyContent="space-between">
            <Pane>
              <Text color="default" marginRight={majorScale(1)}>
                {review.author}
              </Text>
              <Text color="muted">{moment(review.date).fromNow()}</Text>
            </Pane>
            <Pane>
              <Text>{productNameFromUrl(review.url)}</Text>
            </Pane>
          </Pane>
        </Pane>
      ))}
    </Pane>
  );
}

export default ReviewsList;
