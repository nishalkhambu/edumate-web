const React = require('react');
module.exports = ({ children, href }: { children: React.ReactNode; href: string }) => {
  return React.createElement('a', { href }, children);
};
