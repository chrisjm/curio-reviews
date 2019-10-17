export default {
  awsconfig: {
    aws_project_region: process.env.REACT_APP_AWS_PROJECT_REGION,
    aws_cognito_identity_pool_id: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
    aws_cognito_region: process.env.REACT_APP_AWS_COGNITO_REGION,
    aws_user_pools_id: process.env.REACT_APP_AWS_USER_POOLS_ID,
    aws_user_pools_web_client_id: process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,
    oauth: {},
    aws_appsync_graphqlEndpoint: process.env.REACT_APP_AWS_APPSYNC_GRAPHQLENDPOINT,
    aws_appsync_region: process.env.REACT_APP_AWS_APPSYNC_REGION,
    aws_appsync_authenticationType: process.env.REACT_APP_AWS_APPSYNC_AUTHENTICATIONTYPE,
    aws_content_delivery_bucket: process.env.REACT_APP_AWS_CONTENT_DELIVERY_BUCKET,
    aws_content_delivery_bucket_region: process.env.REACT_APP_AWS_CONTENT_DELIVERY_BUCKET_REGION,
    aws_content_delivery_url: process.env.REACT_APP_AWS_CONTENT_DELIVERY_URL,
  },
};
