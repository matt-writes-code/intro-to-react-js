import { graphql } from 'gatsby';
import React from 'react';
import { LinkButton } from '../components/button';
import { MaterialIcons } from '../components/material-icons';
import { PageContainer } from '../components/page-container';

const InstructionNav = ({ pageContext }) => (
  <nav
    className="instruction-template-nav"
    style={{ display: 'flex', justifyContent: 'space-between' }}
  >
    {pageContext.previous ? (
      <LinkButton to={pageContext.previous.frontmatter.path}>
        <MaterialIcons name="arrow_back" />
        {pageContext.previous.frontmatter.title}
      </LinkButton>
    ) : (
      <span />
    )}
    {pageContext.next ? (
      <LinkButton to={pageContext.next.frontmatter.path}>
        {pageContext.next.frontmatter.title}
        <MaterialIcons name="arrow_forward" />
      </LinkButton>
    ) : (
      <span />
    )}
  </nav>
);

const InstructionTemplate = ({ data, pageContext }) => (
  <PageContainer>
    <div className="instruction-template">
      <main>
        <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
      </main>
      <InstructionNav pageContext={pageContext} />
    </div>
  </PageContainer>
);

export default InstructionTemplate;

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
    }
  }
`;