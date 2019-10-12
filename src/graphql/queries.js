/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getReview = `query GetReview($id: ID!) {
  getReview(id: $id) {
    id
    url
    author
    description
    rating
    source
    date
    isApproved
  }
}
`;
export const listReviews = `query ListReviews(
  $filter: ModelReviewFilterInput
  $limit: Int
  $nextToken: String
) {
  listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      url
      author
      description
      rating
      source
      date
      isApproved
    }
    nextToken
  }
}
`;
