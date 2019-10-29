import React from 'react';
import { Pane, Text } from 'evergreen-ui';
import Amplify from 'aws-amplify';
import { Connect, withAuthenticator } from 'aws-amplify-react';
import { graphqlOperation } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as subscriptions from '../graphql/subscriptions';
import config from '../config';
import ReviewsAdminTable from '../components/ReviewsAdminTable';
import CreateReview from '../components/CreateReview';

Amplify.configure(config.awsconfig);

function AdminPage() {
  return (
    <Pane display="flex" flexDirection="column">
      <CreateReview />
      <Connect
        query={graphqlOperation(queries.listReviews)}
        subscription={graphqlOperation(subscriptions.onCreateOrUpdateOrDeleteReview)}
        onSubscriptionMsg={(prev, { onUpdateReview, onCreateReview, onDeleteReview }) => {
          if (onCreateReview) {
            prev.listReviews.items.push(onCreateReview);
          } else if (onUpdateReview) {
            prev.listReviews.items = prev.listReviews.items.map(review =>
              review.id === onUpdateReview.id ? onUpdateReview : review
            );
          } else if (onDeleteReview) {
            prev.listReviews.items = prev.listReviews.items.filter(
              review => review.id !== onDeleteReview.id
            );
          }
          return prev;
        }}
      >
        {({ data: { listReviews }, loading, error }) => {
          if (error)
            return (
              <Text intent="danger" textAlign="center">
                Error
              </Text>
            );
          if (loading || !listReviews)
            return (
              <Text intent="none" textAlign="center">
                Loading...
              </Text>
            );
          return <ReviewsAdminTable reviews={listReviews.items} />;
        }}
      </Connect>
    </Pane>
  );
}

export default withAuthenticator(AdminPage);
