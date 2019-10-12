import React from 'react';
import {
  Pane,
  Heading,
  majorScale,
} from 'evergreen-ui';

function Header() {
  return (
    <Pane
      padding={majorScale(4)}
      background="linear-gradient(30deg, #f90 55%, #FFC300)"
      boxShadow="1px 2px 4px rgba(0, 0, 0, .3)"
      marginBottom={majorScale(3)}
      textAlign="center"
    >
      <Heading size={900} color="white">
        CURIO Reviews
      </Heading>
    </Pane>
  );
}

export default Header;
