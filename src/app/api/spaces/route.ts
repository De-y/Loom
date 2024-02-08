import { NextResponse } from "next/server";

export async function GET(request: Request) {
    return NextResponse.json({
        'availableSpaces': [
            {
                'name': 'Algebra 1',
                'url': '/spaces/algebra1',
            },
            {
                'name': 'Algebra 2',
                'url': '/spaces/algebra2',
            },
            {
                'name': 'Precalculus',
                'url': '/spaces/precalculus'
            },
            {
                'name': 'English',
                'url': '/spaces/english'
            }
        ]
    })
}