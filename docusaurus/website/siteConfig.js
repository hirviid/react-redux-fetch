/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'React Redux Fetch', // Title for your website.
  tagline: 'A declarative and customizable way to fetch data in React.',
  url: 'https://hirviid.github.io', // Your website URL
  baseUrl: '/react-redux-fetch/', // Base URL for your project */

  // Used for publishing and more
  projectName: 'react-redux-fetch',
  organizationName: 'hirviid',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'doc1', label: 'Getting started' },
    { doc: 'doc4', label: 'API' },
    { doc: 'doc4', label: 'Examples' },
    // { page: 'help', label: 'Help' },
    // { blog: true, label: 'Blog' },
    {
      href: 'https://www.github.com/hirviid/react-redux-fetch',
      label: 'GitHub',
    },
  ],

  /* path to images for header/footer */
  headerIcon: 'img/react-redux-fetch.svg',
  footerIcon: 'img/react-redux-fetch.svg',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#008DF7',
    secondaryColor: '#00D7E5',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  // copyright: `Copyright © ${new Date().getFullYear()} Your Name or Your Company Name`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/hirviid/react-redux-fetch',
  npmUrl: 'https://www.npmjs.com/package/react-redux-fetch',
};

module.exports = siteConfig;
