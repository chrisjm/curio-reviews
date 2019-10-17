export default {
  awsconfig: {
    aws_project_region: process.env.AWS_PROJECT_REGION || 'us-west-2',
    aws_cognito_identity_pool_id: process.env.AWS_COGNITO_IDENTITY_POOL_ID || null,
    aws_cognito_region: process.env.AWS_COGNITO_REGION || 'us-west-2',
    aws_user_pools_id: process.env.AWS_USER_POOLS_ID || null,
    aws_user_pools_web_client_id: process.env.AWS_USER_POOLS_WEB_CLIENT_ID || null,
    oauth: {},
    aws_appsync_graphqlEndpoint: process.env.AWS_APPSYNC_GRAPHQLENDPOINT || null,
    aws_appsync_region: process.env.AWS_APPSYNC_REGION || 'us-west-2',
    aws_appsync_authenticationType:
      process.env.AWS_APPSYNC_AUTHENTICATIONTYPE || 'AMAZON_COGNITO_USER_POOLS',
    aws_content_delivery_bucket: process.env.AWS_CONTENT_DELIVERY_BUCKET || null,
    aws_content_delivery_bucket_region:
      process.env.AWS_CONTENT_DELIVERY_BUCKET_REGION || 'us-west-2',
    aws_content_delivery_url: process.env.AWS_CONTENT_DELIVERY_URL || null,
  },
};
