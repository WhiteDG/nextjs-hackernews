import { siteConf } from "@/config/conf"

export default function Logo() {
  return (
    <div className="md:flex">
      <p className="text-lg font-extrabold">{siteConf.title}</p>
    </div>
  )
}
