import React from 'react';
import {
  Field,
  ComponentParams,
  ComponentRendering,
  RichText as JssRichText,
  Placeholder,
  RouteData,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-nextjs/graphql';
import { GET_USER_QUERY } from 'src/GraphQLQueries/MyQuery';

const endpoint =
  'https://xmc-sourceved15434-jsitecorexmc413-dev0494.sitecorecloud.io/sitecore/api/graph/edge';
const apiKey = 'B12D98C5-FB7B-48AE-8BF9-EBF7B0546DC9';

const client = new GraphQLRequestClient(endpoint, {
  apiKey: apiKey,
});

const fetchGraphQL = async (query: string, variables = {}) => {
  try {
    const result = await client.request(query, variables);
    return result;
  } catch (error) {
    console.error('GraphQL Request Error:', error);
    return null;
  }
};

interface Fields {
  data: unknown;
  title: Field<string>;
  description: Field<string>;
  imageCarousel: JsonValue;
}

interface JsonValue {
  jsonValue: Array<ImageField>;
}
interface ImageField {
  url: string;
}

interface TitleDescriptionCarouselProps {
  rendering: ComponentRendering;
  params: ComponentParams;
  fields: Fields;
  route: RouteData;
}

export const Default = (props: TitleDescriptionCarouselProps): JSX.Element => {
  fetchGraphQL(GET_USER_QUERY, { datasource: props.params.datasource }).then((data) => {
    console.log('GraphQL Data:', data);
  });
  const { sitecoreContext } = useSitecoreContext();
  // Get the route data
  const route = sitecoreContext.route;
  console.log('route', route);
  console.log('new props', props);
  const data = props.fields.data as { item: Fields };
  const item = data.item;
  const title = item.title ? (
    <h2>{item.title.value}</h2>
  ) : (
    <span className="is-empty-hint">Title is empty</span>
  );
  const description = item.description ? (
    <JssRichText field={item.description} tag="section" editable={true} />
  ) : (
    <span className="is-empty-hint">Description is empty</span>
  );
  console.log('props', props);
  const images = item.imageCarousel.jsonValue || [];
  console.log('images', images);
  return (
    <div className="component title-description-carousel" id={props.params.RenderingIdentifier}>
      {route && <Placeholder name="my-custom-components" rendering={route} />}
      <div className="component-content">
        {title}
        {description}
        <div className="image-carousel">
          {images.map((image: ImageField, index: number) => (
            <img key={index} src={image.url} alt={`Image ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
