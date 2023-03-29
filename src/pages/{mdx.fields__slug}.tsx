import * as styles from '../styles/pages/{mdx.fields__slug}.module.scss';
import { MDXProvider } from '@mdx-js/react';
import React, { useRef } from 'react';
import TableOfContents from '../components/TableOfContents';
import { graphql } from 'gatsby';
import { BlockQuote, SmartLink, TableWrapper } from '../components/replacements';
import { Props } from '@mdx-js/react/lib';
import type { HeadProps } from 'gatsby';
import SEO from '../components/SEO';

interface TOCItem {
  title: string;
  url: string;
  items?: TOCItem[];
}

interface ContentTemplateProps {
  data: {
    mdx: {
      tableOfContents: {
        items: TOCItem[];
      };
      frontmatter: {
        toc?: boolean;
        title?: string;
      };
    };
  };
  children: React.ReactNode;
}

const components: Props['components'] = {
  table: TableWrapper,
  a: SmartLink,
  blockquote: BlockQuote
};

const ContentTemplate = (props: ContentTemplateProps) => {
  const {
    data: {
      mdx: { tableOfContents, frontmatter }
    },
    children
  } = props;

  const { toc = true } = frontmatter;
  const { items: tocItems } = tableOfContents;
  const articleRef = useRef(null);

  // useEffect(() => {
  //   if (articleRef.current) {
  //     const test = articleRef.current.querySelector('h1');

  //     console.log(test);

  //     const options = {
  //       root: articleRef.current.querySelector('h1'),
  //       rootMargin: '0px',
  //       threshold: 1.0
  //     };
  //   }

  //   // let observer = new IntersectionObserver(callback, options);
  // }, []);

  return (
    <>
      <article className={styles.article} ref={articleRef}>
        <MDXProvider components={components}>{children}</MDXProvider>
      </article>
      {(toc === null ? true : toc) && tocItems && <TableOfContents itemsList={tocItems} />}
    </>
  );
};

export const pageQuery = graphql`
  query PostTemplate($id: String!) {
    mdx(id: { eq: $id }) {
      tableOfContents(maxDepth: 2)
      frontmatter {
        title
        toc
      }
    }
  }
`;

// SEO
export const Head = (props: HeadProps<ContentTemplateProps['data']>) => {
  const {
    location: { pathname },
    data: {
      mdx: {
        frontmatter: { title },
        tableOfContents: { items }
      }
    }
  } = props;

  return <SEO {...{ pathname, title: title || items[0].title || undefined }} />;
};

export default ContentTemplate;
