import * as fs from 'fs'

export async function getImage() {
    const f_list = await fs.readdirSync('./public/images')
    return `${f_list[Math.floor(Math.random() * f_list.length)]}`
}