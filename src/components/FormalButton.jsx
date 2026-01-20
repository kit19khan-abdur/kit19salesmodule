import React from 'react';
import styled from 'styled-components';

const FormalButton = ({label, onAllFiltersClick}) => {
  return (
    <StyledWrapper>
      <button className="btn" onClick={onAllFiltersClick}>{label}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
   background-color: #00BFA6;
   padding: 6px 20px;
   color: #fff;
   text-transform: uppercase;
   letter-spacing: 2px;
   cursor: pointer;
   border-radius: 10px;
   border: 2px dashed #00BFA6;
   box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
   transition: .4s;
  }

  .btn span:last-child {
   display: none;
  }

  .btn:hover {
   transition: .4s;
   border: 2px dashed #00BFA6;
   background-color: #fff;
   color: #00BFA6;
  }

  .btn:active {
   background-color: #87dbd0;
  }`;

export default FormalButton;
