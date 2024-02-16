import { NextResponse } from "next/server"

export async function GET(request: Request) {
    let i = request.url.split('/')
    // @ts-ignore
    console.log(request.headers)
    // @ts-ignore
    i = i[i.length - 1]
    console.log(i)
    return NextResponse.json({
        'status': 'OK'
    })
}