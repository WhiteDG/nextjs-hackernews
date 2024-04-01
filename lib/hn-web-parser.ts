import * as cheerio from "cheerio"

import { HnProfile } from "./hn-types"
import { HnWebStory, HnWebThread } from "./hn-web-types"

export const hasLoginUrl = (html: string) => {
  const $ = cheerio.load(html)
  const loginUrl = $("a")
    .filter(function (i, el) {
      return $(this).text() === "login"
    })
    .attr("href")
  return loginUrl && loginUrl.startsWith("login?")
}

export const parseProfile = (html: string) => {
  const $ = cheerio.load(html)
  const logoutUrl = $("#logout").attr("href")
  const searchParams = new URLSearchParams(logoutUrl?.replace("logout?", ""))
  const authCode = searchParams.get("auth")
  const hmac = $('form input[name="hmac"]').val()
  const id = $(".athing td:eq(1) a").text()
  const created = $("form > table tr:eq(1) td:eq(1) a").text()
  const karma = $("form > table tr:eq(2) td:eq(1)").text()
  const about = $("form > table tr:eq(3) td:eq(1) textarea").text()
  const email = $("form > table tr:eq(5) td:eq(1) input").val()
  const showd = $(
    'form > table tr:eq(6) td:eq(1) select option[selected="t"]'
  ).text()
  const nopro = $(
    'form > table tr:eq(7) td:eq(1) select option[selected="t"]'
  ).text()
  const maxv = $("form > table tr:eq(8) td:eq(1) input").val()
  const mina = $("form > table tr:eq(9) td:eq(1) input").val()
  const delay = $("form > table tr:eq(10) td:eq(1) input").val()
  return {
    id,
    hmac,
    created,
    karma,
    about,
    email,
    showd,
    nopro,
    maxv,
    mina,
    delay,
    authCode,
    myself: true,
  } as HnProfile
}

export const parseBody = (html: string) => {
  const $ = cheerio.load(html)
  return $("body")
    .contents()
    .filter(function () {
      return this.nodeType === 3
    })
    .text()
    .trim()
}

const buildCommentTree = (parsedComments: HnWebThread[]) => {
  const tree: HnWebThread[] = []
  for (let i = 0; i < parsedComments.length; i++) {
    const comment = parsedComments[i]
    if (comment.indent === 0) {
      // root comment
      tree.push(comment)
    } else {
      for (let j = i - 1; j >= 0; j--) {
        const parentElement = parsedComments[j]
        // find parent
        if (parentElement.indent === comment.indent - 1) {
          const kids = parentElement.kids || []
          kids.push(comment)
          parentElement.kids = kids
          break
        }
      }
    }
  }
  return tree
}

export const parseThreads = (html: string) => {
  const $ = cheerio.load(html)
  $(".reply").remove()
  const $commentRows = $("tr.athing")
  const parsedComments = $commentRows
    .map((i, tr) => {
      const $this = $(tr)
      const id = Number($this.attr("id"))
      const indent = Number($this.find(".ind").attr("indent") || 0)
      const age = $this.find(".age a").text()
      const timeStr = $this.find(".age").attr("title")
      let time = 0
      if (timeStr) {
        time = new Date(timeStr).getTime()
      }
      const userId = $this.find(".hnuser").text()
      const onStory = $this.find(".onstory a").text()
      let storyLink
      if (onStory) {
        storyLink = "/" + $this.find(".onstory a").attr("href")
      }
      const commentHtml = $this.find(".commtext").html()
      return {
        id,
        indent,
        age,
        time,
        userId,
        onStory,
        storyLink,
        commentHtml,
        kids: [],
      } as HnWebThread
    })
    .get()

  const comments = buildCommentTree(parsedComments)
  let moreLink = $(".morelink").attr("href")
  if (moreLink) {
    moreLink = moreLink.substring(moreLink.indexOf("&") + 1)
  }
  return { comments, moreLink }
}

export const parseStories = (html: string) => {
  const $ = cheerio.load(html)
  const $athingTrs = $("tr.athing")

  const athings = $athingTrs
    .map((i, athing) => {
      const $this = $(athing)
      const id = Number($this.attr("id"))
      const rank = $this.find(".rank").text()
      const title = $this.find(".titleline a").first().text()
      let url = $this.find(".titleline a").attr("href")
      if (url && url.startsWith("item")) {
        url = "/" + url
      }
      const sitestr = $this.find(".sitestr").text()
      const dead = !url
      return {
        id,
        rank,
        title,
        url,
        sitestr,
        dead,
      }
    })
    .get()

  const $athingSublines = $("span.subline")
  const sublines = $athingSublines
    .map((i, subline) => {
      const $this = $(subline)
      const score = $this.find(".score").text()
      const by = $this.find(".hnuser").text()
      const age = $this.find(".age").text()
      const timeStr = $this.find(".age").attr("title")
      let time = 0
      if (timeStr) {
        time = new Date(timeStr).getTime()
      }
      let comments = $this.find("a").last().text()
      if (comments === "past") {
        comments = ""
      }
      return {
        score,
        by,
        age,
        time,
        comments,
      }
    })
    .get()

  const storyList = athings.map(
    (athing, i) =>
      ({
        ...athing,
        ...sublines[i],
      }) as HnWebStory
  )
  let moreLink = $(".morelink").attr("href")
  if (moreLink) {
    moreLink = moreLink.substring(moreLink.indexOf("&") + 1)
  }
  return { storyList, moreLink }
}
