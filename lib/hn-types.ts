export enum HnItemType {
  job = "job",
  story = "story",
  comment = "comment",
  poll = "poll",
  pollopt = "pollopt",
}

export enum HnStoryType {
  topstories = "topstories",
  newstories = "newstories",
  beststories = "beststories",
  askstories = "askstories",
  showstories = "showstories",
  jobstories = "jobstories",
}

export interface HnItem {
  id: number
  deleted?: boolean
  type?: HnItemType
  by?: string
  time: number
  text?: string
  dead?: boolean
  parent?: number
  poll?: number
  kids?: number[]
  url?: string
  score: number
  title?: string
  parts?: number[]
  descendants: number
}

export interface HnComment extends HnItem {
  comments: HnComment[]
}

export interface HnUser {
  about?: string
  created: number
  id: string
  karma?: number
  submitted?: number[]
}

export interface HnProfile {
  id: string
  hmac?: string
  created?: string
  karma?: string
  about?: string
  email?: string
  showd?: string
  nopro?: string
  maxv?: string
  mina?: string
  delay?: string
  authCode?: string
  myself?: boolean
}

export interface HnSearchItem {
  author: string
  comment_text: string
  created_at: string
  created_at_i: number
  objectID: string
  parent_id: string
  points?: number
  story_id: number
  story_title: string
  story_url?: string
  updated_at: string
}
