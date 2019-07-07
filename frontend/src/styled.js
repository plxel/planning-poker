import styled from "styled-components";

export const CenteredLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 100vw;
  min-height: calc(100vh - 66px);

  .main-logo {
    margin-bottom: 50px;
  }
`;

export const Logo = styled.div`
  img {
    filter: invert(1);
  }
  a {
    color: #fff;
    &:hover,
    &:active,
    &:focus,
    &:visited,
    &:link {
      color: #fff;
      text-decoration: none;
    }
  }
`;

export const Me = styled.div`
  color: #fff;

  img {
    margin-left: 10px;
  }
`;

export const EstimateWrapper = styled.div`
  padding: 30px;
  border: 1px dashed #ddd;
  min-height: 300px;
  margin: 30px 0;

  .heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cards {
    margin-top: 30px;
    .card {
      &:hover {
        cursor: pointer;
        background: #f5f5f5;
      }
    }
  }
`;
