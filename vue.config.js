module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/title-screen-generator/'
    : '/',
  transpileDependencies: [
    'vuetify',
  ],
};
