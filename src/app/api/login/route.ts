import { NextResponse } from "next/server"
import * as jwt from 'jose'

export async function POST(request: Request) {
  const data = await request.json();
  const { username, password } = data;
  console.log(username, password)
  return NextResponse.json({ message: "Deez nuts" }, { status: 200 });
}