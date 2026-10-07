// Everything the auth feature does with the browser Supabase client, in one
// module so it can be loaded on demand (load-api.js). Import it only through
// loadAuthApi(), never statically: a static import puts the Supabase client
// back into every page's bundle.
export * from './session';
export * from './wishlist';
