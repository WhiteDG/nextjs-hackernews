import HtmlText from "@/components/html-text"

export default async function TabAbout({ content }: { content?: string }) {
  return <HtmlText innerHtml={content} className="pt-2" />
}
