import React from 'react';

const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '10px', background: '#f1f1f1', position: 'fixed', bottom: 0, width: '100%' }}>
      &copy; {new Date().getFullYear()} Toll-Link
    </footer>
  );
};

export default Footer;