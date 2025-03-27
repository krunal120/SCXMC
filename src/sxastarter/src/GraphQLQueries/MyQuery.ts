import { gql } from '@apollo/client';

export const GET_USER_QUERY = gql`
  query GetData($datasource: String!) {
    item(path: $datasource, language: "en") {
      id
      ... on TitleDescriptionCarousel {
        title {
          value
        }
        description {
          value
        }
        imageCarousel {
          jsonValue
        }
        link {
          url
          linkType
          anchor
        }
        image {
          src
        }
        submittedDate {
          dateValue
          formattedDateValue
        }
        file {
          url
        }
      }
    }
  }
`;
