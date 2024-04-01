export interface HnWebStory {
  id: number
  rank?: string
  title: string
  url: string
  sitestr: string
  score: string
  by: string
  age: string
  time: number
  comments: string
  dead: boolean
  upvoted?: boolean
}

export interface HnWebThread {
  id: number
  indent: number
  age: string
  time: number
  userId: string
  onStory: string
  storyLink: string
  commentHtml: string
  kids: HnWebThread[]
}

export enum VoteStatus {
  up = "up",
  un = "un",
}
