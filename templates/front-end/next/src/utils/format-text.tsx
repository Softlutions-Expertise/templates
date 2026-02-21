export function InnerHTML(html: string) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
