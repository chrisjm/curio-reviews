import awsmobile from './aws-exports';

export default {
  awsconfig: {
    aws_project_region: process.env.AWS_PROJECT_REGION || awsmobile.aws_project_region,
    aws_cognito_identity_pool_id:
      process.env.AWS_COGNITO_IDENTITY_POOL_ID || awsmobile.aws_cognito_identity_pool_id,
    aws_cognito_region: process.env.AWS_COGNITO_REGION || awsmobile.aws_cognito_region,
    aws_user_pools_id: process.env.AWS_USER_POOLS_ID || awsmobile.aws_user_pools_id,
    aws_user_pools_web_client_id:
      process.env.AWS_USER_POOLS_WEB_CLIENT_ID || awsmobile.aws_user_pools_web_client_id,
    oauth: process.env.OAUTH || awsmobile.oauth,
    aws_appsync_graphqlEndpoint:
      process.env.AWS_APPSYNC_GRAPHQLENDPOINT || awsmobile.aws_appsync_graphqlEndpoint,
    aws_appsync_region: process.env.AWS_APPSYNC_REGION || awsmobile.aws_appsync_region,
    aws_appsync_authenticationType:
      process.env.AWS_APPSYNC_AUTHENTICATIONTYPE || awsmobile.aws_appsync_authenticationType,
    aws_content_delivery_bucket:
      process.env.AWS_CONTENT_DELIVERY_BUCKET || awsmobile.aws_content_delivery_bucket,
    aws_content_delivery_bucket_region:
      process.env.AWS_CONTENT_DELIVERY_BUCKET_REGION ||
      awsmobile.aws_content_delivery_bucket_region,
    aws_content_delivery_url:
      process.env.AWS_CONTENT_DELIVERY_URL || awsmobile.aws_content_delivery_url,
  },
};
