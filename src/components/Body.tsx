import {Markdown} from 'contentlayer/core';
import ReactMarkdown from 'react-markdown';
import styles from '@/styles/Body.module.css';

export default function Body({
  children,
  className,
  title,
  ...props
}: {title?: string; className?: string; children: Markdown} & Omit<
  React.ComponentProps<typeof ReactMarkdown>,
  'children'
>) {
  let content = children.raw;
  if (title) {
    content = `# ${title}\n${content}`;
  }
  return (
    <ReactMarkdown className={`${styles.body} ${className}`} {...props}>
      {content}
    </ReactMarkdown>
  );
}
