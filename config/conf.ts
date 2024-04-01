import { HnStoryType } from "@/lib/hn-types"

export const storyNavConfig = [
  {
    name: "Top",
    link: "/top",
    type: HnStoryType.topstories,
  },
  {
    name: "New",
    link: "/new",
    type: HnStoryType.newstories,
  },
  {
    name: "Best",
    link: "/best",
    type: HnStoryType.beststories,
  },
  {
    name: "Ask",
    link: "/ask",
    type: HnStoryType.askstories,
  },
  {
    name: "Show",
    link: "/show",
    type: HnStoryType.showstories,
  },
  {
    name: "Jobs",
    link: "/jobs",
    type: HnStoryType.jobstories,
  },
  // {
  //   name: 'Submit',
  //   link: '/submit',
  // },
]

export const showStoryNav = (pathname: string) => {
  return !["/login", "/signup"].includes(pathname)
}

export const profileTabs = [
  {
    label: "About",
    public: true,
  },
  {
    label: "Submitted",
    public: true,
  },
  {
    label: "Comments",
    public: true,
  },
  {
    label: "Favorites",
    public: true,
  },
  {
    label: "Upvoted",
    public: false,
  },
]

export const siteConf = {
  title: "Hacker News",
  description:
    "A Hacker News clone website built with TypeScript, Next.js, and Shadcn/UI.",
  authors: [
    {
      name: "White",
      url: "https://github.com/WhiteDG",
    },
  ],
  links: {
    github: "https://github.com/WhiteDG/nextjs-hackernews",
    next: "https://nextjs.org",
    shadcn: "https://ui.shadcn.com",
  },
}
