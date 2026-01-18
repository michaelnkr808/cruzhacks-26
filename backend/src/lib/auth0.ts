import { ManagementClient, AuthenticationClient } from 'auth0';

export const auth0Management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  audience: process.env.AUTH0_AUDIENCE,
});

export const auth0Authentication = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
});

export const getAuth0Token = async () => {
  try {
    const clientCredentials = await auth0Authentication.oauth.clientCredentialsGrant({
      audience: process.env.AUTH0_AUDIENCE || `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    });
    return clientCredentials.data.access_token;
  } catch (error) {
    console.error('Error getting Auth0 token:', error);
    throw error;
  }
};